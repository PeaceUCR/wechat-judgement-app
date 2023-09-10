import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View,Input, Button, RichText, Text} from '@tarojs/components'
import {AtFab, AtIcon, AtActivityIndicator, AtNoticebar, AtButton, AtBadge} from "taro-ui";
import './index.scss'
import {copy, findAndHighlight, highlights, isStartWith, refine} from "../../util/util";
import {getConsultById} from "../../util/consult";

const typeCollectionMap = {
  'court': 'example',
  'procuratorate': 'example',
  'court-open':'example',
  'consultant': 'consult',
  'civilLawExample': 'civil-law-link-example-detail',
  'civil-law-explaination': 'civil-law-explaination',
  'source': 'sentencingDetail-source',
  'complement-example': 'complement'
}

const demoSet = new Set(Object.keys(typeCollectionMap))

export default class ExampleDetail extends Component {

  foundKey = undefined
  state = {
    comment: '',
    isSent: false,
    id: '',
    type: '',
    example: {},
    keyword: '',
    zoomIn: false,
    isCollected: false,
    isReadMode: true,
    isLoading: true,
    enableAutoScroll: false,
    enableExampleDetailAd: false,
    selectedLine: -1,
    categories: undefined,
    openCategory: false
  }

  config = {
    navigationBarTitleText: '详情'
  }

  componentWillMount () {
    const that = this;
    const { id, type, keyword } = this.$router.params;
    console.log('id', id)
    if (type.includes('consult')) {
      getConsultById(id).then((res) => {
        that.setState({example: res, isLoading: false, type, id, keyword})
      })
    }

    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F4ECD8'
    });
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

  handleZoom = () => {
    const {zoomIn} = this.state;
    this.setState({zoomIn: !zoomIn})
  }

  renderNoData = () => {
    const {type} = this.state
    return (<View>
      {type !== 'local-law-detail' && <View>
        <View className='no-data'>出错啦!</View>
        <View className='no-data'>数据不存在或者已经迁移</View>
        <View className='no-data'>麻烦重新搜索进入</View>
      </View>}
      {type === 'local-law-detail' && <View>
        <View className='no-data'>数据还在收录中</View>
        <View className='no-data'>敬请期待</View>
      </View>}
    </View>)
  }

  resetSelectedLine = () => {
    this.setState({
      selectedLine: -1
    })
  }

  renderComplement = () => {
    const {example, keyword, zoomIn, selectedLine, enableAutoScroll, categories} = this.state;
    const {text, title, categoryList} = example;
    const that = this
    const setKey = (line, key) => {
      if (line && key) {
        const regExp = new RegExp(key,"g");
        const ifFound = regExp.test(line)
        if (ifFound) {
          this.foundKey = 'foundKey1'
          return 'foundKey1'
        }
      }
      return ''
    }
    if (selectedLine === -1 && enableAutoScroll) {
      setTimeout(() => {
        console.log('that.foundKey:', that.foundKey)
        if (that.foundKey) {
          Taro.pageScrollTo({
            selector: `#${that.foundKey}`,
            duration: 500
          })
        }
      }, 600)
    } else {
      console.log('detect copy')
    }

    const lines = text ? text.split('\n').filter(line => line.trim() && line.trim().length > 0).map(line => refine(line)) : []

    let c;
    if (categoryList && categoryList.length > 0) {
      c = categoryList
      if (!categories) {
        that.setState({
          categories: categoryList
        })
      }
    } else {
      c = categories
      if (!categories && text) {
        c = Array.from(new Set(lines.filter(l => isStartWith(l, highlights))))
        that.setState({
          categories: c
        })
      }
    }


    return (<View  className={`text-section ${zoomIn ? 'zoom-in' : ''}`}>
      <View className='term-complement-title'>{title}</View>
      <ad unit-id="adunit-0320f67c0e860e36"></ad>
      {categoryList && categoryList.length > 0 && this.renderStaticCategory()}
      <View className='content'>{lines.map((line, index) => {
        return (<View id={setKey(line, keyword)}
                      className={`line ${index === selectedLine ? 'show-copy' : ''}`}
                      key={`text-example-detail-${index}`}
        >
          {isStartWith(line, c) && c && <View id={`category-${c.indexOf(line)}`}></View>}
          <RichText nodes={findAndHighlight(line, index, keyword)} className={isStartWith(line, c) ? 'highlight': ''} ></RichText>
          {index === selectedLine && <View className='copy'>
            <AtButton size='small' type='primary' onClick={() => {
              copy(line, this.resetSelectedLine)
          }}>复制</AtButton>
            <Button className='copy-cancel' onClick={() => this.resetSelectedLine()}>取消</Button>
          </View>}
        </View>)
      })}</View>
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

  renderStaticCategory = () => {
    const {example} = this.state
    const {categoryList} = example
    return (<View className='static-category'>
      {categoryList.map((c, index) => (<View
        className='static-category-item'
        key={c}
        onClick={() => {
          console.log(`click ${index}`)
          Taro.pageScrollTo({
            selector: `#category-${index}`,
            duration: 500
          })
        }}
      >{`${c}`}</View>))}
    </View>)
  }
  render () {
    const {isSent, keyword, comment, example, zoomIn, isCollected, isReadMode, isLoading, type, enableAutoScroll, enableExampleDetailAd, categories, openCategory} = this.state;
    const {special, text, title, categoryList} = example
    return (
      <View>
        {
          (type === 'consultant' || type === 'consult') &&
          <AtNoticebar marquee speed={60}>
            刑事审判参考仅限用于学习交流!
          </AtNoticebar>
        }
        <View className={`example-detail-page page read-mode ${zoomIn ? 'zoom-in' : ''}`}>
          {categories && categories.length > 0 && openCategory && this.renderCategory()}
          {!special && <View>
            {this.renderComplement()}
            {/*{!enableAutoScroll && this.renderExample()}*/}
          </View>}
          {categories && categories.length > 0 && <AtFab onClick={() => this.setState({openCategory: !openCategory})} size='small' className='float-category-icon'>
            <Text className={`at-fab__icon at-icon ${openCategory ? 'at-icon-close' : 'at-icon-menu'}`}></Text>
          </AtFab>}
          {!isLoading && !title && !text && this.renderNoData()}
          <View className='footer'>
            <AtFab size='small' className='float-zoom' onClick={() => {this.handleZoom()}}>
              <View  className={`zoom ${zoomIn ? 'zoom-in': 'zoom-out'}`} mode='widthFix' />
            </AtFab>
            <View className='share-container'>
              <AtBadge value='分享'>
                <Button className='share-button' openType='share'>
                  <AtIcon value='share-2' size='32' color='#6190E8'></AtIcon>
                </Button>
              </AtBadge>
            </View>
          </View>
          {isLoading && <View className='loading-container'>
            <AtActivityIndicator mode='center' color='black' content='加载中...' size={62}></AtActivityIndicator>
          </View>}
        </View>
      </View>
    )
  }
}
