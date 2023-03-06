import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon, AtActionSheet, AtTag, AtDrawer, AtAccordion, AtFab} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {xiao_an_da_dao_li_ListData, xue_fa_dian_ListData} from '../../util/data'

export default class Index extends Component {

  state = {
    allList: xue_fa_dian_ListData,
    type: ''
  }

  config = {
    navigationBarTitleText: '学法典读案例答问题'
  }

  onShareAppMessage() {
    return {
      path: '/pages/index/index'
    };
  }

  componentWillMount () {
    const { type } = this.$router.params;
    if (type === 'xue_fa_dian') {
      this.setState({
        allList: xue_fa_dian_ListData,
        type
      });
    }
    if (type === 'xiao_an_da_dao_li') {
      this.setState({
        allList: xiao_an_da_dao_li_ListData,
        type
      });
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  handleClick = (title, type) => {
    Taro.navigateTo({
      url: `/pages/other/index?type=${type}&title=${title}`
    });
  }

  render () {
    const {isReadMode, allList, type} = this.state;
    return (
      <View className='index-page page read-mode'>
        <AtList>
          {
            allList.map(item => (
              <AtListItem title={`[${item.time}]`} note={item.title} onClick={() => this.handleClick(item.title, type)} />
            ))
          }
        </AtList>
      </View>
    )
  }
}
