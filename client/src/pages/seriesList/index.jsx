import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon, AtActionSheet, AtTag, AtDrawer, AtAccordion, AtFab} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {allListData} from '../../util/data'

export default class Index extends Component {

  state = {
    allList: allListData
  }

  config = {
    navigationBarTitleText: '详情'
  }

  onShareAppMessage() {
    return {
      path: '/pages/index/index'
    };
  }

  componentWillMount () {
    const { userOpenId, userName, userAvatar, law, number, searchValue } = this.$router.params;
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  handleClick = () => {
    Taro.showToast({
      title: '开发中敬请期待',
      icon: 'none',
      duration: 2000
    });
  }

  render () {
    const {isReadMode, allList} = this.state;
    return (
      <View className='index-page page read-mode'>
        <AtList>
          {
            allList.map(item => (
              <AtListItem title={item.title} note='描述信息' onClick={this.handleClick} />
            ))
          }
        </AtList>
      </View>
    )
  }
}
