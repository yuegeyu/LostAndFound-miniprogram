export const formatTime = (time) => {//日期格式化编辑
    const _time = new Date(time);
    const y = _time.getFullYear();
    const m = _time.getMonth() + 1;
    const d = _time.getDate();
    const h=_time.getHours();//以下为时分秒的显示，不想要删了即可
    const _m  =_time.getMinutes();
    const s =_time.getSeconds();

    return `${y}-${m}-${d} ${h}:${_m}:${s}`;
}
//ajax请求封装
export const ajax = (url, method, data) => {
    const base_url = 'http://116.62.25.90:3001';//'http://localhost:3001';//
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${base_url}${url}`,
          method: method ? method : 'GET',
          data,
          success: (res) => {
              resolve(res);
          },
          fail: (err) => {
              reject(err);
          }
        })
    })
}