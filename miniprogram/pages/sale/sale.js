// pages/sale/sale.js
const {
  uploadImgs
} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsURL: [],
    name: "",
    place: "",
    introduce: "",
    ways: [],
    tags: [],
    update: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        update: true,
        id: options.id
      })
      wx.cloud.callFunction({
        name: "product",
        data: {
          productID: options.id,
        }
      }).then(res => {
        this.setData(res.result);
        this.setData({
          imgsURL: []
        })
      })
    }
  },
  getField(e) {
    var field = e.currentTarget.dataset.field;
    var value = e.detail.value;
    if ((field === 'name' || field === 'name') && value.length > 30) {
      wx.showToast({
        title: '超过长度限制（30）',
        icon: "error"
      });
      return;
    } else if (field === 'introduce' && value.length > 200) {
      wx.showToast({
        title: '超过长度限制',
        icon: "error"
      });
      return;
    }
    this.setData({
      [e.currentTarget.dataset.field]: e.detail.value.trim()
    })
  },
  addTag(e) {
    wx.showModal({
      title: "输入标签内容",
      editable: true,
      success: (e) => {
        if (!e.confirm) {
          return;
        }
        if (e.content.trim().length === 0) {
          return;
        }
        var tags = this.data.tags;
        tags.push(e.content.trim());
        this.setData({
          tags
        })
      }
    })
  },
  deleteTag(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    wx.showModal({
      title: `确认删除标签${this.data.tags[index]}？`,
      success: (e) => {
        if (!e.confirm) {
          return;
        }
        var tags = this.data.tags;
        tags.splice(index, 1);
        this.setData({
          tags
        })
      }
    })
  },
  addImg() {
    wx.chooseMedia({
      count: 9 - this.data.imgsURL.length,
      mediaType: ['image'],
      success: (res) => {
        var imgs = this.data.imgsURL;
        var newimgs = res.tempFiles.map(value => {
          return value.tempFilePath
        })
        imgs.push(...(newimgs));
        this.setData({
          imgsURL: imgs
        })
      }
    })
  },
  deleteImg(e) {
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: "确认删除？",
      success: (e) => {
        if (!e.confirm) {
          return;
        }
        var imgs = this.data.imgsURL;
        imgs.splice(index, 1);
        this.setData({
          imgsURL: imgs
        })
      }
    })

  },
  cansubmit() {
    if (this.data.name.trim() === '') {
      wx.showToast({
        title: '物品名称未填写',
        icon: "error"
      })
      return false;
    }
    if (this.data.place.trim() === '') {
      wx.showToast({
        title: '您的地址未填写',
        icon: "error"
      })
      return false;
    }
    if (this.data.ways.length === 0) {
      wx.showToast({
        title: '请至少填写一个渠道',
        icon: "none"
      })
      return false;
    }
    if (this.data.ways[this.data.ways.length - 1].wayName.trim() === '' ||
      this.data.ways[this.data.ways.length - 1].wayDetail.trim() === '') {
      wx.showToast({
        title: '请完整填写渠道内容',
        icon: "none"
      })
    }
    if (this.data.imgsURL.length === 0) {
      wx.showToast({
        title: '至少一张图片',
        icon: "error"
      })
      return false;
    }
    return true
  },
  async submit() {
    if (!this.cansubmit()) {
      return;
    }
    this.setData({
      loading: true
    })

    var submitData = {
      name: this.data.name,
      place: this.data.place,
      introduce: this.data.introduce,
      imgsURL: [],
      tags: this.data.tags,
      ways: this.data.ways
    }
    await uploadImgs(this.data.imgsURL, "product").then(res => {
      submitData.imgsURL = res;
      return submitData;
    }).then(async productData => {
      await wx.cloud.callFunction({
        name: "product",
        data: {
          productData: productData,
          update: this.data.update,
          productID: this.data.id
        }
      }).then(res => {
        if (res.result == "error") {
          wx.showToast({
            title: '异常，请重试',
            icon: "error",
            loading: false
          })
        } else {
          this.setData({
            submitSuccess: true,
            loading: false,
            imgsURL: [],
            name: "",
            place: "",
            introduce: "",
            ways: [],
            tags: []
          })
        }
      })
    })
  },
  lookMyProduct() {
    wx.redirectTo({
      url: '../myproducts/myproducts',
    })
  },
  addWay() {
    if (this.data.ways.length >= 5) {
      return;
    }
    var ways = this.data.ways;
    if (ways.length === 0 ||
      ways[ways.length - 1].wayName.trim() !== '' &&
      ways[ways.length - 1].wayDetail.trim() !== '') {
      ways.push({
        wayName: '',
        wayDetail: ''
      })
    } else {
      wx.showToast({
        title: '请先完成当前内容',
        icon: "none"
      })
    }
    this.setData({
      ways
    })
  },
  updateWayName(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value
    var ways = this.data.ways;
    ways[index].wayName = value;
    this.setData({
      ways
    })
  },
  updateWayDetail(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value
    var ways = this.data.ways;
    ways[index].wayDetail = value;
    this.setData({
      ways
    })
  },
  deleteWay() {
    if (this.data.ways.length === 0) {
      return;
    }
    wx.showModal({
      title: "确认删除？",
      success: () => {
        this.data.ways.pop();
        this.setData({
          ways: this.data.ways
        })
      }
    })
  }
})