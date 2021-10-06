import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Picker, Button, Image} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon, AtActionSheet, AtTag} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {db} from "../../util/db";
import Loading2 from "../../components/loading2/index.weapp";
import {
  lawOptions,
  criminalLawOptions,
  civilLawOptions,
  getLawChnName,
  getLawName,
  getCriminalLawChnNumber,
  getCriminalLawNumber,
  getCivilLawChnNumber,
  getCivilLawNumber,
  lawIcon
} from "../../util/name";
import GlobalSearchItem from '../../components/globalSearchItem/index.weapp'
import {getUserAvatar} from "../../util/login";


const settingIcon =
  'https://mmbiz.qpic.cn/mmbiz_png/6fKEyhdZU92UYROmCwI9kIRFU6pnKzycaPtbJdQ4ibwv99ttVwWNj2GkAib2icbrPD3cyGLWuTNMjs8I3pB1X6QOw/0?wx_fmt=png'

const criminalKeywords = ['非法占有','自首','罚金','共同犯罪','故意犯','从犯','程序合法','减轻处罚','拘役','财产权','管制','犯罪未遂','违法所得','合法财产','返还','没收','所有权','偶犯','恶意透支','胁迫','立功','扣押','鉴定','合同','合同诈骗','冒用','伪造','合伙','共同故意','着手','没收财产','利息','聋哑人','人身权利','传唤']
const civilKeywords = ['合同','利息','利率','合同约定','民间借贷','强制性规定','违约金','返还','贷款','驳回','担保','交通事故','借款合同','鉴定','清偿','给付','处分','人身损害赔偿','误工费','违约责任','保证','交付','赔偿责任','传票','买卖合同','债权','传唤','缺席判决','交通事故损害赔偿','债务人','民事责任','债权人','承诺','租赁','婚姻','夫妻关系','连带责任']

export default class Index extends Component {

  state = {
    isNewUser: false,
    isReadMode: false,
    isUserLoaded: false,
    userName: '',
    userOpenId: '',
    userAvatar: '',
    law: '',
    number: '',
    searchValue: '',
    showSetting: true,
    showLoading: false,
    resultList: [],
    isMenuOpened: false,
    activeKeyMap: {},
    selectedCriminalKeywords: [],
    province: '',
    enableMainAd: false,
    hasVisit: true
  }

  config = {
    navigationStyle: 'custom'
  }

  onShareAppMessage() {
    const {law, number, searchValue} = this.state;
    return {
      path: `/pages/index/index?law=${law}&number=${number}&searchValue=${searchValue}`
    };
  }

