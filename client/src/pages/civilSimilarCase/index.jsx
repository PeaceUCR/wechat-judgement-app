import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View, Text, Picker, Image} from '@tarojs/components'
import {AtSearchBar, AtListItem, AtBadge, AtButton, AtNoticebar, AtFab, AtIndexes, AtTag} from 'taro-ui'
import Loading2 from "../../components/loading2/index.weapp";
import './index.scss'
import throttle from "lodash/throttle";
import flatten from "lodash/flatten";
import {getConsultCategory, getConsultsByKeyword, getConsultsByNumber} from "../../util/consult";
import {leiAnJianSuoData} from "../../util/data";
import {searchCivilSimilarCases} from "../../util/judgment";
import DataJson from "../../util/civil-similar-case-count.json"

const countMap = {};
DataJson.forEach(d => {
  countMap[d.casecause] = d.count;
})

const topCategoryList = leiAnJianSuoData.map(d => d.name);
const getSubCategoryList = (top) => {
  return flatten(leiAnJianSuoData.filter(d => d.name === top).map(d => d.children)).filter(c => countMap[c] > 0);
}


export default class Index extends Component {

  state = {
    searchValue: '',
    searchResult: [],
    isLoading: false,
    selected: '搜全文',
    options: ['搜全文', '搜案例号'],
    isReadMode: false,
    categoryList: [],
    type: 'most-recent',
    // new
    topCategory: '',
    secondCategory: '',
  }

  config = {
    navigationBarTitleText: '民事类案检索'
  }

  onShareAppMessage() {
    const {categoryList} = this.state
    return {
      path: `pages/civilSimilarCase/index`
    };
  }

  componentWillMount () {
    const {isCategory} = this.$router.params;
    if (isCategory === 'true') {
      this.loadCategory()
    }

    const setting = getStorageSync('setting');
    this.setState({isReadMode: setting && setting.isReadMode})
    if (setting && setting.isReadMode) {
      console.log('read')
    }
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F4ECD8'
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  loadCategory = throttle(() => {
    console.log('load')
    this.setState({
      isLoading: true
    })
    const that = this;
    getConsultCategory().then(result => {
      let {categoryList} = result
      categoryList.forEach(c => c.title = `第${c.key}辑 ${c.title ? c.title:''}`)

      if (that.state.type === 'most-recent') {
        categoryList = categoryList.slice(0, categoryList.length - 2);
      }

      that.setState({
        categoryList,
        isLoading: false
      })
    })
  }, 6000, { trailing: false })

  loadAll = () => {
    this.setState({type: ''},() => {
      this.loadCategory()
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    })
  }
  renderCategoryList = () => {
    const {categoryList, type} = this.state
    return (<View style='height:100vh'>
      <AtIndexes
        list={categoryList}
        onScrollIntoView={fn => { this.scrollIntoView = fn }}
        onClick={(item) => {
          Taro.navigateTo({
            url: `/pages/exampleDetail/index?type=consultant&id=${item._id}`,
          })
        }}
      >
        <View className='category-divider'>刑事审判参考全目录</View>
      </AtIndexes>
      {type === 'most-recent' && <AtButton type='primary' onClick={() => this.loadAll()}>加载更多</AtButton>}
    </View>)
  }

  renderSearchList = () => {
    const {searchResult} = this.state
    return (<View>
      <View>
        {searchResult.map(((example) => {return (
          <View className='result-item' key={`example-${example.uniqid}`}>
            <AtListItem
              title={`${example.judgeyear ? '[' + example.judgeyear + ']' : ''}${example.referencetype !== '其他案例' ? '[' + example.referencetype + ']' : ''}${example.itemTitle}`}
              note={example.title}
              arrow='right'
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/civilSimilarCaseDetail/index?id=${example.uniqid}`,
                })
              }}
            />
          </View>
          )}))}
      </View>
    </View>)
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  onClear = () => {
    this.setState({
      searchValue: '',
      searchResult: [],
    });
  }

  onSelectSecondCategory = (c) => {
    const that = this;
    this.setState({secondCategory: c, isLoading: true});
    searchCivilSimilarCases(c).then(responses => {
      console.log(responses);
      responses.sort(
        (a, b) => {
          const va = (!a.judgeyear) ? "" : "" + a.judgeyear,
            vb = (!b.judgeyear) ? "" : "" + b.judgeyear;

          return vb.localeCompare(va);
        }
      );
      responses.forEach(r => {
        if (r.paragraphs) {
          const paragraphs = JSON.parse(r.paragraphs);
          const p = paragraphs.find(p => p.tag === '案例标题');
          if (p) {
            r.itemTitle = p.content;
          }
        }
      });
      that.setState({searchResult: responses});
    }).finally(() => that.setState({secondCategory: c, isLoading: false}));
  }

  renderTopCategory = () => {
    const that = this;
    return topCategoryList.map(c =>
      <View className='top-category-item' key={c} onClick={() => that.setState({topCategory: c})}>{c}</View>
    )
  }
  renderSecondCategory = () => {
    const {topCategory} = this.state;
    const that = this;
    return getSubCategoryList(topCategory).map(c => <View
      className='category-item'
      key={c}
      onClick={() => {
        that.onSelectSecondCategory(c);
      }}
    >{c}
      <Text className='link-text'>{countMap[c]}</Text>
    </View>)
  }

  cancelSecondCategory = () => {
    this.setState({secondCategory: '', searchResult: []})
  }
  cancelTopCategory = () => {
    this.setState({topCategory: '',secondCategory: '', searchResult: []})
  }

  render () {
    const {searchValue, searchResult, isLoading, selected, options, categoryList, topCategory, secondCategory} = this.state;
    return (
      <View className={'example-page page read-mode'}>
        <View>
            {topCategory && <View className='line'>
              <View className='at-article__h1 no-margin'>{topCategory}</View>
              <Text className='link-text' onClick={this.cancelTopCategory}>返回</Text>
            </View>}
            {secondCategory && <View className='line'>
              <View className='at-article__h2 no-margin'>{secondCategory}</View>
              <Text className='link-text' onClick={this.cancelSecondCategory}>返回</Text>
            </View>}
            <View className='category-list'>
              {!topCategory && this.renderTopCategory()}
              {topCategory && !secondCategory && this.renderSecondCategory()}
            </View>
            <View>
              {searchResult.length > 0 && this.renderSearchList()}
            </View>
            {isLoading && <Loading2 />}
          </View>
        <ad unit-id="adunit-0320f67c0e860e36"></ad>
      </View>
    )
  }
}
