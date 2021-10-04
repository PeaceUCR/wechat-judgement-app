const cloud = require('wx-server-sdk')

 // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.where.html
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const provinceMap = {
  '北京市':'京',
  '天津市':'津',
  '上海市':'沪',
  '重庆市':'渝',
  '河北省':'冀',
  '河南省':'豫',
  '云南省':'云',
  '辽宁省':'辽',
  '黑龙江省':'黑',
  '湖南省':'湘',
  '安徽省':'皖',
  '山东省':'鲁',
  '新疆维吾尔':'新',
  '江苏省':'苏',
  '浙江省':'浙',
  '江西省':'赣',
  '湖北省':'鄂',
  '广西壮族':'桂',
  '甘肃省':'甘',
  '山西省':'晋',
  '内蒙古':'蒙',
  '陕西省':'陕',
  '吉林省':'吉',
  '福建省':'闽',
  '贵州省':'贵',
  '广东省':'粤',
  '青海省':'青',
  '西藏':'藏',
  '四川省':'川',
  '宁夏回族':'宁',
  '海南省':'琼'
}

exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext();
  const db = cloud.database()
  const _ = db.command

  const {
    law,
    number,
    searchValue,
    selectedCriminalKeywords,
    province
  } = event

  // await db.collection("search-history").add({
  //   data: {
  //     openId: wxContext.OPENID,
  //     law,
  //     number,
  //     searchValue,
  //     selectedCriminalKeywords,
  //     province,
  //     time: new Date()
  //   }
  // })

  let provinceRegex, courtNameRegex
  if (province) {
    if (provinceMap[province]) {
      provinceRegex = `.*${provinceMap[province]}`
    } else {
      courtNameRegex = `.*${province}`
    }
  }

  let regexpString, tags

  if (selectedCriminalKeywords && selectedCriminalKeywords.length > 0) {
    tags = selectedCriminalKeywords
  } else {
    if (searchValue && searchValue.trim()) {
      regexpString = `.*${searchValue}`
    }
  }
  console.log('regexpString:', regexpString)
  const dbName = 'criminal-case'

  // match By own criminal law
  const resultMatchByCriminalLaw = await db.collection(dbName).where({
    criminalLaw: number.toString(),
    tags: tags ? _.all(tags) : undefined,
    opinion: regexpString ? db.RegExp({
      regexp: regexpString,
      options: 'ims',
    }) : undefined,
    caseNumber: provinceRegex ? db.RegExp({
      regexp: provinceRegex,
      options: 'ims',
    }) : undefined,
    courtName: courtNameRegex ?  db.RegExp({
      regexp: courtNameRegex,
      options: 'ims',
    }) : undefined,
  }).limit(100).orderBy('date', 'desc').get()

  // exact match BY law
  const resultMatchByLaw = await db.collection(dbName).where({
    law: parseInt(number),
    tags: tags ? _.all(tags) : undefined,
    opinion: regexpString ? db.RegExp({
      regexp: regexpString,
      options: 'ims',
    }) : undefined,
    caseNumber: provinceRegex ? db.RegExp({
      regexp: provinceRegex,
      options: 'ims',
    }) : undefined,
    courtName: courtNameRegex ?  db.RegExp({
      regexp: courtNameRegex,
      options: 'ims',
    }) : undefined,
  }).limit(100).orderBy('date', 'desc').get()
  // exact match BY opinion

  const all = [...resultMatchByCriminalLaw.data, ...resultMatchByLaw.data]

  const removeDuplicates = all.filter((v,i,a)=>a.findIndex(t=>(t.rowkey === v.rowkey))===i)

  return  {data: removeDuplicates};

}
