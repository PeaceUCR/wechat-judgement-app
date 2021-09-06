import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Picker, Button, Image} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction, AtInput, AtBadge, AtIcon} from "taro-ui";
import UserFloatButton from '../../components/userFloatButton/index.weapp'
import './index.scss'
import {db} from "../../util/db";
import Loading2 from "../../components/loading2/index.weapp";
import {lawOptions, criminalLawOptions, civilLawOptions, getLawChnName, getLawName, getCriminalLawChnNumber, getCriminalLawNumber, getCivilLawChnNumber, getCivilLawNumber} from "../../util/name";
import GlobalSearchItem from '../../components/globalSearchItem/index.weapp'


const settingIcon =
  'https://mmbiz.qpic.cn/mmbiz_png/6fKEyhdZU92UYROmCwI9kIRFU6pnKzycaPtbJdQ4ibwv99ttVwWNj2GkAib2icbrPD3cyGLWuTNMjs8I3pB1X6QOw/0?wx_fmt=png'

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
    resultList: []
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
    db.collection('configuration').where({}).get({
      success: (res) => {
        console.log(res)
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
  }

  componentDidHide () { }

  renderUserFloatButton () {
    const {isUserLoaded, userAvatar} = this.state;
    return (<UserFloatButton isUserLoaded={isUserLoaded} avatarUrl={userAvatar} />)
  }

  handleLoginSuccess = () => {
    this.setState({isNewUser: false});
    Taro.hideLoading();
  }

  selectLaw = (e) => {
    const law = getLawName(lawOptions[e.detail.value])
    if (law === 'civil') {
      Taro.showToast({
        title: `民法典模块正在收录中,请先使用刑法模块！`,
        icon: 'none',
        duration: 6000
      })
    }
    this.setState({
      law: law
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
  renderSearchCriteria = () => {
    const {law, number} = this.state
    return <View>
      <Picker mode='selector' range={lawOptions} onChange={this.selectLaw}>
        <AtList>
          <AtListItem
            title='法律'
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
            type='digit'
            placeholder='  或者输入序号,比如264'
            value={number}
            onChange={this.handleInputNumber}
          />
        </View>
      </View>}
      {law === 'civil' && <Picker mode='selector' range={civilLawOptions} onChange={this.selectCivilNumber}>
        <AtList>
          <AtListItem
            title='法条'
            extraText={getCivilLawChnNumber(number)}
          />
        </AtList>
      </Picker>}
    </View>
  }

  onChangeSearchValue = (value) => {
    this.setState({
      searchValue: value
    })
  }

  onSearch = () => {
    const that = this;
    const  { law, number, searchValue } = this.state;
    if (law === 'criminal') {
      if (number < 114 || number > 419) {
        Taro.showToast({
          title: `无效条文序号${number},请修正后再试！`,
          icon: 'none',
          duration: 4000
        })
        return ;
      }
    }
    this.setState({
      showLoading: true
    })
    Taro.cloud.callFunction({
      name: 'searchExamples',
      data: {
        law,
        number,
        searchValue
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
        }
        that.setState({
          showLoading: false
        })
      }
    })

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
    if (!number) {
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
    const {resultList} = this.state
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
                url: `/pages/exampleDetail/index?id=${item.rowkey}`,
              })
              return ;
              // Taro.setClipboardData({
              //   data: `https://wenshu.court.gov.cn/website/wenshu/181107ANFZ0BXSK4/index.html?docId=${item.rowkey}`,
              //   success: function () {
              //     Taro.showToast({
              //       title: `裁判文书网链接已复制`,
              //       icon: 'none',
              //       duration: 2000
              //     })
              //   }
              // });
              return;
            }}
          />
        )
      })}
      {resultList.length > 0 && <AtDivider content='没有更多了' fontColor='#666' lineColor='transparent' />}
    </View>)
  }


  render () {
    const {isNewUser, isReadMode, law, number, searchValue, showSetting, showLoading
    } = this.state;
    return (
      <View className={`index-page ${isReadMode ? 'read-mode' : ''}`}>
        {this.renderTagLine()}
        <AtNoticebar marquee speed={60}>
          本小程序数据信息均来源于裁判文书网，已收录超过10万份裁判文书，持续开发中...
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
        <AtModal isOpened={showSetting} closeOnClickOverlay={false}>
          <AtModalHeader>我要搜</AtModalHeader>
          <AtModalContent>
            {this.renderSearchCriteria()}
          </AtModalContent>
          <AtModalAction><Button className={law && number ? 'btn-5' : ''} onClick={this.handleClose} >确定</Button> </AtModalAction>
        </AtModal>
        {!isNewUser && this.renderUserFloatButton()}
        {showLoading && <Loading2 />}
        <View onClick={this.handleOpen} className='float-setting'>
          <Image src={settingIcon} className='setting' mode='widthFix' />
        </View>

        <View className='float-help' onClick={() => {
          Taro.navigateTo({
            url: '/pages/other/index'
          })
        }}
        >
          <AtBadge value='帮助'>
            <AtIcon value='help' size='24' color='#000'></AtIcon>
          </AtBadge>
        </View>
      </View>
    )
  }
}
