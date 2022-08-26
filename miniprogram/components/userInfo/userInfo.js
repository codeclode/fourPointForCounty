// components/userInfo/userInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    logined: false,
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo() {
      wx.getUserProfile({
        desc: '登录',
        success: (res) => {
          this.setData({
            logined: true,
            userInfo: res.userInfo
          })
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo
          })
          this.getUserFromDataBase(res.userInfo);
        }
      })
    },
    getUserFromDataBase(userInfo) {
      wx.cloud.callFunction({
        name: "userInfoOptions",
        data: {
          userInfo:userInfo
        }
      }).then(res => {
        var userInfo = this.data.userInfo;
        userInfo.donateScore = res.result.donateScore;
        userInfo.rank = res.result.rank
        this.setData({
          userInfo
        })
      })
    }
  },
  lifetimes: {
    attached() {
      var value = wx.getStorageSync('userInfo');
      if (value !== '') {
        this.setData({
          logined: true
        })
        this.setData({
          userInfo: value
        })
        this.getUserFromDataBase(value);
      }
    }
  }
})