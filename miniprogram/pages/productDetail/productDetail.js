// pages/productDetail/productDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {},
  },

  onLoad(options) {
    wx.cloud.callFunction({
      name: "product",
      data: {
        productID: options.id
      }
    }).then(res => {
      if (res.result == "error") {
        wx.showToast({
          title: '网络错误',
        })
      } else {
        this.setData({
          productInfo: res.result
        })
      }
    })
  },
  report() {
    console.log("举办");
  },
  collect() {
    if (this.data.productInfo.isCollected) {
      return;
    }
    console.log("收藏");
  }
})