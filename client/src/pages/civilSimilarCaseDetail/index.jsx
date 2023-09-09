import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View, Button, Image, Text} from '@tarojs/components'
import {AtIcon, AtBadge, AtDivider, AtModal,AtModalHeader, AtModalContent,AtModalAction, AtFab} from "taro-ui";
import { db } from '../../util/db'
import TextSectionComponent from '../../components/textSectionComponent/index'

import './index.scss'
import {checkIfNewUser, redirectToIndexIfNewUser} from "../../util/login";
import get from "lodash/get";
import {convertNumberToChinese} from "../../util/convertNumber"
import Loading2 from "../../components/loading2/index.weapp";
import {getCivilSimilarCaseById} from "../../util/judgment";

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
    showRelatedLaw: false,
    categories: ['要旨', '全文', '法院评论'],
    openCategory: false
  }

  config = {
    navigationBarTitleText: '民事类案详情'
  }

  componentWillMount () {
    const that = this;
    let { id } = this.$router.params;

    getCivilSimilarCaseById(id).then(r => {
      if (r && r.paragraphs) {
        const paragraphs = JSON.parse(r.paragraphs);
        const title = get(paragraphs.find(p => p.tag === '案例标题'), ['content'], '');
        const gist = get(paragraphs.find(p => p.tag === '案例要旨'), ['content'], '');
        const gistTitle = get(paragraphs.find(p => p.tag === '案例要旨标题'), ['content'], '');
        const author = get(paragraphs.find(p => p.tag === '案例撰稿人'), ['content'], '');
        const text = get(paragraphs.find(p => p.tag === '全文'), ['content'], '');
        const comment = get(paragraphs.find(p => p.tag === '法院评论'), ['content'], '');
        that.setState({example: {
            title,
            gist,
            author,
            text,
            comment
          }, id})
      };
    }).finally(() => that.setState({isExampleLoading: false}));

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
    const {id} = this.state;
    return {
      path: `/pages/civilSimilarCaseDetail/index?id=${id}`
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  renderExample = () => {
    const {example, keyword, zoomIn} = this.state;
    const {
      title,
      gist,
      author,
      text,
      comment
    } = example;
    return (<View>
      <TextSectionComponent data={title} keyword={keyword} zoomIn={zoomIn} isTitle />
      <View id='category-0' className='term-complement-title sub'>要旨</View>
      <TextSectionComponent data={gist} keyword={keyword} zoomIn={zoomIn} />
      <View id='category-1' className='term-complement-title sub'>全文</View>
      <TextSectionComponent data={text} keyword={keyword} zoomIn={zoomIn} />
      <TextSectionComponent data={author} keyword={keyword} zoomIn={zoomIn} />
      <View id='category-2' className='term-complement-title sub'>法院评论</View>
      <TextSectionComponent data={comment} keyword={keyword} zoomIn={zoomIn} />
    </View>)
  }

  handleZoom = () => {
    const {zoomIn} = this.state;
    this.setState({zoomIn: !zoomIn})
  }


  renderNoData = () => {
    return (<View>
      <View className='no-data'>出错啦!</View>
      <View className='no-data'>详情还在收录中,敬请期待!</View>
    </View>)
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
        >
          {/*<Text>民法典</Text>*/}
          <Text className='link-text'>{`民法典 ${convertNumberToChinese(parseInt(law))}`}</Text>
        </View>
      ))}
    </View>)
  }

  renderCategory = () => {
    const {categories} = this.state
    return (<View className='float-category'>
      {categories.map((c, index) => (<View
        className='float-category-item'
        key={c}
        onClick={() => {
          console.log(`click ${c}`)
          Taro.pageScrollTo({
            selector: `#category-${index}`,
            duration: 500
          })
        }}
      >{`${c}`}</View>))}
    </View>)
  }

  render () {
    const { example, brief, zoomIn, isReadMode, isBriefLoading, isExampleLoading,
      isLoading, isCollected, type, showRelatedLaw, categories, openCategory} = this.state;
    return (<View>
        <View className={`example-detail-page page ${zoomIn ? 'zoom-in' : ''} ${isReadMode ? 'read-mode' : ''}`}>
          <View>
            {!isExampleLoading && example && this.renderExample()}
          </View>
          {(!isExampleLoading && !example) && this.renderNoData()}
          {isExampleLoading && <Loading2 />}
          {/*<ad unit-id='adunit-33f2aac1c663b205' ad-type='video' ad-theme='white'></ad>*/}
          {/*{this.renderLink()}*/}
          {/*{!isExampleLoading && !isBriefLoading && <AtDivider content='没有更多了' fontColor='#666' lineColor='transparent' />}*/}

          {categories && categories.length > 0 && openCategory && this.renderCategory()}
          <AtFab onClick={() => this.setState({openCategory: !openCategory})} size='small' className='float-category-icon'>
            <Text className={`at-fab__icon at-icon ${openCategory ? 'at-icon-close' : 'at-icon-menu'}`}></Text>
          </AtFab>
          <View className='back-to-top' onClick={() => {
            Taro.pageScrollTo({
              scrollTop: 0,
              duration: 500
            })
          }}
          >
            <AtIcon value='chevron-up' size='50' color='rgba(26, 117, 255, 0.6)'></AtIcon>
          </View>

          {/*<View className='favorite-container' onClick={this.handleCollect} >*/}
          {/*  <AtIcon value={isCollected ? 'heart-2' : 'heart'} size='32' color={isCollected ? '#e62e00' : 'rgba(0, 0, 0, 0.6)'}></AtIcon>*/}
          {/*</View>*/}

          <View className='share-container'>
            <AtBadge value='分享'>
              <Button className='share-button' openType='share'>
                <AtIcon value='share-2' size='32' color='#6190E8'></AtIcon>
              </Button>
            </AtBadge>
          </View>

          {/*{type === 'civil' && brief && brief.civilLaws && brief.civilLaws.length > 0 && <View className='float-help' onClick={this.openRelatedLaw}>*/}
          {/*  <AtBadge value='相关法条'>*/}
          {/*    <Image*/}
          {/*      src={lawIcon}*/}
          {/*      className='law-icon'*/}
          {/*      mode='widthFix'*/}
          {/*    />*/}
          {/*  </AtBadge>*/}
          {/*</View>}*/}

          {/*{type === 'criminal' && <View className='float-help' onClick={this.openRelatedLaw}>*/}
          {/*  <AtBadge value='相关法条'>*/}
          {/*    <Image*/}
          {/*      src={lawIcon}*/}
          {/*      className='law-icon'*/}
          {/*      mode='widthFix'*/}
          {/*    />*/}
          {/*  </AtBadge>*/}
          {/*</View>}*/}

          <AtModal isOpened={showRelatedLaw} closeOnClickOverlay={false}>
            <AtModalHeader>相关法条</AtModalHeader>
            <AtModalContent>
              {/*{type === 'criminal' && brief && brief.criminalLaw && this.renderRelatedLaw()}*/}
              {/*{type === 'civil' && brief && brief.civilLaws && brief.civilLaws.length > 0 && this.renderRelatedCivilLaw()}*/}
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
