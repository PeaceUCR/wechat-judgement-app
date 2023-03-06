import Taro, { Component } from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import {db} from "../../util/db";
import {xiao_an_da_dao_li_ListData, xue_fa_dian_ListData} from "../../util/data";

export default class Other extends Component {

  config = {
    navigationBarTitleText: '详情',
  }
  state = {
    helpeUrl:''
  }

  componentWillMount () {
    const { type, title } = this.$router.params;
    console.log('title', type, title);
    if (type === 'xue_fa_dian') {
      const target = xue_fa_dian_ListData.find(item => item.title === title);
      if (target) {
        this.setState({
          helpeUrl: target.link
        })
      }
    }
    if (type === 'xiao_an_da_dao_li') {
      const target = xiao_an_da_dao_li_ListData.find(item => item.title === title);
      if (target) {
        this.setState({
          helpeUrl: target.link
        })
      }
    }
  }

  onShareAppMessage() {
    return {
      path: 'pages/other/index'
    };
  }


  render () {
    const {helpeUrl} = this.state
    return (
      <View className='other-page page'>
        <WebView src={helpeUrl} />
      </View>
    )
  }
}
