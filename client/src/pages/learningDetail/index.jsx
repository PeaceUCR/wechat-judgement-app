import Taro, { Component } from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import {db} from "../../util/db";
import TextSectionComponent from "../../components/textSectionComponent";
import './index.scss'
import {allListData} from "../../util/data";
import moment from 'moment'

export default class Other extends Component {

  config = {
    navigationBarTitleText: '学法典读',
  }
  state = {
    example: {},
  }

  componentWillMount () {
    let { title } = this.$router.params;
    const found = allListData.find(i => i.title === title);
    if (found) {
      this.setState({
        example: found
      });
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F4ECD8'
      })
      Taro.setNavigationBarTitle({
        title: title
      })
    }
  }

  onShareAppMessage() {
    const {example} = this.state;
    return {
      path: 'pages/learningDetail/index?title=${example.title}',
      title: `${example.title}《最高法学法典读案例答问题》`,
    };
  }


  render () {
    const {example} = this.state
    return (
      <View className='other-page page'>
        <ad unit-id="adunit-0320f67c0e860e36"></ad>
        <View className='title'>{`《最高法学法典读案例答问题》${example.title}`}</View>
        <TextSectionComponent data={example.question} />
        {example.answer && <View className='title'>答案</View>}
        <TextSectionComponent data={example.answer.replace(/(\r\n|\n|\r)/gm, "")} />
      </View>
    )
  }
}
