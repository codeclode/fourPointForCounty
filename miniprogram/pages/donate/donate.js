// pages/donate/donate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {
        iconName:"yanshou",
        detail:"捐赠我的物品",
        url:"../donateForm/donateForm",
        requireLogin:true
      },
      {
        iconName:"wendang",
        detail:"查看捐赠榜单",
        url:"../rank/rank"
      },
      {
        iconName:"shoucang",
        detail:"我的参与的活动",
        url:"../myActivities/myActivities",
        requireLogin:true
      },
      {
        iconName:"qianbao",
        detail:"有货要卖",
        url:"../sale/sale",
        requireLogin:true
      },
      {
        iconName:"shangpintongji",
        detail:"我的商品",
        url:"../myproducts/myproducts",
        requireLogin:true
      },
      {
        iconName:"dianhua",
        detail:"联系我们",
      }
    ],
    showContact:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  contact(){
    this.setData({
      showContact:true
    })
  }
})