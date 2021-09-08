import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {AtAvatar, AtBadge} from "taro-ui";
import {View} from "@tarojs/components";
import {checkIfNewUser} from "../../util/login";
import './index.scss'

const UserFloatButton = (props) => {

  const { avatarUrl } = props;

  const handleLogin = () => {
    if (avatarUrl) {
      return Taro.navigateTo({
        url: '/pages/user/index'
      })
    }
    return wx.getUserProfile({
      desc: '用于登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      fail: () => {
        Taro.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 1000
        });
      },
      success: (res) => {
        console.log(res.userInfo)
        Taro.showLoading({
          title: '登录中',
        });
        Taro.cloud.callFunction({
          name: 'login',
          data: {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          },
          complete: r => {
            setStorageSync('user', r.result.data[0]);
            props.handleLoginSuccess();
            Taro.showToast({
              title: `欢迎${r.result.data[0].nickName},首次使用点击屏幕右上角的帮助查看使用指南`,
              icon: 'none',
              duration: 8000
            });
          }
        })
      }
    })

  }


  const handleClick = () => {
    return handleLogin()
  }
  return (<View className='user-float-button' >
    <View
      className='avatar-container'
      onClick={handleClick}
    >
      <AtBadge value='我的'>
        <AtAvatar circle image={avatarUrl}></AtAvatar>
      </AtBadge>
    </View>
  </View>)
}

export default UserFloatButton;
