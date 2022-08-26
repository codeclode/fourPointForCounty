// pages/school/school.js
const {
  changeActivityFormat
} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searched: false,
    activitiesList: [],
    swiperItems: [],
    pageNumber: 1,
    keyWord: ''
  },
  onLoad() {
    wx.cloud.callFunction({
      name: "activities",
      data: {
        pageNumber: 1
      }
    }).then(res => {
      var activitiesList = this.data.activitiesList;
      var swiperItems = [];
      res.result.forEach((value, i) => {
        changeActivityFormat(value, i);
        if (i < 5) {
          swiperItems.push(value);
        }
      })
      activitiesList.push(...res.result);
      this.setData({
        activitiesList: activitiesList,
        swiperItems: swiperItems
      })
    })
  },
  search: function (e) {
    var keyWord = e.detail.keyWord;
    if (keyWord.trim() === this.data.keyWord.trim()) {
      return;
    }
    this.setData({
      keyWord: keyWord,
      pageNumber: 1,
      all: false
    });
    if (this.data.keyWord.trim() === '') {
      this.setData({
        searched: false
      })
    } else {
      this.setData({
        searched: true
      })
    }
    this.getMore();
    /*获取搜索结果并重新设置活动们*/
  },
  onReachBottom() {
    if (this.data.all === true || this.data.searched === false) {
      return
    } else {
      this.getMore();
    }
  },
  getMore() {
    wx.cloud.callFunction({
      name: "activities",
      data: {
        keyWord: this.data.keyWord,
        pageNumber: this.data.pageNumber
      }
    }).then(res => {
      var activitiesList = [];
      res.result.forEach((value, i) => {
        changeActivityFormat(value, i);
      })
      if (res.result.length === 0) {
        this.setData({
          all: true
        });
      }
      activitiesList.push(...res.result);
      this.setData({
        activitiesList: activitiesList,
        searched: true,
        pageNumber: this.data.pageNumber + 1
      })
    })
  }
})