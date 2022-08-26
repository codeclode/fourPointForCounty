// components/typeChoice/typechoice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeItem: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeType(e) {
      this.setData({
        activeItem: e.currentTarget.dataset.value == this.data.activeItem ? '' : e.currentTarget.dataset.value
      })
      this.triggerEvent("changeType", {
        activeType: this.data.activeItem
      })
    }
  },
  lifetimes: {}
})