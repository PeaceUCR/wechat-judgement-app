import Taro, { getStorageSync } from '@tarojs/taro'

export const redirectToIndexIfNewUser = () => {
  Taro.showToast({
    title: '未检测到登录用户，无法使用收藏功能, 请先去首页登录',
    icon: 'none',
    duration: 3000
  })
}

export const checkIfNewUser = () => {
  const user = getStorageSync('user');
  if (user) {
    return false;
  }
  return true;
}

export const getUserAvatar = () => {
  const user = getStorageSync('user');
  return user.avatarUrl;
}

export const getUserNickname = () => {
  const user = getStorageSync('user');
  return user.nickName;
}