  componentWillMount () {
    const { userOpenId, userName, userAvatar, law, number, searchValue } = this.$router.params;
    this.setState({
      userOpenId,
      userName,
      userAvatar,
      law,
      number,
      searchValue
    })
    const that = this
    db.collection('configuration').where({}).get({
      success: (res) => {
        console.log(res.data[0])
        const {enableMainAd} = res.data[0]
        that.setState({
          enableMainAd: enableMainAd
        })
      }
    });
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    const setting = getStorageSync('setting');
    if (setting && setting.isReadMode === false) {
      this.setState({isReadMode: false})
    } else {
      setStorageSync('setting', { isReadMode: true })
      this.setState({isReadMode: true})
      console.log('default set to read mode')
    }

    const {isReadMode} = this.state;
    if ( isReadMode ) {
      console.log('read')
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F4ECD8'
      })
    }

    const userAvatar = getUserAvatar();
    this.setState({userAvatar})

    if (!getStorageSync('hasVisit')) {
      Taro.showToast({
        title: `首次使用，请先点击右侧的帮助`,
        icon: 'none',
        duration: 4000
      })
      setStorageSync('hasVisit', true)
      this.setState({hasVisit: false})
    } else {
      this.setState({hasVisit: true})
    }
  }

  componentDidHide () { }

  renderUserFloatButton () {
    const {isUserLoaded, userAvatar} = this.state;
    return (<UserFloatButton isUserLoaded={isUserLoaded} avatarUrl={userAvatar} handleLoginSuccess={() => {
      Taro.navigateTo({
        url: '/pages/user/index'
      })
    }}
    />)
  }

  handleLoginSuccess = () => {
    this.setState({isNewUser: false});
    Taro.hideLoading();
  }

  selectLaw = (e) => {
    const law = getLawName(lawOptions[e.detail.value])
    this.setState({
      law: law,
      number: '',
      activeKeyMap: {},
      selectedCriminalKeywords: [],
      province: '',
    })
  }

  selectCriminalNumber = (e) => {
    this.setState({
      number: getCriminalLawNumber(criminalLawOptions[e.detail.value])
    })
  }

  selectCivilNumber = (e) => {
    this.setState({
      number: getCivilLawNumber(civilLawOptions[e.detail.value])
    })
  }

  handleInputNumber = (value) => {
    this.setState({
      number: value
    })
  }

  handleProvinceChange = (value) => {
    this.setState({
      province: value
    })
  }

  renderSearchCriteria = () => {
    const {law, number, selectedCriminalKeywords, province} = this.state
    return <View>
      <Picker mode='selector' range={lawOptions} onChange={this.selectLaw}>
        <AtList>
          <AtListItem
            title='类型'
            extraText={getLawChnName(law)}
          />
        </AtList>
      </Picker>
      {law === 'criminal' && <View>
        <Picker mode='selector' range={criminalLawOptions} onChange={this.selectCriminalNumber}>
          <AtList>
            <AtListItem
              title='法条'
              extraText={getCriminalLawChnNumber(number)}
            />
          </AtList>
        </Picker>
        <View>
          <AtInput
            type='text'
            placeholder='  或输入法条数字序号,如264'
            value={number}
            onChange={this.handleInputNumber}
          />
        </View>
        <View className='icon-line' onClick={() => {
          this.setState({
            isMenuOpened: true
          })}}
        >
          <AtBadge value={selectedCriminalKeywords.length}>
            <AtIcon value='tags' size='24' color='rgba(0,0,0)'></AtIcon>
          </AtBadge>
          <View className='text'>{selectedCriminalKeywords.length > 0 ? selectedCriminalKeywords.join(',') : '关键词'}</View>
        </View>
        <View className='icon-line'>
          <AtIcon value='map-pin' size='26' color='#b35900' onClick={() => {
            const that = this
            Taro.getLocation({
              success(res) {
                console.log(res)
                const {latitude, longitude} = res
                Taro.request({
                  url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=4POBZ-YEXYD-NPQ4R-PNZJ4-3XEE5-FFBXF`,
                  method: 'get',
                  success: function (r) {
                    console.log(r)
                    const {data} = r
                    const {result} = data
                    const {address_component} = result
                    const {province} = address_component
                    that.setState({
                      province:province
                    })
                  }
                })

              }
            })
          }}></AtIcon>
          <AtInput
            type='text'
            placeholder='位置'
            value={province}
            onChange={this.handleProvinceChange}
          />
        </View>
      </View>}
      {law === 'civil' && <View>
        <Picker mode='selector' range={civilLawOptions} onChange={this.selectCivilNumber}>
          <AtList>
            <AtListItem
              title='民法典法条'
              extraText={getCivilLawChnNumber(number)}
            />
          </AtList>
        </Picker>
        <View>
          <AtInput
            type='text'
            placeholder='  或输入法条数字序号,如1'
            value={number}
            onChange={this.handleInputNumber}
          />
        </View>
        <View className='icon-line' onClick={() => {
          this.setState({
            isMenuOpened: true
          })}}
        >
          <AtBadge value={selectedCriminalKeywords.length}>
            <AtIcon value='tags' size='24' color='rgba(0,0,0)'></AtIcon>
          </AtBadge>
          <View className='text'>{selectedCriminalKeywords.length > 0 ? selectedCriminalKeywords.join(',') : '关键词'}</View>
        </View>
        <View className='icon-line'>
          <AtIcon value='map-pin' size='26' color='#b35900' onClick={() => {
            const that = this
            Taro.getLocation({
              success(res) {
                console.log(res)
                Taro.showLoading()
                const {latitude, longitude} = res
                Taro.request({
                  url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=4POBZ-YEXYD-NPQ4R-PNZJ4-3XEE5-FFBXF`,
                  method: 'get',
                  success: function (r) {
                    console.log(r)
                    const {data} = r
                    const {result} = data
                    const {address_component} = result
                    const {province} = address_component
                    that.setState({
                      province:province
                    })
                    Taro.hideLoading()
                  }
                })

              }
            })
          }}></AtIcon>
          <AtInput
            type='text'
            placeholder='位置'
            value={province}
            onChange={this.handleProvinceChange}
          />
        </View>
      </View>}
    </View>
  }

  onChangeSearchValue = (value) => {
    this.setState({
      searchValue: value
    })
  }

  onSearch = () => {
    const that = this;
    const  { law, number, searchValue, selectedCriminalKeywords, province } = this.state;
    if (law === 'criminal') {
      let intVal = Number(number)
      if (isNaN(intVal) || number < 114 || number > 419) {
        Taro.showToast({
          title: `无效条文序号${number},请修正后再试！`,
          icon: 'none',
          duration: 4000
        })
        return ;
      }
    }
    if (law === 'civil') {
      return that.searchCivil()
    }
    this.setState({
      showLoading: true
    })
    Taro.cloud.callFunction({
      name: 'searchExamples',
      data: {
        law,
        number,
        searchValue,
        selectedCriminalKeywords,
        province
      },
      complete: (r) => {
        console.log(r)
        if (r && r.result && r.result.data && r.result.data.length > 0) {
          that.setState({
            resultList: r.result.data
          })
          Taro.showToast({
            title: `仅显示前100个结果!`,
            icon: 'none',
            duration: 4000
          })
        } else {
          Taro.showToast({
            title: `未找到,可能是还未收录,敬请期待!`,
            icon: 'none',
            duration: 6000
          })
          that.setState({
            resultList: []
          })
        }
        that.setState({
          showLoading: false
        })
      }
    })
  }

  searchCivil = () => {
    const that = this;
    const  { law, number, searchValue, selectedCriminalKeywords, province } = this.state;
    if (number || searchValue || selectedCriminalKeywords.length > 0 || province) {
      this.setState({
        showLoading: true
      })
      Taro.cloud.callFunction({
        name: 'searchCivilExamples',
        data: {
          law,
          number,
          searchValue,
          selectedCriminalKeywords,
          province
        },
        complete: (r) => {
          console.log(r)
          if (r && r.result && r.result.data && r.result.data.length > 0) {
            that.setState({
              resultList: r.result.data
            })
            Taro.showToast({
              title: `仅显示前100个结果!`,
              icon: 'none',
              duration: 4000
            })
          } else {
            Taro.showToast({
              title: `未找到,可能是还未收录,敬请期待!`,
              icon: 'none',
              duration: 6000
            })
            that.setState({
              resultList: []
            })
          }
          that.setState({
            showLoading: false
          })
        }
      })
    } else {
      Taro.showToast({
        title: `必须包含搜索一个以上的搜索项(法条/关键字/位置)`,
        icon: 'none',
        duration: 6000
      })
    }

  }

  handleClose = () => {
    const {law, number} = this.state
    if (!law) {
      Taro.showToast({
        title: `请选法律`,
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    if (!number && law === 'criminal') {
      Taro.showToast({
        title: `请选法条`,
        icon: 'none',
        duration: 3000
      })
      return ;
    }
    this.setState({
      showSetting: false
    })
    this.onSearch()
  }

  handleOpen = () => {
    this.setState({
      showSetting: true
    });
  }

  renderTagLine = () => {
    const {law, number} = this.state
    return (
      <View className='tag-line'>
        {law && <View className='law'>{law === 'criminal'?'刑事案件':'民事案件'}</View>}
        {number && <View className='number'>{law === 'criminal'? getCriminalLawChnNumber(number) : getCivilLawChnNumber(number)}</View>
        }
      </View>
    )
  }

  renderResults = () => {
    const {law, resultList, searchValue, selectedCriminalKeywords} = this.state
    let keyword
    if (selectedCriminalKeywords && selectedCriminalKeywords.length > 0) {
      if (searchValue) {
        keyword = [...selectedCriminalKeywords, searchValue].join('|');
      } else {
        keyword = [...selectedCriminalKeywords].join('|');
      }
    } else {
      keyword = searchValue ? searchValue : ''
    }
    return (<View>
      {resultList.map(item => {
        return (
          <GlobalSearchItem
            key={item._id}
            text={item.opinion}
            title={item.title}
            date={item.date}
            courtName={item.courtName}
            caseNumber={item.caseNumber}
            redirect={() => {
              Taro.navigateTo({
                url: `/pages/exampleDetail/index?id=${item.rowkey}&type=${law}&keyword=${keyword}`,
              })
              return ;

            }}
          />
        )
      })}
      {resultList.length > 0 && <AtDivider content='没有更多了' fontColor='#666' />}
      {resultList.length > 0 && <View >
        <ad unit-id="adunit-0320f67c0e860e36"></ad>
      </View>}
    </View>)
  }

  jumpToMiniProgram = () => {
      const redirectStr = `/pages/index/index`
      Taro.navigateToMiniProgram({
        appId: 'wxf6d4249d423ff2a3',
        path: redirectStr
      });
    }

  handleMenuClose = () => {
    const {activeKeyMap} = this.state
    const keys = Object.keys(activeKeyMap).filter(k => activeKeyMap[k])
    console.log(keys)
    this.setState({
      isMenuOpened: false,
      selectedCriminalKeywords: keys
    })
  }

  handleCriminalKeywordClick = (e) => {
    const {name} = e
    const {activeKeyMap} = this.state;
    activeKeyMap[name] = !activeKeyMap[name]
    this.setState({
      activeKeyMap: {...activeKeyMap}
    })
  }

  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading,isMenuOpened, activeKeyMap, selectedCriminalKeywords, enableMainAd, resultList,
    hasVisit} = this.state;
    return (
      <View className={`index-page ${isReadMode ? 'read-mode' : ''}`}>
        {/*{this.renderTagLine()}*/}

        <AtNoticebar marquee speed={60}>
          本小程序数据信息均来源于裁判文书网，已收录超过20万份裁判文书，持续开发中...
        </AtNoticebar>
        <AtSearchBar
          placeholder='当前法条下搜索案由'
          value={searchValue}
          onChange={this.onChangeSearchValue}
          onActionClick={this.onSearch}
        />
        {this.renderResults()}
        {/*<View>userOpenId: {userOpenId}</View>*/}
        {/*<View>userName: {userName}</View>*/}
        {/*<View>userAvatar: {userAvatar}</View>*/}
        {/*<View>law: {law}</View>*/}
        {/*<View>number: {number}</View>*/}
        {/*<View>searchValue: {searchValue}</View>*/}
        <AtModal isOpened={showSetting}>
          <AtModalHeader>我要搜</AtModalHeader>
          <AtModalContent>
            {this.renderSearchCriteria()}
          </AtModalContent>
          <AtModalAction>
            <Button className='btn-5' onClick={this.handleClose} >确定</Button>
          </AtModalAction>
          {/*<View className='search-law' onClick={this.jumpToMiniProgram}>去搜法搜更多法律知识</View>*/}
        </AtModal>
        {!isNewUser && this.renderUserFloatButton()}
        {showLoading && <Loading2 />}
        <View onClick={this.handleOpen} className='float-setting'>
          <Image src={settingIcon} className='setting' mode='widthFix' />
        </View>

        <View className={`${hasVisit ? '' : 'focus'} float-help`} onClick={() => {
          Taro.navigateTo({
            url: '/pages/other/index'
          })
        }}
        >
          <AtBadge value='帮助'>
            <AtIcon value='help' size='26' color='rgba(0,0,0, 0.6)'></AtIcon>
          </AtBadge>
        </View>

        <View className='float-sofa' onClick={this.jumpToMiniProgram}>
          <AtBadge value='搜法'>
            <Image
              src={lawIcon}
              className='law-icon'
              mode='widthFix'
            />
          </AtBadge>
        </View>

        <AtActionSheet isOpened={isMenuOpened} cancelText='确定' title='请选择关键字(可多选)' onClose={() => {this.setState({isMenuOpened: false})}} onCancel={this.handleMenuClose}>
          {law === 'criminal' && <View>
            {criminalKeywords.map(criminalKeyword => {
              return (
                <AtTag
                  key={criminalKeyword}
                  name={criminalKeyword}
                  circle
                  active={activeKeyMap[criminalKeyword]}
                  onClick={this.handleCriminalKeywordClick}
                >{criminalKeyword}</AtTag>
              )
            })}
          </View>}
          {law === 'civil' && <View>
            {civilKeywords.map(criminalKeyword => {
              return (
                <AtTag
                  key={criminalKeyword}
                  name={criminalKeyword}
                  circle
                  active={activeKeyMap[criminalKeyword]}
                  onClick={this.handleCriminalKeywordClick}
                >{criminalKeyword}</AtTag>
              )
            })}
          </View>}
        </AtActionSheet>
        {enableMainAd && resultList && resultList.length === 0 && !isMenuOpened && <View className='ad-bottom'>
          <ad unit-id="adunit-0320f67c0e860e36"></ad>
        </View>}
      </View>
    )
  }
}
