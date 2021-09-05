import Taro, { Component } from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import {db} from "../../util/db";


export default class Other extends Component {

  config = {
    navigationBarTitleText: '帮助',
  }
  state = {
    helpeUrl:''
  }

  componentWillMount () {
    const that = this;
    db.collection('configuration').where({}).get({
      success: (res) => {
        const {helpeUrl} = res.data[0]
        that.setState({
          helpeUrl
        })
      }
    });
  }

  onShareAppMessage() {
    return {
      path: 'pages/other/index'
    };
  }


  render () {
    const {helpeUrl} = this.state
    return (
      <View className='other-page'>
        <WebView src={helpeUrl} />
      </View>
    )
  }
}
