import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/civilSimilarCase/index',
      'pages/civilSimilarCaseDetail/index',
      'pages/civilJudgment/index',
      'pages/civilJudgmentDetail/index',
      'pages/learningDetail/index',
      'pages/consultant/index',
      'pages/seriesList/index',
      'pages/exampleDetail/index',
      'pages/other/index',
      'pages/user/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black'
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于定位"
      }
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {
    console.log('app jsx show');
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
