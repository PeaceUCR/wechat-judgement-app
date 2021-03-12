import Taro, { Component } from '@tarojs/taro'
import {View, Image, Video, Text} from '@tarojs/components'
import {AtAvatar,AtButton, AtBadge, AtIcon} from 'taro-ui'
import wife from '../../static/wife.png';
import SentUsers from '../../components/sentUsers'
import './index.scss'

const FAIL_AUTH_DENY = 'getUserInfo:fail auth deny';
const parseNum = (num) => {
  return num > 9 ? `${num}` : `0${num}`
}
export default class Other extends Component {

  state = {
    millis: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    record: '',
    loaded: false,
    countVisit: 0,
    countSend: 0,
    sends: []
  }

  config = {
    navigationBarTitleText: '',
    navigationStyle: 'custom'
  }

  onShareAppMessage() {
    return {
      path: 'pages/cake/index'
    };
  }

  componentWillMount () {
  }

  count = () => {
    const millis = Date.parse('2021-03-14T00:00:00+08:00') - Date.now()
    const ms = millis % 1000
    const s = (millis - ms) / 1000
    const second = s % 60
    const mins = (s - second) / 60
    const minute = mins % 60
    const hrs = (mins - minute) / 60
    const hour = hrs % 24
    const day = (hrs - hour) / 24
    this.setState({
      millis,
      second,
      minute,
      hour,
      day
    })

  }

  componentDidMount () {
    const that = this;
    this.timerID = setInterval(() => {
      this.count()
    }, 1000)
    Taro.cloud.callFunction({
      name: 'addCongrat',
      data: {
        type: 'visit'
      },
      complete: r => {
      }
    })

    Taro.cloud.callFunction({
      name: 'getCongrat',
      complete: r => {
        if (r && r.result && r.result.data && r.result.data.length > 0) {
          that.setState({
            record: new Date(r.result.data[0].time).toLocaleString('zh-CN')
          })
        }

        that.setState({
          loaded: true
        })
      }
    })

    Taro.cloud.callFunction({
      name: 'getCongrats',
      complete: r => {
        console.log(r)
        const {countVisit, countSend, sends} = r.result
        that.setState({
          countVisit: countVisit.total,
          countSend: countSend.total,
          sends: sends.data
        })
      }
    })
  }


  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  componentDidShow () { }

  componentDidHide () { }

  handleCongrats = () => {
    Taro.showToast({
      title: `谢谢🙏`,
      icon: 'none',
      duration: 3000
    })
  }
  handleLogin = (res) => {
    const that = this;
    if (res.detail && res.detail.errMsg === FAIL_AUTH_DENY){
      return Taro.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1000
      });
    }
    Taro.showLoading();
    Taro.cloud.callFunction({
      name: 'addCongrat',
      data: {
        type: 'send',
        nickName: res.detail.userInfo.nickName,
        avatarUrl: res.detail.userInfo.avatarUrl
      },
      complete: r => {
        Taro.showToast({
          title: `${res.detail.userInfo.nickName},谢谢你的祝福!`,
          icon: 'none',
          duration: 3000
        });
        Taro.hideLoading();
        that.setState({
          record: new Date().toLocaleString('zh-CN')
        })
      }
    })
  }

  render () {
    const { millis, second, minute, hour, day, record, loaded,
      countVisit,
      countSend,
      sends} = this.state;
    return (
      <View className='other-page'>
        <View className='center'>
          <AtAvatar size='large' circle image={wife}></AtAvatar>
        </View>
        {millis > 0 && <View className='center'>
          <View className='text-container'>
            <View>距离<Text className='name'>???</Text>的生日还有:</View>
            <View className='count-down'>
              <View className='number'>{`${parseNum(day)}天`}</View>
              <View className='number'>{`${parseNum(hour)}小时`}</View>
              <View className='number'>{`${parseNum(minute)}分钟`}</View>
              <View className='number'>{`${parseNum(second)}秒`}</View>
            </View>
          </View>
        </View>}
        {millis < 0 && <View className='center'>
          <View className='text-container'>
            <View>🎉热烈庆祝黄漫琳生日快乐🎉</View>
          </View>
        </View>}
        {loaded && <View>
          {!record && <View className='button-line'>
            <AtButton
              type='secondary'
              openType='getUserInfo'
              onGetUserInfo={this.handleLogin}>🎂快点我送上生日祝福吧🎂</AtButton>
          </View>}
          {record && <View className='center small'>{`🎂你已经在${record}送上祝福啦🎂`}</View>}
        </View>}


        <View className='back' onClick={() => {
          Taro.navigateTo({
            url: '/pages/index/index'
          })
        }}
        >
          <AtBadge value='返回'>
            <AtIcon value='arrow-left' size='40' color='#000'></AtIcon>
          </AtBadge>
        </View>
        <View>
          <SentUsers list={sends} />
          <View className='center small gray'>
            共有{countSend}人发送祝福,共围观{countVisit}次
          </View>
        </View>
        <View className='snow-container'>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
          <View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View><View className='snow'></View>
        </View>
      </View>
    )
  }
}
