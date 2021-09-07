import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View,Input, Button} from '@tarojs/components'
import {AtFab, AtIcon, AtActivityIndicator, AtNoticebar, AtButton, AtBadge, AtDivider} from "taro-ui";
import { db } from '../../util/db'
import TextSection from '../../components/textSection/index.weapp'
import './index.scss'
import {checkIfNewUser, redirectToIndexIfNewUser} from "../../util/login";
import throttle from "lodash/throttle";
import {DiscussionArea} from "../../components/discussionArea/index.weapp";
import {convertNumberToChinese} from "../../util/convertNumber"


export default class ExampleDetail extends Component {

  state = {
    id: '',
    type: '',
    keyword: '',
    example: undefined,
    brief: undefined,
    zoomIn: false,
    isReadMode: false,
    isBriefLoading: true,
    isExampleLoading: true,
  }

  config = {
    navigationBarTitleText: '详情'
  }

  componentWillMount () {
    const that = this;
    let { id, type, keyword } = this.$router.params;

    db.collection('criminal-case').where({rowkey: id}).get({
      success: (res) => {
        let  highlighted
        if (keyword) {
          highlighted = keyword;
        } else {
          const {criminalLaw} = res.data[0];
          if (criminalLaw) {
            highlighted = convertNumberToChinese(parseInt(criminalLaw))
          }
        }

        that.setState({brief: res.data[0], keyword: highlighted, isBriefLoading: false, type, id});
      },
      fail: () => {
        console.log('fail')
        that.setState({isBriefLoading: false})
      }
    });

    db.collection('criminal-case-detail').where({rowKey: id}).get({
      success: (res) => {
        that.setState({example: res.data[0] ? res.data[0]: undefined, isExampleLoading: false, type, id});
      },
      fail: () => {
        console.log('fail')
        that.setState({isExampleLoading: false})
      }
    });


    const setting = getStorageSync('setting');
    this.setState({isReadMode: setting && setting.isReadMode})
    if (setting && setting.isReadMode) {
      console.log('read')
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F4ECD8'
      })
    }
  }

  onShareAppMessage() {
    const {type, id, keyword} = this.state;
    return {
      path: `/pages/exampleDetail/index?type=${type}&id=${id}&keyword=${keyword}`
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  renderExample = () => {
    const {brief, example, keyword, zoomIn} = this.state;
    const {textHead, textPartner, textMain, textReason, textDecide, textJudge} = example;
    // if (title) {
    //   Taro.setNavigationBarTitle({title: title})
    // }
    return (<View>
      <View className='term-complement-title'>{brief.title}</View>
      <TextSection data={textHead} keyword={keyword} zoomIn={zoomIn} isTitle />
      <TextSection data={textPartner} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={textMain} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={textReason} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={textDecide} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={textJudge} keyword={keyword} zoomIn={zoomIn} />
    </View>)
  }

  handleZoom = () => {
    const {zoomIn} = this.state;
    this.setState({zoomIn: !zoomIn})
  }

  handleCollect = throttle(() => {
    if (checkIfNewUser()) {
      redirectToIndexIfNewUser()
      return ;
    }

    const that = this;
    const { isCollected, example, type } = this.state;
    const {_id} = example;
    that.setState({isLoading: true});

    if (isCollected) {
      Taro.cloud.callFunction({
        name: 'deleteCollection',
        data: {
          id: _id,
          type: type
        },
        complete: () => {
          that.setState({isLoading: false, isCollected: false});
          Taro.showToast({
            title: '收藏取消',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      let title;
      if (type === 'explanation') { title = example.name }
      else if (type === 'procuratorate') { title = `${example.number}${example.name}` }
      else if (type === 'consultant') { title = `第${example.number}号${example.name}` }
      else if (type === 'civilLawExample') { title = example.text.split('\n').filter(line => line.trim() && line.trim().length > 0)[0] }
      else {title = example.title}
      Taro.cloud.callFunction({
        name: 'collect',
        data: {
          id: _id,
          type: type,
          title: title.trim()
        },
        complete: (r) => {
          if (r && r.result && r.result.errMsg !== 'collection.add:ok') {
            Taro.showToast({
              title: `收藏失败:${r.result.errMsg}`,
              icon: 'none',
              duration: 3000
            })
            that.setState({isLoading: false})
            return ;
          }

          that.setState({isLoading: false, isCollected: true});
          Taro.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  }, 3000, { trailing: false })

  handleCommentChange = (e) => {
    this.setState({
      comment: e.target.value
    })
  }

  handleClear = () => {
    this.setState({
      comment: ''
    })
  }

  handleSend = () => {
    if (checkIfNewUser()) {
      redirectToIndexIfNewUser()
      return ;
    }
    const {comment, example, type} = this.state
    if (comment) {
      this.setState({
        isSent: false
      })
      Taro.showLoading({
        title: '发送中',
      })
      Taro.cloud.callFunction({
        name: 'addComment',
        data: {
          topicId: example._id,
          page: 'exampleDetail',
          type,
          content: comment
        },
        complete: (r) => {
          console.log(r)
          if ((r && r.errMsg !== 'cloud.callFunction:ok')
            || (r.result && r.result.errMsg !== "collection.add:ok")) {
            Taro.showToast({
              title: `发表失败:${r.result.errMsg}`,
              icon: 'none',
              duration: 3000
            })
            return ;
          } else {
            this.setState({
              comment: '',
              isSent: true
            })
            Taro.showToast({
              title: `发表成功`,
              icon: 'none',
              duration: 3000
            })
          }
          Taro.hideLoading()
        }
      })
    } else {
      Taro.showToast({
        title: '发表内容不能为空',
        icon: 'none',
        duration: 3000
      })
    }
  }

  handleCommentsLoaded = () => {
    setTimeout(() => {
      Taro.pageScrollTo({
        selector: `#comments`
      })
    }, 100)
  }

  renderNoData = () => {
    return (<View>
      <View className='no-data'>出错啦!</View>
      <View className='no-data'>详情还在收录中,敬请期待!</View>
    </View>)
  }

  renderLink = () => {
    const {brief} = this.state
    return (<View className='link' onClick={() => {
      Taro.setClipboardData({
        data: `https://wenshu.court.gov.cn/website/wenshu/181107ANFZ0BXSK4/index.html?docId=${brief.rowkey}`,
        success: function () {
          Taro.showToast({
            title: `裁判文书网链接已复制`,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }} >
      裁判文书原文链接
    </View>)
  }

  render () {
    const { example, brief, zoomIn,  isReadMode, isBriefLoading, isExampleLoading, type} = this.state;
    return (
      <View>
        <View className={`example-detail-page ${zoomIn ? 'zoom-in' : ''} ${isReadMode ? 'read-mode' : ''}`}>
          <View>
            {!isExampleLoading && !isBriefLoading && example && this.renderExample()}
          </View>
          {!isExampleLoading && !isBriefLoading && !example && this.renderNoData()}
          {this.renderLink()}
          {(isBriefLoading || isExampleLoading) && <View className='loading-container'>
            <AtActivityIndicator mode='center' color='black' content='加载中...' size={62}></AtActivityIndicator>
          </View>}
          {!isExampleLoading && !isBriefLoading && <AtDivider content='没有更多了' fontColor='#666' lineColor='transparent' />}

          <View className='back-to-top' onClick={() => {
            Taro.pageScrollTo({
              scrollTop: 0,
              duration: 500
            })
          }}
          >
            <AtIcon value='chevron-up' size='50' color='rgba(26, 117, 255, 0.6)'></AtIcon>
          </View>
        </View>
      </View>
    )
  }
}
