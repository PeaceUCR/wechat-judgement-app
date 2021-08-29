import Taro from '@tarojs/taro'
import {AtAvatar, AtBadge} from "taro-ui";
import {View} from "@tarojs/components";
import {checkIfNewUser} from "../../util/login";
import './index.scss'

const UserFloatButton = (props) => {

  const { avatarUrl } = props;

  const handleClick = () => {
    return Taro.showToast({
      title: '开发中,暂未开放',
      icon: 'none',
      duration: 3000
    })
    if (checkIfNewUser()) {
      Taro.showToast({
        title: '未检测到登陆用户,无法查看我的页面',
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    Taro.navigateTo({
      url: '/pages/user/index'
    })
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
