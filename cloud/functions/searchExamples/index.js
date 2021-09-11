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
    searchValue,
    selectedCriminalKeywords
  } = event

  let regexpString

  if (selectedCriminalKeywords && selectedCriminalKeywords.length > 0) {
    if (searchValue && searchValue.trim()) {
      const finalKeywords = [...selectedCriminalKeywords, searchValue].filter(s => s)
      let joined = ''
      finalKeywords.forEach(key => joined = joined + `(?=.*${key})`)
      regexpString = `.*${joined}`
    } else {
      const finalKeywords = [...selectedCriminalKeywords].filter(s => s)
      let joined = ''
      finalKeywords.forEach(key => joined = joined + `(?=.*${key})`)
      regexpString = `.*${joined}`
    }
  } else {
    if (searchValue && searchValue.trim()) {
      regexpString = `.*${searchValue}`
    }
  }
  console.log('regexpString:', regexpString)
  const dbName = law === 'criminal' ? 'criminal-case' : ''

  // match By own criminal law
  const resultMatchByCriminalLaw = await db.collection(dbName).where({
    criminalLaw: number.toString(),
    opinion: regexpString ? db.RegExp({
      regexp: regexpString,
      options: 'ims',
    }) : undefined
  }).limit(100).orderBy('date', 'desc').get()

  // exact match BY law
  const resultMatchByLaw = await db.collection(dbName).where({
    law: parseInt(number),
    opinion: regexpString ? db.RegExp({
      regexp: regexpString,
      options: 'ims',
    }) : undefined
  }).limit(100).orderBy('date', 'desc').get()
  // exact match BY opinion

  const all = [...resultMatchByCriminalLaw.data, ...resultMatchByLaw.data]

  const removeDuplicates = all.filter((v,i,a)=>a.findIndex(t=>(t.rowkey === v.rowkey))===i)

  return  {data: removeDuplicates};

}
