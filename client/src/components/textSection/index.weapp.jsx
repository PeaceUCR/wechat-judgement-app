import Taro from '@tarojs/taro'
import {RichText, View} from "@tarojs/components";
import './index.scss'
import {isStartWith} from "../../util/util";

const highlights = ['指导案例', '裁判要点', '相关法条', '相关法律规定', '基本案情', '裁判结果', '裁判理由', '刑法',
  '关键词', '要旨', '基本案情', '诉讼过程', '检察工作情况', '检察机关监督情况', '指导意义', '相关规定',
  '一、基本案情', '二、主要问题', '三、裁判理由','检察机关履职过程', '检察机关履职情况','裁判要旨','条文主旨','条文理解','审判实践中应注意的问题'];
const refine = (str) => {
  if(str && str.length > 0) {
    if(str.charAt(0) === '【' && str.charAt(str.length-1) === '】' ){
      return str.replace('【', '').replace('】', '');
    }
  }
  return str;
}
const replaceAllReg = (str, keys) => {
  let result = str
  keys.forEach(key => {
    const regex = new RegExp(key,"g")
    result = result.replace(regex, `<span class='highlight-keyword'>${key}</span>`)
  })
  return result
}

const findAndHighlight = (str, index, key) => {
  if (key) {
    const keys =key.split("|");
    return '<div>' + key ? replaceAllReg(str, keys): str + '</div>'
  } else {
    return '<div>' + str + '</div>'
  }
}

const TextSection = (props) => {
  let {data, keyword, zoomIn, isTitle} = props;
  data = data ? data: '';
  keyword = keyword ? keyword: undefined

  return (<View  className={`text-section ${zoomIn ? 'zoom-in' : ''} ${isTitle ? 'title': ''}`}>
    <View className='content'>{data.split('\n').filter(line => line.trim() && line.trim().length > 0).map(line => refine(line)).map((line, index) => {
      return (<View className='line' key={`text-example-detail-${index}`} >
        <RichText nodes={findAndHighlight(line, index, keyword)} className={isStartWith(line, highlights) ? 'highlight': ''} ></RichText>
      </View>)
    })}</View>
  </View>)
}

export default TextSection;
