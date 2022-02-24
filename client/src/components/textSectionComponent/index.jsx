import Taro, { Component, getStorageSync} from '@tarojs/taro'
import { View, Text, Swiper,SwiperItem, RichText } from '@tarojs/components'
import {AtButton} from "taro-ui";
import './index.scss'
import {findAndHighlight, isStartWith, refine, highlights, copy} from "../../util/util";

export default class TextSectionComponent extends Component {

  state = {
    lines: [],
    keyword: '',
    zoomIn: false,
    isTitle: false,
    selectedLine: -1
  }
  // fix judgement detail fail
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    const {data, keyword, zoomIn, isTitle} = props
    const lines = data ? data.split('\n').filter(line => line.trim() && line.trim().length > 0).map(line => refine(line)) : []
    this.state = {
      lines,
      keyword,
      zoomIn,
      isTitle,
      selectedLine: -1
    };
  }

  componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
    console.log('receive')
    const {data, keyword, zoomIn, isTitle} = nextProps
    const lines = data.split('\n').filter(line => line.trim() && line.trim().length > 0).map(line => refine(line))
    this.setState({
      lines,
      keyword,
      zoomIn,
      isTitle
    });
  }

  componentWillMount () {
  }

  componentDidMount () {
  }

  componentWillUnmount () { }


  componentDidHide () { }

  pressTime
  touchStart = (index) => {
    console.log('start')
    this.pressTime = setTimeout(() => {
      //  你要do的事
      this.setState({selectedLine: index})
      // Taro.setClipboardData({
      //   data: text,
      //   success: function (res) {
      //     Taro.showToast({
      //       title: '本段已复制到剪贴板',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   }
      // });
    }, 2000);
  }

  touchEnd = () => {
    console.log('end')
    clearTimeout(this.pressTime);
  }

  render () {
    const {lines, keyword, zoomIn, isTitle, selectedLine} = this.state
    return (<View  className={`text-section ${zoomIn ? 'zoom-in' : ''} ${isTitle ? 'title': ''}`}>
      <View className='content'>{lines.map((line, index) => {
        return (<View className={`line ${index === selectedLine ? 'show-copy' : ''}`}
                      key={`text-example-detail-${index}`}
                      onTouchStart={() => this.touchStart(index)}
                      onTouchEnd={this.touchEnd}
        >
          <RichText nodes={findAndHighlight(line, index, keyword)} className={isStartWith(line, highlights) ? 'highlight': ''} ></RichText>
          {index === selectedLine && <View className='copy'><AtButton size='small' type='primary' onClick={() => copy(line)}>复制</AtButton></View>}
        </View>)
      })}</View>
    </View>)
  }
}
