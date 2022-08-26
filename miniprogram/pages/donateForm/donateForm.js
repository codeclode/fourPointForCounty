// pages/donateForm/donateForm.js
import {
  uploadImgs
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    name: '',
    place: '',
    introduce: '',
    submitSuccess: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(1);
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
  addImg() {
    wx.chooseMedia({
      count: 9 - this.data.imgs.length,
      mediaType: ['image'],
      success: (res) => {
        var imgs = this.data.imgs;
        var newimgs = res.tempFiles.map(value => {
          return value.tempFilePath
        })
        imgs.push(...(newimgs));
        this.setData({
          imgs: imgs
        })
      }
    })
  },
  deleteImg(e) {
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: "确认删除？",
      success: () => {
        var imgs = this.data.imgs;
        imgs.splice(index, 1);
        this.setData({
          imgs
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
    if (this.data.imgs.length === 0) {
      wx.showToast({
        title: '请至少上传一张图片',
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
      imgsURL: []
    }
    await uploadImgs(this.data.imgs, "donate").then(res => {
      submitData.imgsURL = res;
      return submitData;
    }).then(async donateDate => {
      await wx.cloud.callFunction({
        name: "donate",
        data: {
          donateDate: donateDate
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
            loading: false
          })
        }
      })
    })
  },
  submitAgain() {
    this.setData({
      imgs: [],
      name: '',
      place: '',
      introduce: '',
      submitSuccess: false
    })
  }
})