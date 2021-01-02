import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {View, Text, Picker, Image} from '@tarojs/components'
import {AtSearchBar, AtActivityIndicator, AtListItem, AtLoadMore, AtBadge, AtIcon} from 'taro-ui'
import {isEmpty} from 'lodash';
import throttle from 'lodash/throttle';
import { db } from '../../util/db'
import clickIcon from '../../static/down.png';
import './index.scss'

export default class Index extends Component {

  state = {
    searchValue: '',
    searchResult: [],
    isLoading: false,
    selected: '全文搜索',
    options: ['全文搜索'],
    status: 'more',
    isReadMode: false
  }

  config = {
    navigationBarTitleText: '最高法公报案例搜索'
  }

  onShareAppMessage() {
    return {
      path: 'pages/index/index'
    };
  }
  componentWillMount () {
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

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  renderSearchList = () => {
    const {searchResult,searchValue} = this.state
    return (<View>
      <View>
        {searchResult.map(((example) => {return (
          <AtListItem
            key={`example-${example._id}`}
            title={`${example.title}`}
            note={example.date}
            arrow='right'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/exampleDetail/index?type=court-open&id=${example._id}&keyword=${searchValue}`,
              })
            }}
          />
          )}))}
      </View>
    </View>)
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  onSearch = (skip) => {
    skip = skip ? skip : 0;
    const that = this;
    this.setState({isLoading: true});
    const { searchValue, searchResult, selected } = this.state;
    if(!searchValue.trim()) {
      Taro.showToast({
        title: '搜索不能为空',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    if (selected === '全文搜索') {
      db.collection('court-open').orderBy('date', 'desc').skip(skip).where({text: db.RegExp({
          regexp: '.*' + searchValue,
          options: 'i',
        })}).get({
        success: (res) => {
          if (isEmpty(res.data)) {
            if (skip === 0) {
              Taro.showToast({
                title: `未找到含有${searchValue}的最高法公报`,
                icon: 'none',
                duration: 3000
              })
              that.setState({isLoading: false})
              return;
            } else {
              Taro.showToast({
                title: `没有更多啦`,
                icon: 'none',
                duration: 3000
              })
              that.setState({status: 'noMore', isLoading: false})
            }
          } else {
            if (skip === 0) {
              that.setState({searchResult: [...res.data], isLoading: false});
            } else {
              that.setState({searchResult: [...searchResult, ...res.data], isLoading: false});
            }
          }

        }
      });
    }

  }

  loadMore = () => {
    const {searchResult} = this.state
    this.onSearch(searchResult.length)
  }

  onClear = () => {
    this.setState({
      searchValue: '',
      searchResult: [],
    });
  }

  onSelect = (e) => {
    const {options} = this.state;
    this.setState({
      selected: options[e.detail.value],
      status: 'more',
      searchResult: []
    })
  }

  render () {
    const {searchValue, searchResult, isLoading, selected, options, status, isReadMode} = this.state;
    return (
      <View className={`example-page ${isReadMode ? 'read-mode' : ''}`}>
          <View className='header'>
            <View className='select'>
              <View>
                <Picker mode='selector' mode='selector' range={options} onChange={this.onSelect}>
                  <Text>{selected}</Text>
                </Picker>
              </View>
              <Image src={clickIcon} className='icon-click' />
            </View>
            <View className='search'>
              <AtSearchBar
                value={searchValue}
                onChange={this.onChange}
                onActionClick={() => this.onSearch(0)}
                onClear={this.onClear}
                placeholder={selected === '全文搜索' ? '案由，关键词' : ''}
              />
            </View>
          </View>
          <View>
            <View>
              {searchResult.length > 0 && this.renderSearchList()}
            </View>
            {searchResult && searchResult.length>0 && (<AtLoadMore
              onClick={
                throttle(this.loadMore, 2000, { trailing: false })
              }
              status={status}
            />)}
            {isLoading && <View className='loading-container'>
              <AtActivityIndicator mode='center' color='black' content='加载中...' size={62}></AtActivityIndicator>
            </View>}
            <View className='float-help' onClick={() => {
              Taro.navigateTo({
                url: '/pages/other/index?id=courtOpen'
              })
            }}
            >
              <AtBadge value='帮助'>
                <AtIcon value='help' size='30' color='#000'></AtIcon>
              </AtBadge>
            </View>
          </View>
      </View>
    )
  }
}
