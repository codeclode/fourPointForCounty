// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    pageNumber: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadMore();
  },

  loadMore() {
    wx.cloud.callFunction({
      name: "userInfoOptions",
      data: {
        rankPage: this.data.pageNumber
      },
      success: (res) => {
        console.log(res);
        if (res.result.length < 10) {
          this.setData({
            overed: true
          })
        }
        var userList = this.data.userList;
        var pageNumber = this.data.pageNumber + 1;
        userList.push(...res.result);
        this.setData({
          userList,
          pageNumber
        })
      }
    })
  }
})