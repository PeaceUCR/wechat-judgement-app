const cloud = require('wx-server-sdk')

 // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.where.html
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext();
  const db = cloud.database()

  const {
    law,
    number,
    searchValue
  } = event

  let regexpString2
  if (searchValue && searchValue.trim()) {
    regexpString2 = `.*${searchValue}`
  }

  const dbName = law === 'criminal' ? 'criminal-case' : ''

  // match By own criminal law
  const resultMatchByCriminalLaw = await db.collection(dbName).where({
    criminalLaw: parseInt(number),
    opinion: regexpString2 ? db.RegExp({
      regexp: regexpString2,
      options: 'i',
    }) : undefined
  }).limit(100).orderBy('date', 'desc').get()

  // exact match BY law
  const resultMatchByLaw = await db.collection(dbName).where({
    law: parseInt(number),
    opinion: regexpString2 ? db.RegExp({
      regexp: regexpString2,
      options: 'i',
    }) : undefined
  }).limit(100).orderBy('date', 'desc').get()
  // exact match BY opinion

  const all = [...resultMatchByCriminalLaw.data, ...resultMatchByLaw.data]

  const removeDuplicates = all.filter((v,i,a)=>a.findIndex(t=>(t.rowkey === v.rowkey))===i)

  return  {data: removeDuplicates};

}
