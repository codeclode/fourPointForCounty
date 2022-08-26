// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      "水果",
      "蔬菜",
      "快速发货",
      "24小时服务",
      "热带产物",
      "瓜类",
    ],
    products: [],
    pageNumber: 1,
    keyword: '',
    type: '',
    all: false
  },
  async loadMore() {
    if (this.data.all) {
      return;
    }
    wx.cloud.callFunction({
      name: "product",
      data: {
        pageNumber: this.data.pageNumber
      }
    }).then(res => {
      console.log(res);
      if (res.result === "error") {
        wx.showToast({
          title: '网络错误',
        })
      } else {
        var products = this.data.products;
        products.push(...res.result);
        if (res.result.length === 0) {
          this.setData({
            all: true
          })
        }
        this.setData({
          products,
          pageNumber: this.data.pageNumber + 1
        })
      }
    })
  },
  onLoad() {
    this.loadMore();
  },
  onPullDownRefresh: function () {
    this.setData({
      products: [],
      pageNumber: 1,
      keyword: '',
      type: '',
      all: false
    });
    this.onLoad();
    this.onRefresh();
  },

  onRefresh: function () {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: 'Loading...',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000)
  },

  search(e) {
    // console.log(e.detail.keyWord);
    if (this.data.keyWord === e.detail.keyWord) {
      return
    }
    this.setData({
      keyword: e.detail.keyWord,
      pageNumber: 1,
      products: [],
      all: false
    });
    this.searchProducts();
  },
  changeType(e) {
    //console.log(e.detail.activeType);
    if (this.data.type === e.detail.activeType) {
      return
    }
    this.setData({
      type: e.detail.activeType,
      pageNumber: 1,
      products: [],
      all: false
    })
    this.searchProducts();
  },
  async searchProducts() {
    if (this.data.all) {
      return
    }
    var products = this.data.products;
    await wx.cloud.callFunction({
      name: "product",
      data: {
        pageNumber: this.data.pageNumber,
        keyword: this.data.keyword,
        type: this.data.type
      }
    }).then(res => {
      if (res.result.length === 0) {
        this.setData({
          all: true
        })
        return
      }
      products.push(...(res.result));
      this.setData({
        products,
        pageNumber: this.data.pageNumber + 1
      })
    })
  }
})