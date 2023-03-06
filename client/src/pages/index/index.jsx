import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon, AtActionSheet, AtTag, AtDrawer, AtAccordion, AtFab} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {db} from "../../util/db";
import reading from '../../static/reading.png';

const swiperPosters = [
  'https://mmbiz.qpic.cn/mmbiz_gif/6fKEyhdZU92z04oIXVSYicfteNREfklpjxUvgwz33Oq3ib8pqHDicRXN7QzJic6QXotjJt6pRNYcP7ElNr5gz9BBLA/0?wx_fmt=gif',
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
    });
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  onClear = () => {
    this.setState({
      searchValue: ''
    });
  }

  onSearch = () => {
    const {searchValue} = this.state
    Taro.showToast({
      title: '开发中敬请期待',
      icon: 'none',
      duration: 2000
    });
    return ;
  }

  goToSeries = () => {
    Taro.navigateTo({
      url: `/pages/seriesList/index?type=xue_fa_dian`
    });
  }
  goToXiaoAnDaDaoLi = () => {
    Taro.navigateTo({
      url: `/pages/seriesList/index?type=xiao_an_da_dao_li`
    });
  }
  goToConsultant = () => {
    Taro.navigateTo({
      url: `/pages/consultant/index`
    });
  }

  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading,isMenuOpened, activeKeyMap, selectedCriminalKeywords, enableMainAd, resultList,
    hasVisit, isCauseOpened, showCivilLawOption, filterValue} = this.state;
    return (
      <View className='index-page page read-mode'>
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
          {/*<SwiperItem>*/}
          {/*  <View className='swiper-item-container' onClick={this.handleClickMainSwiper}>*/}
          {/*    <Image className='image' src={swiperPosters[1]} mode='aspectFill' />*/}
          {/*  </View>*/}
          {/*</SwiperItem>*/}
        </Swiper>
        <AtSearchBar
          placeholder='搜一搜'
          value={searchValue}
          onChange={this.onChange}
          onClear={this.onClear}
          onActionClick={() => {
            this.onSearch()
          }}
        />
        <View className='menus'>
          <View className='menu-item' onClick={this.goToSeries}>
            <Image className='reading' src={reading} mode='aspectFill' />
            <Text className='menu-text'>学法典读案例答问题</Text>
          </View>
          <View className='menu-item' onClick={this.goToConsultant}>
            <Image className='reading' src={reading} mode='aspectFill' />
            <Text className='menu-text'>学习刑事审判参考</Text>
          </View>
        </View>
        <ad unit-id='adunit-33f2aac1c663b205' ad-type='video' ad-theme='white'></ad>
      </View>
    )
  }
}
