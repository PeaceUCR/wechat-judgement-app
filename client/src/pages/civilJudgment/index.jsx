import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Picker, Button, Image, Text} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon, AtActionSheet, AtTag, AtDrawer, AtAccordion, AtFab} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {db} from "../../util/db";
import Loading2 from "../../components/loading2/index.weapp";
import {
  lawOptions,
  criminalLawOptions,
  civilLawOptions,
  getLawChnName,
  getLawName,
  getCriminalLawChnNumber,
  getCriminalLawNumber,
  getCivilLawChnNumber,
  getCivilLawNumber,
  lawIcon,
  sortByOpinion,
  criminalCaseIcon,
  civilCaseIcon
} from "../../util/name";
import GlobalSearchItem from '../../components/globalSearchItem/index.weapp'
import {getUserAvatar} from "../../util/login";
import {convertNumberToChinese} from "../../util/convertNumber"
import {searchJudgments} from "../../util/judgment";


const settingIcon =
  'https://mmbiz.qpic.cn/mmbiz_png/6fKEyhdZU92UYROmCwI9kIRFU6pnKzycaPtbJdQ4ibwv99ttVwWNj2GkAib2icbrPD3cyGLWuTNMjs8I3pB1X6QOw/0?wx_fmt=png'

const criminalKeywords = ['非法占有','自首','罚金','共同犯罪','故意犯','从犯','程序合法','减轻处罚','拘役','财产权','管制','犯罪未遂','违法所得','合法财产','返还','没收','所有权','偶犯','恶意透支','胁迫','立功','扣押','鉴定','合同','合同诈骗','冒用','伪造','合伙','共同故意','着手','没收财产','利息','聋哑人','人身权利','传唤']
const civilKeywords = ['合同','利息','利率','合同约定','民间借贷','强制性规定','违约金','返还','贷款','驳回','担保','交通事故','借款合同','鉴定','清偿','给付','处分','人身损害赔偿','误工费','违约责任','保证','交付','赔偿责任','传票','买卖合同','债权','传唤','缺席判决','交通事故损害赔偿','债务人','民事责任','债权人','承诺','租赁','婚姻','夫妻关系','连带责任']
const causeMap = {
  "人格权纠纷":["生命权、健康权、身体权纠纷","姓名权纠纷","肖像权纠纷","荣誉权纠纷","隐私权纠纷","婚姻自主权纠纷","人身自由权纠纷","一般人格权纠纷"],
  "婚姻家庭、继承纠纷":["婚约财产纠纷","离婚纠纷","离婚后财产纠纷","离婚后损害责任纠纷","婚姻无效纠纷","撤销婚姻纠纷","夫妻财产约定纠纷","同居关系纠纷","抚养纠纷","扶养纠纷","赡养纠纷","收养关系纠纷","监护权纠纷","探望权纠纷","分家析产纠纷","法定继承纠纷","遗嘱继承纠纷","被继承人债务清偿纠纷","遗赠纠纷","遗赠扶养协议纠纷"],
  "物权纠纷":["不动产登记纠纷","物权保护纠纷","所有权纠纷","用益物权纠纷","担保物权纠纷","占有保护纠纷"],
  "合同、无因管理、不当得利纠纷":["缔约过失责任纠纷","确认合同效力纠纷","债权人代位权纠纷","债权人撤销权纠纷","债权转让合同纠纷","债务转移合同纠纷","债权债务概括转移合同纠纷","悬赏广告纠纷","买卖合同纠纷","招标投标买卖合同纠纷","拍卖合同纠纷","建设用地使用权合同纠纷","临时用地合同纠纷","探矿权转让合同纠纷","采矿权转让合同纠纷","房地产开发经营合同纠纷","房屋买卖合同纠纷","房屋拆迁安置补偿合同纠纷","供用电合同纠纷","供用水合同纠纷","供用气合同纠纷","供用热力合同纠纷","赠与合同纠纷","借款合同纠纷","保证合同纠纷","抵押合同纠纷","质押合同纠纷","定金合同纠纷","进出口押汇纠纷","储蓄存款合同纠纷","银行卡纠纷","租赁合同纠纷","融资租赁合同纠纷","承揽合同纠纷","建设工程合同纠纷","运输合同纠纷","保管合同纠纷","仓储合同纠纷","委托合同纠纷","委托理财合同纠纷","行纪合同纠纷","居间合同纠纷","补偿贸易纠纷","借用合同纠纷","典当纠纷","合伙协议纠纷","种植、养殖回收合同纠纷","彩票、奖券纠纷","中外合作勘探开发自然资源合同纠纷","农业承包合同纠纷","林业承包合同纠纷","渔业承包合同纠纷","牧业承包合同纠纷","农村土地承包合同纠纷","服务合同纠纷","演出合同纠纷","劳务合同纠纷","离退休人员返聘合同纠纷","广告合同纠纷","展览合同纠纷","追偿权纠纷","不当得利纠纷","无因管理纠纷"],
  "知识产权与竞争纠纷":["著作权合同纠纷","商标合同纠纷","专利合同纠纷","植物新品种合同纠纷","集成电路布图设计合同纠纷","商业秘密合同纠纷","技术合同纠纷","特许经营合同纠纷","特殊标志合同纠纷","网络域名合同纠纷","知识产权质押合同纠纷","著作权权属、侵权纠纷","商标权权属、侵权纠纷","专利权权属、侵权纠纷","植物新品种权权属、侵权纠纷","集成电路布图设计专有权权属、侵权纠纷","侵害特殊标志专有权纠纷","网络域名权属、侵权纠纷","发现权纠纷","发明权纠纷","其他科技成果权纠纷","确认不侵害知识产权纠纷","因申请知识产权临时措施损害责任纠纷","因恶意提起知识产权诉讼损害责任纠纷","专利权宣告无效后返还费用纠纷","仿冒纠纷","商业贿赂不正当竞争纠纷","虚假宣传纠纷","侵害商业秘密纠纷","低价倾销不正当竞争纠纷","有奖销售纠纷","商业诋毁纠纷","串通投标不正当竞争纠纷","垄断协议纠纷","滥用市场支配地位纠纷","经营者集中纠纷"],
  "劳动争议、人事争议":["确认劳动关系纠纷","集体合同纠纷","劳务派遣合同纠纷","非全日制用工纠纷","追索劳动报酬纠纷","经济补偿金纠纷","竞业限制纠纷","养老保险待遇纠纷","工伤保险待遇纠纷","医疗保险待遇纠纷","生育保险待遇纠纷","失业保险待遇纠纷","辞职争议","辞退争议","聘用合同争议", "福利待遇纠纷"],
  "与公司、证券、保险、票据等有关的民事纠纷":["企业出资人权益确认纠纷","侵害企业出资人权益纠纷","企业公司制改造合同纠纷","企业股份合作制改造合同纠纷","企业债权转股权合同纠纷","企业分立合同纠纷","企业租赁经营合同纠纷","企业出售合同纠纷","挂靠经营合同纠纷","企业兼并合同纠纷","联营合同纠纷","企业承包经营合同纠纷","中外合资经营企业合同纠纷","中外合作经营企业合同纠纷","股东资格确认纠纷","股东名册记载纠纷","请求变更公司登记纠纷","股东出资纠纷","新增资本认购纠纷","股东知情权纠纷","请求公司收购股份纠纷","股权转让纠纷","公司决议纠纷","公司设立纠纷","公司证照返还纠纷","发起人责任纠纷","公司盈余分配纠纷","损害股东利益责任纠纷","损害公司利益责任纠纷","股东损害公司债权人利益责任纠纷","公司关联交易损害责任纠纷","公司合并纠纷","公司分立纠纷","公司减资纠纷","公司增资纠纷","公司解散纠纷","申请公司清算","清算责任纠纷","上市公司收购纠纷","入伙纠纷","退伙纠纷","合伙企业财产份额转让纠纷","申请破产清算","申请破产重整","申请破产和解","请求撤销个别清偿行为纠纷","请求确认债务人行为无效纠纷","对外追收债权纠纷","追收未缴出资纠纷","追收抽逃出资纠纷","追收非正常收入纠纷","破产债权确认纠纷","取回权纠纷","破产抵销权纠纷","别除权纠纷","破产撤销权纠纷","损害债务人利益赔偿纠纷","管理人责任纠纷","证券权利确认纠纷","证券交易合同纠纷","金融衍生品种交易纠纷","证券承销合同纠纷","证券投资咨询纠纷","证券资信评级服务合同纠纷","证券回购合同纠纷","证券交易代理合同纠纷","证券上市保荐合同纠纷","证券发行纠纷","证券返还纠纷","证券欺诈责任纠纷","证券托管纠纷","证券登记、存管、结算纠纷","融资融券交易纠纷","客户交易结算资金纠纷","期货经纪合同纠纷","期货透支交易纠纷","期货强行平仓纠纷","期货实物交割纠纷","期货交易代理合同纠纷","侵占期货交易保证金纠纷","期货欺诈责任纠纷","期货内幕交易责任纠纷","期货虚假信息责任纠纷","民事信托纠纷","营业信托纠纷","公益信托纠纷","财产保险合同纠纷","人身保险合同纠纷","再保险合同纠纷","保险经纪合同纠纷","保险代理合同纠纷","进出口信用保险合同纠纷","保险费纠纷","票据付款请求权纠纷","票据追索权纠纷","票据交付请求权纠纷","票据返还请求权纠纷","票据损害责任纠纷","票据利益返还请求权纠纷","汇票回单签发请求权纠纷","票据保证纠纷","确认票据无效纠纷","票据代理纠纷","票据回购纠纷","委托开立信用证纠纷","信用证开证纠纷","信用证议付纠纷","信用证欺诈纠纷","信用证融资纠纷"],
  "侵权责任纠纷":["监护人责任纠纷","用人单位责任纠纷","劳务派遣工作人员侵权责任纠纷","提供劳务者致害责任纠纷","提供劳务者受害责任纠纷","网络侵权责任纠纷","违反安全保障义务责任纠纷","教育机构责任纠纷","产品责任纠纷","机动车交通事故责任纠纷","医疗损害责任纠纷","环境污染责任纠纷","高度危险责任纠纷","饲养动物损害责任纠纷","物件损害责任纠纷","触电人身损害责任纠纷","义务帮工人受害责任纠纷","见义勇为人受害责任纠纷","公证损害责任纠纷","防卫过当损害责任纠纷","紧急避险损害责任纠纷","铁路运输损害责任纠纷","水上运输损害责任纠纷","航空运输损害责任纠纷","因申请诉前财产保全损害责任纠纷","因申请诉前证据保全损害责任纠纷","因申请诉中财产保全损害责任纠纷","因申请诉中证据保全损害责任纠纷","因申请先予执行损害责任纠纷"],
}

