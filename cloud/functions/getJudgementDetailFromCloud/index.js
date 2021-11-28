 const cloud = require('wx-server-sdk')


exports.main = async (event, context) => {
  console.log(event)
  const rowKey = event.rowKey || '610d0a7b39fd4648877cac79011f1622'

  const wxContext = cloud.getWXContext();

  // 声明新的 cloud 实例
  const c1 = new cloud.Cloud({
    // 资源方 AppID
    resourceAppid: 'wxda1f6a54b87f0ad8',
    // 资源方环境 ID
    resourceEnv: 'dev-nv9fr',
  })
  // 跨账号调用，必须等待 init 完成
  // init 过程中，资源方小程序对应环境下的 cloudbase_auth 函数会被调用，并需返回协议字段（见下）来确认允许访问、并可自定义安全规则
  await c1.init()

  const db = c1.database()

  // 完成后正常使用资源方的已授权的云资源
  return await db.collection('civil-case-detail-5')
      .where({rowKey}).get()
}
