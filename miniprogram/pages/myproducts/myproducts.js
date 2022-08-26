// pages/myproducts/myproducts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: "userInfoOptions",
    }).then(async res => {
      await wx.cloud.callFunction({
        name: "product",
        data: {
          productsID: res.result.products
        }
      }).then(res => {
        console.log(res);
        this.setData({
          products: res.result
        })
      })
    })
  },
  delete(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: "确认删除？",
      success: () => {
        console.log("删除");
        wx.cloud.callFunction({
          name: "product",
          data: {
            deleteOption: true,
            productID: id
          }
        }).then(() => {
          wx.redirectTo({
            url: './myproducts',
          })
        }).catch(() => {
          wx.showToast({
            title: '网络异常',
          })
        })
      }
    })
  },
  update(e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/sale/sale?id=${id}`,
    })
  }

})