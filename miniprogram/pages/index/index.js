// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    products: [],
    swpierItems: [],
    activitiesList: [],
    userList: []
  },
  onLoad() {
    this.getSwiper();
    this.getRank();
    this.getActivities();
    this.getProducts();
  },
  getSwiper() {
    wx.cloud.callFunction({
      name: "other",
      data: {
        option: "getSwiper"
      }
    }).then(res => {
      if (res.result === "error") {
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
      } else {
        this.setData({
          swpierItems: res.result
        })
      }
    })
  },
  getProducts() {
    wx.cloud.callFunction({
      name: "product",
      data: {
        pageNumber: 1
      }
    }).then(res => {
      this.setData({
        products: res.result
      })
    })
  },
  changeType(e) {
    console.log(e.detail.activeType);
    //动态地获取商品列表
  },
  goTab(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.value,
    })
  },
  getRank() {
    wx.cloud.callFunction({
      name: "userInfoOptions",
      data: {
        rankPage: 1
      },
      success: (res) => {
        var userList = this.data.userList;
        console.log(res.result);
        if (res.result) {
          userList.push(...res.result);
          this.setData({
            userList
          })
        }
      }
    })
  },
  getActivities() {
    wx.cloud.callFunction({
      name: "activities",
      data: {
        pageNumber: 1
      }
    }).then(res => {
      console.log(res);
      var activitiesList = this.data.activitiesList;
      activitiesList.push(...res.result);
      this.setData({
        activitiesList: activitiesList
      })
    })
  },
  switchPage(e) {
    var {
      type,
      value
    } = e.currentTarget.dataset;
    console.log(type);
    if (type === "activity") {
      wx.navigateTo({
        url: `../schoolActivity/schoolActivity?id=${value}`,
      })
    } else if (type === "product") {
      wx.navigateTo({
        url: `../productDetail/productDetail?id=${value}`,
      })
    }
  }
})