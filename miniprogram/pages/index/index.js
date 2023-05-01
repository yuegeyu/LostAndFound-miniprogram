import { formatTime, ajax } from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['http://116.62.25.90:3001/file/247c8d54-fa95-482d-ba27-81d7c7754a9f.jpg', 'http://116.62.25.90:3001/file/f7cd24cf-2dea-4757-a91c-34d48e4d8550.jpg','http://116.62.25.90:3001/file/b35dd78d-7c3f-413d-ad79-17dd73b9caf2.jpg','http://116.62.25.90:3001/file/71fc4327-a09d-4201-bf23-7c7ce7ed69ee.jpg'],
    tabList: ['寻主', '寻物'],
    select: 0,
    list: []
  },

  toSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  toDetail(e) {
    const { info:{_id ,state}  } = e.currentTarget.dataset;
 // console.log(info)
 //如果易被认领则不再允许点击查看详情
    if(state===2){
        wx.showToast({
          title: '该物品已被认领，如有疑问请联系管理员',
          icon:'none'
        })
        return//返回不继续执行下去了
    }
    wx.navigateTo({
      url: `../infoDetail/infoDetail?_id=${_id}`,//跳转infoDetail页面并传参id，JSON.stringify函数将对象字符串化
    })
  },

  getTab(e) {
    this.setData({
        select: e.detail  //组件间通信，子组件已传参入e.detail，即通过getTab这个中间函数实现通信
    })
    this.onLoad();//每一次切换寻主寻物都重新加载主页以此实现切换时寻主寻物的展示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { select } = this.data;
    const params = {
        type: select
    }

   if (!wx.getStorageSync('login_account')) {   //未登录自动跳转
       wx.redirectTo({
          url: '../login/login',
        })
    }//if(0) {} 
   else {
        const result = await ajax('/getLose', 'GET', params); 
       // console.log(result);
        const { data } = result;//js的解构，将result对象中的data拿出来，可以直接使用，不用再命名别的变量重新赋值
        this.setData({
            list: data.map(item => {
                return {
                    ...item,//扩展运算符，取出当前对象所有属性
                    time: formatTime(item.time)//引用formatTime函数，自己封装在utiles里面
                }
            })
        })
        const openid = wx.getStorageSync('openid');
   // console.log(openid)
        if (!openid) {  //!openid，记得改回去
            const { code } = await wx.login();
            const params1 = {//请求要传递的data对象
                code
            };
           const result1 = await ajax('/login', 'GET', params1);
           console.log(result1);
            const { data } = result1;
            if (data !== "error") {
              wx.setStorageSync('openid', data);
            }
        }
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   // console.log(123);
    this.onLoad();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
            select: 0
        })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})