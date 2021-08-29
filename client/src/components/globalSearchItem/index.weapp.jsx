import Taro from '@tarojs/taro'
import {AtIcon} from "taro-ui";
import {Text, View, Image} from "@tarojs/components";
import './index.scss'
import {rightArrowIcon} from'../../util/util'

const GlobalSearchItem = (props) => {
  let {text, title, date, caseNumber, courtName, redirect} = props;
  let displayedText = text;
  let showDot = false
  if (text && text.length > 60) {
    displayedText = text.substring(0, 60)
    showDot = true
    displayedText = `${text.substring(0, 60)}${showDot ? '...' : ''}`
  }

  return (<View className='search-item' onClick={redirect} >
    <View className='line'>
      <View className='law'>{title}</View>
      {/*<Text className='number'>{number}</Text>*/}
      {/*<Image src={rightArrowIcon} className='right-arrow' />*/}
    </View>
    <View className='sub-line line'>
      <View className='date'>{courtName}</View>
      <View className='date'>{caseNumber}</View>
    </View>
    {/*<View className='line'>*/}
    {/*  <View className='date'>{date}</View>*/}
    {/*</View>*/}
    <View className='main-text'>
      {displayedText}
    </View>
  </View>)
}

export default GlobalSearchItem;
