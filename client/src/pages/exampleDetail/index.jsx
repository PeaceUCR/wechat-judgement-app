import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View,Input} from '@tarojs/components'
import {AtFab, AtIcon, AtActivityIndicator, AtNoticebar, AtButton} from "taro-ui";
import { db } from '../../util/db'
import TextSection from '../../components/textSection/index.weapp'
import './index.scss'
import {checkIfNewUser, redirectToIndexIfNewUser} from "../../util/login";
import throttle from "lodash/throttle";
import {DiscussionArea} from "../../components/discussionArea/index.weapp";

export default class ExampleDetail extends Component {

  state = {
    comment: '',
    isSent: false,
    id: '',
    type: '',
    example: {},
    keyword: '',
    zoomIn: false,
    isCollected: false,
    isReadMode: false,
    isLoading: true
  }

  config = {
    navigationBarTitleText: '详情'
  }

  componentWillMount () {
    const that = this;
    const { id, type, keyword } = this.$router.params;
    if(type === 'court') {
      db.collection('court-examples').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='procuratorate') {
      db.collection('procuratorate-examples').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='explanation') {
      db.collection('explanation').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='terms-complement') {
      db.collection('terms-complement').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='complement') {
      db.collection('complement').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='consultant') {
      db.collection('consult').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='court-open') {
      db.collection('court-open').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='civilLawExample') {
      db.collection('civil-law-link-example-detail').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    } else if (type ==='civilLawExplaination') {
      db.collection('civil-law-explaination').where({_id: id}).get({
        success: (res) => {
          that.setState({example: res.data[0], isLoading: false, type, id, keyword});
        }
      });
    }

    // let collection = getStorageSync('collection');
    // collection = collection ? collection : {};
    // that.setState({
    //   isCollected: collection[id] === true
    // })
    Taro.cloud.callFunction({
      name: 'isCollected',
      data: {
        id: id,
        type: type
      },
      complete: (r) => {

        if (r && r.result && r.result.data && r.result.data.length > 0) {
          that.setState({isCollected: true})
        }
      },
      fail: (e) => {
        Taro.showToast({
          title: `获取收藏数据失败:${JSON.stringify(e)}`,
          icon: 'none',
          duration: 1000
        })
      }
    })

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

  renderSectionAndChapter = () => {
    const {term} = this.state;
    const {part, chapter, section} = term;
    return (
      <View className='header'>
        <View>{part}</View>
        <View>{chapter}</View>
        <View>{section}</View>
      </View>
    )
  }

  renderCourtExample = () => {
    const {example, keyword, zoomIn} = this.state;
    const {content} = example;
    return (<View>
      <TextSection data={content.join('\n')} keyword={keyword} zoomIn={zoomIn} />
    </View>)
  }

  renderProcuratorateExample = () => {
    const {example, keyword, zoomIn} = this.state;
    const {text} = example;
    return (<View>
      <TextSection data={text} keyword={keyword} zoomIn={zoomIn} />
    </View>)
  }

  renderTermComplement = () => {
    const {example, keyword, zoomIn} = this.state;
    const {content, title} = example;
    return (<View>
      <View className='term-complement-title'>{title}</View>
      <TextSection data={content} keyword={keyword} zoomIn={zoomIn} />
    </View>)
  }

  renderComplement = () => {
    const {example, keyword, zoomIn} = this.state;
    const {content, title} = example;
    return (<View>
      <View className='term-complement-title'>{title}</View>
      <TextSection data={content} keyword={keyword} zoomIn={zoomIn} />
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
      else if (type === 'civilLawExample') { title = example.content.split('\n').filter(line => line.trim() && line.trim().length > 0)[0] }
      else {title = example.title}
      Taro.cloud.callFunction({
        name: 'collect',
        data: {
          id: _id,
          type: type,
          title: title
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

  render () {
    const {isSent, comment, example, type, zoomIn, isCollected, isReadMode, isLoading} = this.state;
    return (
      <View className={`example-detail-page ${zoomIn ? 'zoom-in' : ''} ${isReadMode ? 'read-mode' : ''}`}>
        {(example._id === '89b4bfb25f7dbcac007cec4b1f087eb1' || example._id === '89b4bfb25f7dbcac007cec402fa9835f') &&
        <AtNoticebar marquee speed={60}>
          最高人民法院关于部分指导性案例不再参照的通知(2021.1.1):为保证国家法律统一正确适用,根据《中华人民共和国民法典》等有关法律规定和审判实际,经最高人民法院审判委员会讨论决定,9号、20号指导性案例不再参照。但该指导性案例的裁判以及参照该指导性案例作出的裁判仍然有效。
        </AtNoticebar>
        }
        {type === 'court' && this.renderCourtExample()}
        {(type === 'procuratorate' || type === 'explanation' || type === 'court-open') && this.renderProcuratorateExample()}
        {type === 'terms-complement' && this.renderTermComplement()}
        {(type === 'complement' || type ==='consultant' || type === 'civilLawExample' || type === 'civilLawExplaination') && this.renderComplement()}

        <View className='footer'>
          <View className='text'>
            <Input
              className='input'
              value={comment}
              onInput={this.handleCommentChange}
              onClear={this.handleClear}
              type='text'
              placeholder='欢迎发表你的观点'
            />
            <AtButton type='primary' size='small' onClick={this.handleSend}>
              发表
            </AtButton>
          </View>
          <View className='favorite-container' onClick={this.handleCollect} >
            <AtIcon value={isCollected ? 'star-2' : 'star'} size='32' color={isCollected ? '#ffcc00' : 'rgba(0, 0, 0, 0.6)'}></AtIcon>
          </View>
          <AtFab size='small' className='float-zoom' onClick={() => {this.handleZoom()}}>
            <View  className={`zoom ${zoomIn ? 'zoom-in': 'zoom-out'}`} mode='widthFix' />
          </AtFab>
        </View>
        <DiscussionArea topicId={example._id}  isSent={isSent} handleCommentsLoaded={this.handleCommentsLoaded} />
        <View id='comments'></View>
        {isLoading && <View className='loading-container'>
          <AtActivityIndicator mode='center' color='black' content='加载中...' size={62}></AtActivityIndicator>
        </View>}
      </View>
    )
  }
}