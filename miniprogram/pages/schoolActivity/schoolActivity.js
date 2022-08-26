// pages/schoolActivity/schoolActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityInfo: {},
    inparted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.cloud.callFunction({
      name: "activities",
      data: {
        id: options.id
      }
    }).then(res => {
      this.setData({
        activityInfo: res.result
      })
    }).then(async res => {
      var value = wx.getStorageSync('userInfo');
      if (value == "") {
        await wx.getUserProfile({
          desc: '登录',
          success: (res) => {
            wx.setStorage({
              key: "userInfo",
              data: res.userInfo
            })
            this.setData({
              userInfo: res.userInfo
            })
          }
        })
      } else {
        this.setData({
          userInfo: value
        })
      }
      wx.cloud.callFunction({
        name: "userInfoOptions",
        data:{
          userInfo:this.data.userInfo
        }
      }).then(res=>{
        if(res.result.activities.includes(options.id)){
          this.setData({
            inparted:true
          })
        }
      })
    })
  },
  inpart() {
    if (this.data.inparted) {
      return;
    }
    wx.showModal({
      title: "确定参加此活动？",
    }).then(res => {
      if (res.confirm) {
        wx.cloud.callFunction({
          name: "activities",
          data: {
            inpart: true,
            id: this.data.activityInfo._id
          }
        }).then(res => {
          if (res.result == "error") {
            wx.showToast({
              title: '错误，请稍后重试！',
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '报名成功',
            })
            this.setData({
              inparted: true
            })
          }
        }).catch(err => {
          wx.showToast({
            title: '错误，请稍后重试！',
            icon: "none"
          })
        })
      }
    })
  }
})