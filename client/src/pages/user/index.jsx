import Taro, { Component, setStorageSync, getStorageSync} from '@tarojs/taro'
import { View,Swiper,SwiperItem } from '@tarojs/components'
import {AtSwitch,AtNoticebar,AtActivityIndicator, AtBadge, AtIcon} from "taro-ui";
import MyCollection from '../../components/myCollection'
import './index.scss'
import {tmpId} from '../../util/util'
import {ImageRecoginzer} from "../../components/imageRecoginzer/index.weapp";
import {db} from "../../util/db";


export default class User extends Component {

  state = {
    isReadMode: false,
    collection: [],
    isLoading: false,
    showImageRecognize: false,
    token: '',
    enableAds: false
  }

  config = {
    navigationBarTitleText: '我的收藏'
  }

  onShareAppMessage() {
    return {
      path: 'pages/index/index'
    };
  }

  componentWillMount () {
    const that = this;
    db.collection('configuration').where({}).get({
      success: (res) => {
        that.setState({
          enableAds: res.data[0].enableAds
        })
      }
    });

    const setting = getStorageSync('setting');
    this.setState({isReadMode: setting && setting.isReadMode})

    if (setting && setting.isReadMode) {
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F4ECD8'
      })
    }

    Taro.getSetting({
      withSubscriptions: true,
      success: (res) => {
        console.log(res)
      }
    })
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    console.log('did show')
    const that =this;
    that.setState({isLoading: true})
    Taro.cloud.callFunction({
      name: 'getCollections',
      complete: (r) => {
        console.log(r)
        that.setState({collection: r.result.data, isLoading: false})
        // if (r && r.result && r.result.data && r.result.data.length > 0) {
        //   that.setState({isCollected: true})
        // }
      },
      fail: (e) => {
        Taro.showToast({
          title: `获取收藏数据失败:${JSON.stringify(e)}`,
          icon: 'none',
          duration: 1000
        })
        that.setState({isLoading: false})

      }
    })
  }

  componentDidHide () { }

  render () {
    const {isLoading, isReadMode, collection} = this.state;
    return (
      <View className={`user-page ${isReadMode ? 'read-mode' : ''}`}>

        <MyCollection collection={collection} />
        {collection.length === 0 && <View className='no-data'>暂无</View>}
        <View className='float-help' onClick={() => {
          Taro.navigateTo({
            url: '/pages/other/index'
          })
        }}
        >
          <AtBadge value='帮助'>
            <AtIcon value='help' size='24' color='#000'></AtIcon>
          </AtBadge>
        </View>
        {
          isLoading && <AtActivityIndicator mode='center' color='black' content='数据加载中...' size={62}></AtActivityIndicator>
        }
      </View>
    )
  }
}
