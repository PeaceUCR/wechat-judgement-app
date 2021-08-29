import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import {View, Picker, Button, Image} from '@tarojs/components'
import {AtDivider, AtSearchBar,AtNoticebar, AtList, AtListItem,  AtModal,AtModalHeader, AtModalContent,AtModalAction} from "taro-ui";
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
    return {
      path: 'pages/index/index'
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
    this.setState({
      law: getLawName(lawOptions[e.detail.value])
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
      {law === 'criminal' && <Picker mode='selector' range={criminalLawOptions} onChange={this.selectCriminalNumber}>
        <AtList>
          <AtListItem
            title='法条'
            extraText={getCriminalLawChnNumber(number)}
          />
        </AtList>
      </Picker>}
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
    this.setState({
      showLoading: true
    })
    const  { law, number, searchValue } = this.state;
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
              Taro.setClipboardData({
                data: `https://wenshu.court.gov.cn/website/wenshu/181107ANFZ0BXSK4/index.html?docId=${item.rowkey}`,
                success: function () {
                  Taro.showToast({
                    title: `裁判文书网链接已复制`,
                    icon: 'none',
                    duration: 2000
                  })
                }
              });
              return;
            }}
          />
        )
      })}
    </View>)
  }


  render () {
    const {isNewUser, isReadMode,
    userOpenId, userName, userAvatar, law, number, searchValue, showSetting, showLoading
    } = this.state;
    return (
      <View className={`index-page ${isReadMode ? 'read-mode' : ''}`}>
        {this.renderTagLine()}
        <AtNoticebar marquee speed={60}>
          本小程序数据信息均来源于裁判文书网，持续收录中...
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
          <AtModalAction><Button onClick={this.handleClose} >确定</Button> </AtModalAction>
        </AtModal>
        {!isNewUser && this.renderUserFloatButton()}
        {showLoading && <Loading2 />}
        <View onClick={this.handleOpen} className='float-setting'>
          <Image src={settingIcon} className='setting' mode='widthFix' />
        </View>
      </View>
    )
  }
}
