import Taro, { Component } from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import {db} from "../../util/db";

export default class Other extends Component {

  config = {
    navigationBarTitleText: '帮助',
  }
  state = {
    helpeUrl:'https://mp.weixin.qq.com/s?__biz=MzA3MjEwNzYzOQ==&mid=2650626321&idx=1&sn=6733741ae3895aa7a31f8563cf97456e&chksm=872aaa09b05d231fc58a907908b6e54519c98630e6bc43caebd9ba2b729219949692269fb675#rd'
  }

  componentWillMount () {
  }

  onShareAppMessage() {
    return {
      path: 'pages/other/index'
    };
  }


  render () {
    const {helpeUrl} = this.state
    return (
      <View className='other-page page'>
        <WebView src={helpeUrl} />
      </View>
    )
  }
}
