// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    active:false,
    keyWord:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search:function(){
      this.setData({
        active:true
      })
      setTimeout(() => {
        this.setData({
          active:false
        })
      }, 300);
      this.triggerEvent("search",{
        keyWord:this.data.keyWord
      })
    },
    changeKeyWord(e){
      this.setData({
        keyWord:e.detail.value.trim()
      })
    }
  }
})
