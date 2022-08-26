// pages/myActivities/myActivities.js
const {changeActivityFormat} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitiesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name:"userInfoOptions",
    }).then(async res=>{
      await wx.cloud.callFunction({
        name:"activities",
        data:{
          activitiesID:res.result.activities
        }
      }).then(res=>{
        var activitiesList = [];
        res.result.forEach((value,i) => {
          changeActivityFormat(value,i);
        })
        activitiesList.push(...res.result);
        this.setData({
          activitiesList: activitiesList
        })
      })
    })
  },
})