// app.js
const {
  uuid
} = require("./utils/util")
App({
  onLaunch() {
    wx.cloud.init({
      env: "cloudforcountry-2gm8byjtf2db1e54"
    });
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    })
  },
  globalData: {
    userInfo: null
  }
})