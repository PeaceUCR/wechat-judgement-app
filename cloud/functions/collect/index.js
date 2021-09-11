 const cloud = require('wx-server-sdk')

 // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.where.html
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  const db = cloud.database()

  const res = await db.collection('collection').where({
    //下面这3行，为筛选条件
    openId
  }).get();

  if (res.data && res.data.length >= 50) {
    return {errMsg: '每个用户不能添加超过50个收藏！'};
  }

  return await db.collection("collection").add({
    data: {
      openId: openId,//获取操作者_openid的方法
      rowKey: event.rowKey,
      type: event.type,
      title: event.title,
      time: new Date()
    }
  })

}
