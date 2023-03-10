import Taro from '@tarojs/taro'
import {AtIcon} from "taro-ui";
import {Text, View, Image} from "@tarojs/components";
import './index.scss'

const types = ['判决书','裁定书','调解书','决定书','通知书']
const getType = title => {
  return types.find(t => title && title.indexOf(t) !== -1)
}

const GlobalSearchItem = (props) => {
  let {text, title, date, caseNumber, courtName, redirect} = props;
  let displayedText = text;
  let showDot = false
  if (text && text.length > 100) {
    displayedText = text.substring(0, 100)
    showDot = true
    displayedText = `${text.substring(0, 100)}${showDot ? '...' : ''}`
  }
  let type = getType(title)

  return (<View className='search-item' onClick={redirect} >
    {type && <View className='float-type'>{type.substring(0,2)}</View>}
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
