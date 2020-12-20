import Taro, { setStorageSync, useState, useEffect } from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import { avatarUrl } from '../../util/util';
import './index.scss'

const FAIL_AUTH_DENY = 'getUserInfo:fail auth deny';
const title = '首次使用，点我登录';

const LoginPopup = (props) => {

  const handleLogin = (res) => {
    if (res.detail && res.detail.errMsg === FAIL_AUTH_DENY){
      return Taro.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1000
      });
    }
    Taro.showLoading();
    Taro.cloud.callFunction({
      name: 'login',
      data: {
        nickName: res.detail.userInfo.nickName,
        avatarUrl: res.detail.userInfo.avatarUrl
      },
      complete: r => {
        setStorageSync('user', r.result.data[0]);
        props.handleLoginSuccess();
        Taro.showToast({
          title: `欢迎${r.result.data[0].nickName}`,
          icon: 'none',
          duration: 2000
        });
      }
    })
  }
  const [text, setText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const index = text.length;
      setText(title.substring(0, index + 1))
    }, 200);
    return () => {
      clearInterval(interval);
    }
  })

  return (<View className='login-popup' >
    <Button
      className='login-button'
      openType='getUserInfo'
      onGetUserInfo={handleLogin}
    >
      <Image src={avatarUrl} className='avatar' />
      <Text className='text'>{text}<Text className='cursor'></Text></Text>
    </Button>
  </View>)
}

export default LoginPopup;
