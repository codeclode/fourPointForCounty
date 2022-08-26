// components/activities/activities.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activitiesList: Array
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
    gotoDetail(e){
      var id = e.currentTarget.dataset.activityid;
      wx.navigateTo({
        url: `/pages/schoolActivity/schoolActivity?id=${id}`,
      })
    }
  },
  lifetimes: {
  }
})