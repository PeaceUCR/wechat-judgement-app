import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import {AtDivider, AtSearchBar, AtCurtain } from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {STATIC_POSTER_URL, STATIC_POSTER_REDIRECT} from "../../util/util";
import {db} from "../../util/db";
import reading from '../../static/reading.png';
import {civilCaseIcon} from "../../util/name";

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
    filterValue: '',

    posterUrl: STATIC_POSTER_URL,
    posterRedirect: STATIC_POSTER_REDIRECT,
    showPoster: false,
    posterLoaded: false
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

    if (getStorageSync('poster-shown') !== STATIC_POSTER_URL) {
      that.setState({showPoster: true})
    }
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

  goToCivilJudgment = () => {
    Taro.navigateTo({
      url: `/pages/civilJudgment/index`
    });
  }
  goToCivilSimilarCase= () => {
    Taro.navigateTo({
      url: `/pages/civilSimilarCase/index`
    });
  }

  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading,isMenuOpened, activeKeyMap, selectedCriminalKeywords, enableMainAd, resultList,
    hasVisit, isCauseOpened, showCivilLawOption, filterValue, showPoster, posterUrl, posterRedirect, posterLoaded} = this.state;
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
          <View className='menu-item' onClick={this.goToCivilJudgment}>
            <Image className='reading' src={civilCaseIcon} mode='aspectFill' />
            <Text className='menu-text'>学习民事案例</Text>
          </View>
          <View className='menu-item' onClick={this.goToConsultant}>
            <Image className='reading' src={reading} mode='aspectFill' />
            <Text className='menu-text'>学习刑事审判参考</Text>
          </View>
          <View className='menu-item' onClick={this.goToCivilSimilarCase}>
            <Image className='reading' src={reading} mode='aspectFill' />
            <Text className='menu-text'>民事类案检索</Text>
          </View>
        </View>
        <ad unit-id='adunit-33f2aac1c663b205' ad-type='video' ad-theme='white'></ad>
        <AtCurtain isOpened={showPoster && posterLoaded && posterUrl} onClose={() => {
          this.setState({showPoster: false})
          setStorageSync('poster-shown', posterUrl)
        }}
        >
          <Image
            className='poster'
            src={posterUrl}
            mode='widthFix'
            onClick={() => {
              if(posterRedirect.trim()) {
                Taro.navigateTo({
                  url: posterRedirect.trim(),
                })
              } else {
                Taro.previewImage({
                  current: posterUrl,
                  urls: [posterUrl]
                })
              }
            }}
          />
        </AtCurtain>
        <Image
          className='image-for-loading'
          src={posterUrl}
          onLoad={() => this.setState({posterLoaded: true})}
        />
      </View>
    )
  }
}
