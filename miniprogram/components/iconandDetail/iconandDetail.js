// components/iconandDetail/iconandDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgAndDetail:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goTo(){
      if(this.data.imgAndDetail.requireLogin){
        if(!wx.getStorageSync('userInfo')){
          wx.showToast({
            title: '请先登录',
            icon:"error"
          })
          return;
        }        
      }
      if(!this.data.imgAndDetail.url){
        return;
      }
      console.log(this.data.imgAndDetail.url);
      wx.navigateTo({
        url: this.data.imgAndDetail.url,
      })
    }
  }
})
