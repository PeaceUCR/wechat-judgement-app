import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
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

const swiperPosters = [
  'https://mmbiz.qpic.cn/mmbiz_gif/6fKEyhdZU92cC8JPU4xto4nia1UyLRqGvAia11YorBoNrN8WO4bFRIROZNsqGfGicaz6hZ660MUf5ia1sfEXeJeWgQ/0?wx_fmt=gif',
  'https://mmbiz.qpic.cn/mmbiz_jpg/6fKEyhdZU92NrHJmOCNglksEgxbnlKlZsibn8ic5yl2LwRtibZa3UGms20XBQ03wOU1nhBgXSA0mOY8j3KEN1P0vQ/0?wx_fmt=jpeg'
]

export default class Index extends Component {

  state = {
    isNewUser: false,
    isReadMode: false,
    isUserLoaded: false,
    userName: '',
    userOpenId: '',
    userAvatar: '',
    law: '',
    number: '',
    searchValue: '',
    showSetting: true,
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
    hasVisit: true,
    showCivilLawOption: false,
    filterValue: ''
  }

  config = {
    navigationStyle: 'custom'
  }

  onShareAppMessage() {
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
      law: law && law !== 'undefined' ? law : '',
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
  }

  componentDidHide () { }

  handleClickMainSwiper = () => {
    Taro.showToast({
      title: '搜法～搜你想要的法律知识',
      icon: 'none',
      duration: 2000
    })
  }

  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading,isMenuOpened, activeKeyMap, selectedCriminalKeywords, enableMainAd, resultList,
    hasVisit, isCauseOpened, showCivilLawOption, filterValue} = this.state;
    return (
      <View className={`index-page page ${isReadMode ? 'read-mode' : ''}`}>
        <Swiper
          className='main-swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          interval={10000}
          circular
          autoplay
        >
          <SwiperItem>
            <View className='swiper-item-container' onClick={this.handleClickMainSwiper}>
              <Image className='image' src={swiperPosters[0]} mode='aspectFill' />
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='swiper-item-container' onClick={this.handleClickMainSwiper}>
              <Image className='image' src={swiperPosters[1]} mode='aspectFill' />
            </View>
          </SwiperItem>
        </Swiper>
      </View>
    )
  }
}
