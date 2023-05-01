// pages/infoDetail/infoDetail.js
//import { noneParamsEaseFuncs } from 'XrFrame/xrFrameSystem';
import { ajax ,formatTime} from '../../utils/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['../../images/banner1.jpeg', '../../images/banner2.jpeg'],
        collectionIcon: ['../../images/collection1.png', '../../images/collection1_fill.png'],
        info: {},
        from: '',
        comment:'',
        showModal:false,
        desc:'',
        img_url:'',
    },


    uploadImg(){
        wx.chooseMedia({  //获取文件组成临时路径
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const { tempFiles } = res;
             //   console.log(tempFiles);
             wx.uploadFile({
                url: 'http://116.62.25.90:3001/uploadImg',
                filePath: tempFiles[0].tempFilePath,
                name: 'file',
                success: (res) => {
                  //  console.log(res)
                    const { data } = res;
                    let { path } = JSON.parse(data)[0];
                    //解决路径中反斜杠造成小程序ipv6协议无法解析的问题（浏览器可以解析）
                    let __path= path.split('\\')  //以反斜杠为基点将字符串拆分为数组
                  //  console.log(__path)
                    let _path = `http://116.62.25.90:3001/${__path[0]}`;
      
                    this.setData({
                        img_url:_path
                    })
                    
                //   const data = res.data
                  //do something
                },
                fail: (err) => {
                //    console.log(err);
                }
            })
            }
        })
    },
    getDesc(e){
        this.setData({
           desc: e.detail.value
        })
    },

    async submit(){
        const {desc,img_url,info:{_id}} =this.data;
        if(!desc || !img_url){
            wx.showToast({
              title: '存在必填项未填!',
              icon:'none',
            })
            return;
        }

        const params={
            desc,
            img_url,
            openid:wx.getStorageSync('openid'),
            _id
        };

        const {data}= await ajax('/toClaim','POST',params);
        if(data==="success"){
            this.setData({
                showModal:false
            });
            wx.switchTab({
              url: '../index/index',
              success:()=>{
                  wx.showToast({
                    title: '提交成功！',
                    icon:'none'
                  })
              }
            })
        }else{
            wx.showToast({
              title: '提交失败！',
              icon:'none'
            })
        }




   
    },


    cancel(){
        this.setData({
            showModal:false
        })
    },
    toClaim(){
        this.setData({
            showModal:true
        })
    },
 
    getComment(e){
        this.setData({
            comment:e.detail.value
        })
    },
    async submitComment(){
        const {comment, info:{_id}} =this.data;
        if(comment.trim().length===0){//.trim()函数去掉字符串中的括号
            wx.showToast({
              title: '您输入的内容为空',
              icon:'none'
            })
            return;
        }
        const {avatarUrl,nickName}=wx.getStorageSync('userInfo');//取缓存的方法
        const params={
            avatarUrl,nickName,
            content:comment,
            time:new Date().getTime(),
            _id,
        };
        const {data:{status,data} }= await ajax('/addComment','POST',params);
        if(status=="success"){
            wx.showToast({
              title: '评论成功！！',
              icon:'none'
            })
            data.commentList.forEach(item=>{
                item.time=formatTime(item.time)
            })
            this.setData({
                info:data,
                comment:''
            })
        }else{
            wx.showToast({
              title: '评论失败！',
              icon:'none'
            })
        }
    },

    async toCollection() {
        const { info, collectionIcon, from } = this.data;
        console.log(this.data)
     const { 
                 _id
             } = info
        if (collectionIcon[0] === '../../images/collection1.png') {  //原是0；应该是collectionIcon[0]为conllection1.png，但是此处是第1个元素，待排查
         
            // 想收藏
            const params = {
               
                id: _id,
                openid: wx.getStorageSync('openid')  
            }
            const result = await ajax('/toCollection', 'POST', params);
            const { data } = result;

            if (data === "success") {
                wx.showToast({
                  title: '收藏成功!',
                  icon: 'none'
                })

                let last = collectionIcon.pop();
                collectionIcon.unshift(last);
                this.setData({
                    collectionIcon,
                })
            }
        } else {
            // 想取消收藏
            const params = {
                id: _id,
                openid: wx.getStorageSync('openid')
            };
            const result = await ajax('/cancelCollection', 'POST', params);
            const { data } = result;
            if (data === "success") {
                wx.showToast({
                  title: '取消成功',
                  icon: 'none'
                })
                let last = collectionIcon.pop();
                collectionIcon.unshift(last);
                this.setData({
                    collectionIcon,
                })
            }
        }


    },

    getPhone() {
        const { info: { phone } } = this.data;
        wx.showModal({
          title: '联系方式',
          content: phone,
          confirmText: '复制',
          success: (res) => {
            if (res.confirm) {
                wx.setClipboardData({
                  data: phone,
                  success: (res) => {
                      wx.showToast({
                        icon: 'none',
                        title: '内容已复制',
                      })
                  }
                })
            }
          }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
       // console.log(this.data)
        const { collectionIcon } = this.data;
        const { _id } = options;
        const _params={
            _id
        }
        const {data:info } =await ajax('/getDetail','POST',_params); //data:info，data解构后更名为info
        //console.log(JSON.parse(info));//将字符串转回json对象

        info.commentList.forEach(item=>{
            item.time=formatTime(item.time);
        })
        this.setData({
            info,
           
        })
       // console.log('输出这个页面的详细数据')
       // console.log(info)

        const params = {
            id:_id,
            openid: wx.getStorageSync('openid')
        };
        const result = await ajax('/checkCollection', 'POST', params);
        const { data } = result;
        if (data.length > 0) {
            let last = collectionIcon.pop();
            collectionIcon.unshift(last);
            this.setData({
                collectionIcon,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})