export default class Index extends Component {

  state = {
    isNewUser: false,
    isReadMode: false,
    isUserLoaded: false,
    userName: '',
    userOpenId: '',
    userAvatar: '',
    law: 'civil',
    number: '',
    searchValue: '',
    showSetting: false,
    isCauseOpened: false,
    causeOpenMap: {},
    showLoading: false,
    resultList: [],
    isMenuOpened: false,
    activeKeyMap: {},
    selectedCriminalKeywords: [],
    province: '',
    cause: '',
    enableMainAd: false,
    showCivilLawOption: false,
    filterValue: ''
  }

  config = {
    navigationBarTitleText: '民事案例学习',
  }

  onShareAppMessage() {
    const {law, number, searchValue} = this.state;
    if (law) {
      return {
        path: `/pages/index/index?law=${law ? law : ''}&number=${number ? number : ''}&searchValue=${searchValue ? searchValue : ''}`
      };
    }
    return {
      path: '/pages/index/index'
    };
  }

  componentWillMount () {
    const { userOpenId, userName, userAvatar, law, number, searchValue } = this.$router.params;
    this.setState({
      userOpenId,
      userName,
      userAvatar,
      law: 'civil',
      number: isNaN(parseInt(number)) ? '' : parseInt(number),
      searchValue: searchValue && searchValue !== 'undefined' ? searchValue : ''
    })
    const that = this
    db.collection('configuration').where({}).get({
      success: (res) => {
        console.log(res.data[0])
        const {enableMainAd} = res.data[0]
        that.setState({
          enableMainAd: enableMainAd
        })
      }
    });
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    const setting = getStorageSync('setting');
    if (setting && setting.isReadMode === false) {
      this.setState({isReadMode: false})
    } else {
      setStorageSync('setting', { isReadMode: true })
      this.setState({isReadMode: true})
      console.log('default set to read mode')
    }

    // const {isReadMode} = this.state;
    // if ( isReadMode ) {
    //   console.log('read')
    //   Taro.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: '#F4ECD8'
    //   })
    // }
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F4ECD8'
    })

    const userAvatar = getUserAvatar();
    this.setState({userAvatar})

  }

  componentDidHide () { }

  renderUserFloatButton () {
    const {isUserLoaded, userAvatar} = this.state;
    return (<UserFloatButton isUserLoaded={isUserLoaded} avatarUrl={userAvatar} handleLoginSuccess={() => {
      Taro.navigateTo({
        url: '/pages/user/index'
      })
    }}
    />)
  }

  handleLoginSuccess = () => {
    this.setState({isNewUser: false});
    Taro.hideLoading();
  }

  selectLaw = (e) => {
    const law = getLawName(lawOptions[e.detail.value])
    this.setState({
      law: law,
      number: '',
      activeKeyMap: {},
      selectedCriminalKeywords: [],
      province: '',
    })
  }

  selectCivilNumber = (e) => {
    const {name} = e
    console.log(name)
    this.setState({
      number: getCivilLawNumber(name),
      showCivilLawOption: false
    })
  }

  handleInputNumber = (value) => {
    this.setState({
      number: value
    })
  }

  handleProvinceChange = (value) => {
    this.setState({
      province: value
    })
  }

  renderCaseTypeOption = () => {
    const {law} = this.state
    return <View className='case-options'>
      <View className={law === 'civil' ? 'case-option active' : 'case-option'} onClick={() => this.setState({law: 'civil'})}>
        <View>
          <Image src={civilCaseIcon} className='option-icon' mode='widthFix' />
        </View>
        <View>民事案件</View>
      </View>
      {/*<View className={law === 'criminal' ? 'case-option active' : 'case-option'} onClick={() => this.setState({law: 'criminal'})}>*/}
      {/*  <View>*/}
      {/*    <Image src={criminalCaseIcon} className='option-icon' mode='widthFix' />*/}
      {/*  </View>*/}
      {/*  <View>刑事案件</View>*/}
      {/*</View>*/}
    </View>
  }

  renderSearchCriteria = () => {
    const {law, number, selectedCriminalKeywords, province, cause} = this.state
    return <View>
      {this.renderCaseTypeOption()}
      {/*{law === 'criminal' && <View>*/}
      {/*  <View className='link' onClick={this.jumpToCriminalJudgement}>裁判文书案例</View>*/}
      {/*  <View className='link' onClick={this.jumpToCriminalConsultant}>刑事审判参考</View>*/}
      {/*  <View className='link' onClick={this.jumpToSofaExample}>两高指导案例/公报案例</View>*/}
      {/*</View>}*/}
      <View>
        {/*<View className={`law-line ${number ? 'active': ''}`} onClick={() => {this.setState({showCivilLawOption: true})}}>{number ? getCivilLawChnNumber(number) : '👉点我选民法典法条'}</View>*/}
        {/*<View>*/}
        {/*  <AtInput*/}
        {/*    type='number'*/}
        {/*    placeholder='  或输入法条数字序号,如1'*/}
        {/*    value={number}*/}
        {/*    onChange={this.handleInputNumber}*/}
        {/*    onBlur={this.validateNumber}*/}
        {/*  />*/}
        {/*</View>*/}
        <View className='icon-line' onClick={() => {
          this.setState({
            isCauseOpened: true
          })}}
        >
          <AtIcon value='bookmark' size='28' color='#b35900'></AtIcon>
          <View className='text text-first'>{cause ? cause : '民事案由'}</View>
        </View>
        <View className='icon-line' onClick={() => {
          this.setState({
            isMenuOpened: true
          })}}
        >
          <AtBadge value={selectedCriminalKeywords.length}>
            <AtIcon value='tags' size='24' color='rgba(0,0,0)'></AtIcon>
          </AtBadge>
          <View className='text'>{selectedCriminalKeywords.length > 0 ? selectedCriminalKeywords.join(',') : '关键词'}</View>
        </View>
        {/*<View className='icon-line'>*/}
        {/*  <AtIcon value='map-pin' size='26' color='#b35900' onClick={() => {*/}
        {/*    const that = this*/}
        {/*    Taro.getLocation({*/}
        {/*      success(res) {*/}
        {/*        console.log(res)*/}
        {/*        Taro.showLoading({*/}
        {/*          title: '获取地理位置中',*/}
        {/*        })*/}
        {/*        const {latitude, longitude} = res*/}
        {/*        Taro.request({*/}
        {/*          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=4POBZ-YEXYD-NPQ4R-PNZJ4-3XEE5-FFBXF`,*/}
        {/*          method: 'get',*/}
        {/*          success: function (r) {*/}
        {/*            console.log(r)*/}
        {/*            const {data} = r*/}
        {/*            const {result} = data*/}
        {/*            const {address_component} = result*/}
        {/*            const {province} = address_component*/}
        {/*            that.setState({*/}
        {/*              province:province*/}
        {/*            })*/}
        {/*            Taro.hideLoading()*/}
        {/*          }*/}
        {/*        })*/}

        {/*      }*/}
        {/*    })*/}
        {/*  }}></AtIcon>*/}
        {/*  <AtInput*/}
        {/*    type='text'*/}
        {/*    placeholder='位置'*/}
        {/*    value={province}*/}
        {/*    onChange={this.handleProvinceChange}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>
    </View>
  }

  onChangeSearchValue = (value) => {
    this.setState({
      searchValue: value
    })
  }

  validateNumber = () => {
    const {number} = this.state
    let intVal = Number(number)
    console.log('number', number)
    console.log('intVal', intVal)
    console.log('isNaN(intVal)', isNaN(intVal))
    if ((number.length > 0 && isNaN(intVal)) || intVal < 0 || intVal > 1260) {
      Taro.showToast({
        title: `无效条文序号${number},请修正后再试！`,
        icon: 'none',
        duration: 4000
      })
      return false;
    }
    return true
  }
  onSearch = () => {
    const that = this;
    const  { law, number, searchValue, selectedCriminalKeywords, province } = this.state;

    return that.searchCivil();

    // if (law === 'civil') {
    //   if (this.validateNumber()) {
    //     return that.searchCivil()
    //   } else {
    //     return ;
    //   }
    // }
    // this.setState({
    //   showLoading: true
    // })
    // Taro.cloud.callFunction({
    //   name: 'searchExamples',
    //   data: {
    //     law,
    //     number,
    //     searchValue,
    //     selectedCriminalKeywords,
    //     province
    //   },
    //   complete: (r) => {
    //     console.log(r)
    //     if (r && r.result && r.result.data && r.result.data.length > 0) {
    //       that.setState({
    //         resultList: sortByOpinion(r.result.data)
    //       })
    //       Taro.showToast({
    //         title: `仅显示前100个结果!`,
    //         icon: 'none',
    //         duration: 4000
    //       })
    //     } else {
    //       Taro.showToast({
    //         title: `未找到,可能是还未收录,敬请期待!`,
    //         icon: 'none',
    //         duration: 6000
    //       })
    //       that.setState({
    //         resultList: []
    //       })
    //     }
    //     that.setState({
    //       showLoading: false
    //     })
    //   }
    // })
  }

  searchCivil = () => {
    const that = this;
    const  { law, number, searchValue, selectedCriminalKeywords, province, cause } = this.state;
    if (searchValue || selectedCriminalKeywords.length > 0 || cause) {
      this.setState({
        showLoading: true
      })
      searchJudgments(searchValue, cause, selectedCriminalKeywords).then((r) => {
        console.log(r)
        if (r && r.length > 0) {
          that.setState({
            resultList: sortByOpinion(r)
          })
          Taro.showToast({
            title: `仅显示前20个结果!`,
            icon: 'none',
            duration: 4000
          })
        } else {
          Taro.showToast({
            title: `未找到,可能是还未收录,敬请期待!`,
            icon: 'none',
            duration: 6000
          })
          that.setState({
            resultList: []
          })
        }
        that.setState({
          showLoading: false
        })
      })
    } else {
      Taro.showToast({
        title: `必须包含搜索一个以上的搜索项(案由/关键字)`,
        icon: 'none',
        duration: 6000
      })
    }

  }

  handleClose = () => {
    const {law, number} = this.state
    if (law === 'criminal') {
      this.setState({
        showSetting: false
      })
      return ;
    }
    if (!law) {
      Taro.showToast({
        title: `请选案件类型`,
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    if (!number && law === 'criminal') {
      Taro.showToast({
        title: `请选法条`,
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    this.setState({
      showSetting: false
    })
    this.onSearch()
  }

  handleOpen = () => {
    this.setState({
      showSetting: true
    });
  }

  renderTagLine = () => {
    const {law, number} = this.state
    return (
      <View className='tag-line'>
        {law && <View className='law'>{law === 'criminal'?'刑事案件':'民事案件'}</View>}
        {number && <View className='number'>{law === 'criminal'? getCriminalLawChnNumber(number) : getCivilLawChnNumber(number)}</View>
        }
      </View>
    )
  }

  renderResults = () => {
    const {law, resultList, searchValue, selectedCriminalKeywords} = this.state
    let keyword
    if (selectedCriminalKeywords && selectedCriminalKeywords.length > 0) {
      if (searchValue) {
        keyword = [...selectedCriminalKeywords, searchValue].join('|');
      } else {
        keyword = [...selectedCriminalKeywords].join('|');
      }
    } else {
      keyword = searchValue ? searchValue : ''
    }
    return (<View>
      {resultList.map(item => {
        return (
          <GlobalSearchItem
            key={item._id}
            text={item.opinion}
            title={item.title}
            date={item.date}
            courtName={item.courtName}
            caseNumber={item.caseNumber}
            redirect={() => {
              Taro.navigateTo({
                url: `/pages/civilJudgmentDetail/index?id=${item.rowKey}&type=${law}&keyword=${keyword}`,
              })
              return ;

            }}
          />
        )
      })}
      {resultList.length > 0 && <AtDivider content='没有更多了' fontColor='#666' />}
      {resultList.length > 0 && <View >
        <ad unit-id="adunit-0320f67c0e860e36"></ad>
      </View>}
    </View>)
  }

  jumpToMiniProgram = () => {
      const redirectStr = `/pages/index/index`
      Taro.navigateToMiniProgram({
        appId: 'wxf6d4249d423ff2a3',
        path: redirectStr
      });
    }
  jumpToCriminalJudgement = () => {
    const redirectStr = `/pages/judgement/index`
    Taro.navigateToMiniProgram({
      appId: 'wxf6d4249d423ff2a3',
      path: redirectStr
    });
  }
  jumpToCriminalConsultant = () => {
    const redirectStr = `/pages/consultant/index`
    Taro.navigateToMiniProgram({
      appId: 'wxf6d4249d423ff2a3',
      path: redirectStr
    });
  }
  jumpToSofaExample = () => {
    const redirectStr = `/pages/examples/index`
    Taro.navigateToMiniProgram({
      appId: 'wxf6d4249d423ff2a3',
      path: redirectStr
    });
  }

  handleMenuClose = () => {
    const {activeKeyMap} = this.state
    const keys = Object.keys(activeKeyMap).filter(k => activeKeyMap[k])
    console.log(keys)
    this.setState({
      isMenuOpened: false,
      selectedCriminalKeywords: keys
    })
  }

  handleCriminalKeywordClick = (e) => {
    const {name} = e
    const {activeKeyMap} = this.state;
    activeKeyMap[name] = !activeKeyMap[name]
    this.setState({
      activeKeyMap: {...activeKeyMap}
    })
  }

  renderCauseList = () => {
    const {causeOpenMap, cause} = this.state
    const that = this
    return (<View>
      {Object.keys(causeMap).map(k => {
        return <AtAccordion
          key={k}
          title={k}
          open={causeOpenMap[k]}
          onClick={() => {
            causeOpenMap[k] = !causeOpenMap[k]
            that.setState({
              causeOpenMap: causeOpenMap
            })
          }
          }
        >
          {causeMap[k].map(item => {
            return (<View className={`cause-option ${cause === item ? 'active': ''}`} key={item} onClick={() => {
              if (cause === item) {
                that.setState({
                  cause: '',
                  isCauseOpened: false
                })
              } else {
                that.setState({
                  cause: item,
                  isCauseOpened: false
                })
              }
            }}
            >
              {item}
            </View>)
          })}
        </AtAccordion>
      })}
    </View>)
  }

  onChangeFilterValue = (value) => {
    this.setState({
      filterValue: Number.isInteger(parseInt(value)) ? convertNumberToChinese(parseInt(value)) : value
    })
  }

  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading,isMenuOpened, activeKeyMap, selectedCriminalKeywords, enableMainAd, resultList,
    isCauseOpened, showCivilLawOption, filterValue, cause} = this.state;
    return (
      <View className={`index-page page ${isReadMode ? 'read-mode' : ''}`}>
        {/*{this.renderTagLine()}*/}

        {/*<AtNoticebar marquee speed={60}>*/}
        {/*  本小程序数据信息均来源于裁判文书网，已收录超过20万份裁判文书，持续开发中...*/}
        {/*</AtNoticebar>*/}
        <AtSearchBar
          placeholder='当前条件下搜索案由'
          value={searchValue}
          onChange={this.onChangeSearchValue}
          onActionClick={this.onSearch}
        />
        <AtFab className='float-back' onClick={() => {
          this.setState({
            showSetting: true,
            userAvatar: '',
            law: '',
            number: '',
            searchValue: '',
            isCauseOpened: false,
            causeOpenMap: {},
            showLoading: false,
            resultList: [],
            isMenuOpened: false,
            activeKeyMap: {},
            selectedCriminalKeywords: [],
            province: '',
            cause: '',
            showCivilLawOption: false,
            filterValue: ''
          })
        }}
        >
          <Text>重置</Text>
        </AtFab>
        <View className='icon-line' onClick={() => {
          this.setState({
            isCauseOpened: true
          })}}
        >
          <AtIcon value='bookmark' size='28' color='#b35900'></AtIcon>
          <View className='text text-first'>{cause ? cause : '点我选择民事案由'}</View>
        </View>
        <View className='icon-line' onClick={() => {
          this.setState({
            isMenuOpened: true
          })}}
        >
          <AtBadge value={selectedCriminalKeywords.length}>
            <AtIcon value='tags' size='24' color='rgba(0,0,0)'></AtIcon>
          </AtBadge>
          <View className='text'>{selectedCriminalKeywords.length > 0 ? selectedCriminalKeywords.join(',') : '点我选择关键词'}</View>
        </View>
        {this.renderResults()}
        {/*<View>userOpenId: {userOpenId}</View>*/}
        {/*<View>userName: {userName}</View>*/}
        {/*<View>userAvatar: {userAvatar}</View>*/}
        {/*<View>law: {law}</View>*/}
        {/*<View>number: {number}</View>*/}
        {/*<View>searchValue: {searchValue}</View>*/}
        {/*<AtModal isOpened={showSetting} closeOnClickOverlay={false}>*/}
        {/*  <AtModalHeader>我要搜</AtModalHeader>*/}
        {/*  <AtModalContent className={law ? 'has-law' : ''}>*/}
        {/*    {this.renderSearchCriteria()}*/}
        {/*  </AtModalContent>*/}
        {/*  <AtModalAction>*/}
        {/*    <Button className='btn-5' onClick={this.handleClose} >确定</Button>*/}
        {/*  </AtModalAction>*/}
        {/*</AtModal>*/}
        <AtDrawer
          show={isCauseOpened}
          mask
          onClose={() => {
            this.setState({
              isCauseOpened: false
            })
          }}

        >
          {this.renderCauseList()}
        </AtDrawer>

        {/*{!isNewUser && this.renderUserFloatButton()}*/}
        {showLoading && <Loading2 />}
        {/*<View onClick={this.handleOpen} className='float-setting'>*/}
        {/*  <AtBadge value='检索条件'>*/}
        {/*    <Image src={settingIcon} className='setting' mode='widthFix' />*/}
        {/*  </AtBadge>*/}
        {/*</View>*/}

        {/*<View className='float-help' onClick={() => {*/}
        {/*  Taro.navigateTo({*/}
        {/*    url: '/pages/other/index'*/}
        {/*  })*/}
        {/*}}*/}
        {/*>*/}
        {/*  <AtBadge value='帮助'>*/}
        {/*    <AtIcon value='help' size='26' color='rgba(0,0,0, 0.6)'></AtIcon>*/}
        {/*  </AtBadge>*/}
        {/*</View>*/}

        {/*<View className='float-sofa' onClick={this.jumpToMiniProgram}>*/}
        {/*  <AtBadge value='搜法'>*/}
        {/*    <Image*/}
        {/*      src={lawIcon}*/}
        {/*      className='law-icon'*/}
        {/*      mode='widthFix'*/}
        {/*    />*/}
        {/*  </AtBadge>*/}
        {/*</View>*/}

        <AtActionSheet isOpened={isMenuOpened} cancelText='确定' title='请选择关键字(可多选)' onClose={() => {this.setState({isMenuOpened: false})}} onCancel={this.handleMenuClose}>
          {law === 'criminal' && <View>
            {criminalKeywords.map(criminalKeyword => {
              return (
                <AtTag
                  key={criminalKeyword}
                  name={criminalKeyword}
                  circle
                  active={activeKeyMap[criminalKeyword]}
                  onClick={this.handleCriminalKeywordClick}
                >{criminalKeyword}</AtTag>
              )
            })}
          </View>}
          {law === 'civil' && <View>
            {civilKeywords.map(criminalKeyword => {
              return (
                <AtTag
                  key={criminalKeyword}
                  name={criminalKeyword}
                  circle
                  active={activeKeyMap[criminalKeyword]}
                  onClick={this.handleCriminalKeywordClick}
                >{criminalKeyword}</AtTag>
              )
            })}
          </View>}
        </AtActionSheet>

        <AtModal className='ad-bottom' isOpened={showCivilLawOption}>
          <AtModalHeader>请选择民法典法条</AtModalHeader>
          <AtModalContent className='has-law'>
            {showCivilLawOption && <View>
              <AtSearchBar
                placeholder='法条查找'
                onChange={this.onChangeFilterValue}
              />
              {civilLawOptions.filter(option => !filterValue || option.indexOf(filterValue) !== -1).map(option => {
                return (
                  <AtTag
                    key={option}
                    name={option}
                    circle
                    onClick={this.selectCivilNumber}
                  >{option}</AtTag>
                )
              })}
            </View>}
          </AtModalContent>
          <AtModalAction><Button onClick={() => {this.setState({showCivilLawOption: false})}}>确定</Button> </AtModalAction>
        </AtModal>

        {!isMenuOpened && <View className='ad-bottom'>
          <ad unit-id="adunit-0320f67c0e860e36"></ad>
        </View>}
        {/*<MovableArea style='height: 200px; width: 200px; background: red;'>*/}
        {/*  <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>带走我</MovableView>*/}
        {/*</MovableArea>*/}
      </View>
    )
  }
}
