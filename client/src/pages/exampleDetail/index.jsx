import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View, Button, Image} from '@tarojs/components'
import {AtIcon, AtBadge, AtDivider, AtModal,AtModalHeader, AtModalContent,AtModalAction} from "taro-ui";
import { db } from '../../util/db'
import TextSection from '../../components/textSection/index.weapp'
import './index.scss'
import {checkIfNewUser, redirectToIndexIfNewUser} from "../../util/login";
import throttle from "lodash/throttle";
import {DiscussionArea} from "../../components/discussionArea/index.weapp";
import {convertNumberToChinese} from "../../util/convertNumber"
import {lawIcon} from "../../util/name"
import Loading2 from "../../components/loading2/index.weapp";

export default class ExampleDetail extends Component {

  state = {
    id: '',
    type: '',
    keyword: '',
    example: undefined,
    brief: undefined,
    zoomIn: false,
    isReadMode: false,
    isCollected: false,
    isBriefLoading: true,
    isExampleLoading: true,
    isLoading: false,
    showRelatedLaw: false
  }

  config = {
    navigationBarTitleText: '详情'
  }

  componentWillMount () {
    const that = this;
    let { id, type, keyword } = this.$router.params;

    if (type === 'criminal') {
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
        success: (res1) => {
          const detail1 = res1.data[0]

          db.collection('criminal-case-detail-2').where({rowKey: id}).get({
            success: (res2) => {

              const detail2 = res2.data[0]
              db.collection('criminal-case-detail-3').where({rowKey: id}).get({
                success: (res3) => {

                  const detail3 = res3.data[0]
                  let example
                  if (detail1) {
                    example = detail1
                  }
                  if (detail2) {
                    example = detail2
                  }
                  if (detail3) {
                    example = detail3
                  }
                  that.setState({example: example ? example: undefined, isExampleLoading: false, type, id});
                },
                fail: () => {
                  console.log('fail')
                  that.setState({isExampleLoading: false})
                }
              });

            },
            fail: () => {
              console.log('fail')
              that.setState({isExampleLoading: false})
            }
          });
        },
        fail: () => {
          console.log('fail')
          that.setState({isExampleLoading: false})
        }
      });

    } else if (type === 'civil') {
      db.collection('civil-case').where({rowkey: id}).get({
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

      db.collection('civil-case-detail').where({rowKey: id}).get({
        success: (res1) => {
          const detail1 = res1.data[0]

          db.collection('civil-case-detail-2').where({rowKey: id}).get({
            success: (res2) => {

              const detail2 = res2.data[0]
              db.collection('civil-case-detail-3').where({rowKey: id}).get({
                success: (res3) => {

                  const detail3 = res3.data[0]
                  let example
                  if (detail1) {
                    example = detail1
                  }
                  if (detail2) {
                    example = detail2
                  }
                  if (detail3) {
                    example = detail3
                  }
                  that.setState({example: example ? example: undefined, isExampleLoading: false, type, id});
                },
                fail: () => {
                  console.log('fail')
                  that.setState({isExampleLoading: false})
                }
              });

            },
            fail: () => {
              console.log('fail')
              that.setState({isExampleLoading: false})
            }
          });
        },
        fail: () => {
          console.log('fail')
          that.setState({isExampleLoading: false})
        }
      });

    }

    Taro.cloud.callFunction({
      name: 'isCollected',
      data: {
        rowKey: id
      },
      complete: (r) => {
        console.log(r)
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

  renderExample = () => {
    const {brief, example, keyword, zoomIn} = this.state;
    const {textHead, textPartner, textMain, textReason, textDecide, textJudge} = example;
    const {opinion} = brief
    console.log('isEqual?', opinion === textReason)
    // use opinion instead of textReason to reduce the size
    return (<View>
      <View className='term-complement-title'>{brief.title}</View>
      <TextSection data={textHead} keyword={keyword} zoomIn={zoomIn} isTitle />
      <TextSection data={textPartner} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={textMain} keyword={keyword} zoomIn={zoomIn} />
      <TextSection data={opinion} keyword={keyword} zoomIn={zoomIn} />
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
    const { isCollected, brief, type } = this.state;
    const {rowkey, title} = brief;
    that.setState({isLoading: true});

    if (isCollected) {
      Taro.cloud.callFunction({
        name: 'deleteCollection',
        data: {
          rowKey: rowkey,
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

      Taro.cloud.callFunction({
        name: 'collect',
        data: {
          rowKey: rowkey,
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

  renderNoData = () => {
    return (<View>
      <View className='no-data'>出错啦!</View>
      <View className='no-data'>详情还在收录中,敬请期待!</View>
    </View>)
  }

  renderLink = () => {
    const {id} = this.state
    return (<View className='link' onClick={() => {
      Taro.setClipboardData({
        data: `https://wenshu.court.gov.cn/website/wenshu/181107ANFZ0BXSK4/index.html?docId=${id}`,
        success: function () {
          Taro.showToast({
            title: `裁判文书网链接已复制`,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }}
    >
      裁判文书原文链接
    </View>)
  }

  openRelatedLaw = () => {
    this.setState({
      showRelatedLaw: true
    })
  }

  jumpToMiniProgram = (law) => {
    const redirectStr = `/pages/termDetail/index?chnNumber=${convertNumberToChinese(parseInt(law))}`

    Taro.navigateToMiniProgram({
      appId: 'wxf6d4249d423ff2a3',
      path: redirectStr
    });
  }
  jumpToMiniProgramCivil = (law) => {
    const redirectStr = `/pages/civilLawDetail/index?number=${parseInt(law)}`

    Taro.navigateToMiniProgram({
      appId: 'wxf6d4249d423ff2a3',
      path: redirectStr
    });
  }

  renderRelatedLaw = () => {
    const {brief} = this.state
    const lawList = brief.criminalLaw.split(',')
    return (<View>
      {lawList.map(law => (
        <View
          className='related-law-link'
          key={law}
          onClick={() => {
            return this.jumpToMiniProgram(law)
          }}
        >{`刑法${convertNumberToChinese(parseInt(law))}`}</View>
      ))}
    </View>)

  }
  renderRelatedCivilLaw = () => {
    const {brief} = this.state
    const {civilLaws} = brief
    return (<View>
      {civilLaws.map(law => (
        <View
          className='related-law-link'
          key={law}
          onClick={() => {
            return this.jumpToMiniProgramCivil(law)
          }}
        >{`民法典${convertNumberToChinese(parseInt(law))}`}</View>
      ))}
    </View>)
  }

  render () {
    const { example, brief, zoomIn, isReadMode, isBriefLoading, isExampleLoading,
      isLoading, isCollected, type, showRelatedLaw} = this.state;
    return (<View>
        <View className={`example-detail-page ${zoomIn ? 'zoom-in' : ''} ${isReadMode ? 'read-mode' : ''}`}>
          <View>
            {!isExampleLoading && !isBriefLoading && example && this.renderExample()}
          </View>
          {(!isExampleLoading && !isBriefLoading && !example) && this.renderNoData()}
          {this.renderLink()}
          {(isBriefLoading || isExampleLoading || isLoading) && <Loading2 />}
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

          <View className='favorite-container' onClick={this.handleCollect} >
            <AtIcon value={isCollected ? 'heart-2' : 'heart'} size='32' color={isCollected ? '#e62e00' : 'rgba(0, 0, 0, 0.6)'}></AtIcon>
          </View>

          <View className='share-container'>
            <AtBadge value='分享'>
              <Button className='share-button' openType='share'>
                <AtIcon value='share-2' size='32' color='#6190E8'></AtIcon>
              </Button>
            </AtBadge>
          </View>

          {type === 'civil' && brief && brief.civilLaws && brief.civilLaws.length > 0 && <View className='float-help' onClick={this.openRelatedLaw}>
            <AtBadge value='相关法条'>
              <Image
                src={lawIcon}
                className='law-icon'
                mode='widthFix'
              />
            </AtBadge>
          </View>}

          {type === 'criminal' && <View className='float-help' onClick={this.openRelatedLaw}>
            <AtBadge value='相关法条'>
              <Image
                src={lawIcon}
                className='law-icon'
                mode='widthFix'
              />
            </AtBadge>
          </View>}

          <AtModal isOpened={showRelatedLaw} closeOnClickOverlay={false}>
            <AtModalHeader>相关法条</AtModalHeader>
            <AtModalContent>
              {type === 'criminal' && brief && brief.criminalLaw && this.renderRelatedLaw()}
              {type === 'civil' && brief && brief.civilLaws && brief.civilLaws.length > 0 && this.renderRelatedCivilLaw()}
            </AtModalContent>
            <AtModalAction>
              <Button onClick={() => {
                this.setState({
                  showRelatedLaw: false
                })
              }}
              >确定</Button>
            </AtModalAction>
          </AtModal>

        </View>
      </View>)
  }
}
