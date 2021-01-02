import Taro, { Component, getStorageSync } from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import { AtSearchBar, AtActivityIndicator } from 'taro-ui'
import {isEmpty} from "lodash";
import { db } from '../../util/db'
import { LitigationSearchItem } from '../../components/litigationSearchItem/index.weapp'
import { HierarchicalOptions } from '../../components/hierarchicalOptions/index.weapp'
import {convertNumberToChinese} from '../../util/convertNumber'
import './index.scss'
import {processLitigationOptions} from '../../util/util';

export default class Index extends Component {

  state = {
    searchValue: '',
    searchResult: [],
    isLoading: false,
    litigationRegulationChapters: [],
    litigationRegulationSections: [],
    modalContent: '',
    isOpened: false,
    isReadMode: false
  }

  config = {
    navigationBarTitleText: '刑事诉讼规则搜索'
  }

  onShareAppMessage() {
    return {
      path: 'pages/index/index'
    };
  }
  componentWillMount () {
  }

  componentDidMount () {
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

  componentWillUnmount () { }

  componentDidShow () {
    const that = this;
    that.setState({isLoading: true});
    db.collection('configuration').where({}).get({
      success: (res) => {
        that.setState({
          litigationRegulationChapters: res.data[0].litigationRegulationChapters,
          litigationRegulationSections: res.data[0].litigationRegulationSections,
          isLoading: false});
      }
    });
  }

  componentDidHide () { }

  renderSearchList = () => {
    const {searchResult,isReadMode} = this.state
    return (<View>
      {searchResult.map(((data) => {return (<LitigationSearchItem isReadMode={isReadMode} data={data} key={`term-${data._id}`} onSearchResultClick={this.onSearchResultClick} />)}))}
    </View>)
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  handleDBSearchSuccess = (res) => {
    const { searchValue } = this.state;
    if (isEmpty(res.data)) {
      Taro.showToast({
        title: `未找到含有${searchValue}的刑事诉讼法`,
        icon: 'none',
        duration: 3000
      })
      this.setState({isLoading: false});
      return ;
    }

    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setState({searchResult: res.data, isLoading: false});
  }

  onSearch = () => {
    const that = this;
    this.setState({isLoading: true});
    const { searchValue} = this.state;
    if(!searchValue.trim()) {
      Taro.showToast({
        title: '搜索不能为空',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    db.collection('litigation-regulation').where({content: db.RegExp({
        regexp: '.*' + convertNumberToChinese(searchValue),
        options: 'i',
      })}).get({
      success: that.handleDBSearchSuccess
    });
  }

  onSearchByChapter = () => {
    const that = this;
    this.setState({isLoading: true});
    const { searchValue } = this.state;
    if(!searchValue.trim()) {
      Taro.showToast({
        title: '搜索不能为空',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    db.collection('litigation-regulation').where({chapter: db.RegExp({
        regexp: '.*' + searchValue,
        options: 'i',
      })}).get({
      success: that.handleDBSearchSuccess
    });
  }

  onSearchBySection = () => {
    const that = this;
    this.setState({isLoading: true});
    const { searchValue } = this.state;
    if(!searchValue.trim()) {
      Taro.showToast({
        title: '搜索不能为空',
        icon: 'none',
        duration: 2000
      })
      return ;
    }
    db.collection('litigation-regulation').where({section: db.RegExp({
        regexp: '.*' + searchValue,
        options: 'i',
      })}).get({
      success: that.handleDBSearchSuccess
    });
  }

  onClear = () => {
    this.setState({
      searchValue: '',
      searchResult: []
    });
  }

  onClickOptionItem = (category, searchValue) => {
    this.setState({
      searchValue
    }, () => {
      if (category === "chapter") {
        this.onSearchByChapter();
      } else {
        this.onSearchBySection();
      }
    });
  }

  renderOptions = () => {
    const {litigationRegulationChapters, litigationRegulationSections} = this.state;
    const that = this;
    return (<View className='options'>
      <View className='sub-options'>{litigationRegulationChapters && litigationRegulationChapters.length > 0 &&
      litigationRegulationChapters.map((c, index) => {
        return (<View className='crime-option option' key={`crime-option-${index}`} onClick={() => that.onClickOptionItem("chapter", c)}>
          {c}
        </View>)})}</View>
      <View className='sub-options'>{litigationRegulationSections && litigationRegulationSections.length >0 &&
      litigationRegulationSections.map((s, index) => {
        return (<View className='term-option option' key={`term-option-${index}`} onClick={() => that.onClickOptionItem("section", s)}>
          {s}
        </View>)})}</View>
    </View>)
  }

  onSearchResultClick = (content) => {
    const that = this;
    that.setState({
      isOpened: true,
      modalContent: content
    });
  }

  onModalClose = () => {
    this.setState({
      isOpened: false,
      modalContent: ''
    });
  }

  render () {
    const {searchValue, searchResult, isLoading, litigationRegulationChapters, litigationRegulationSections, modalContent, isOpened, isReadMode} = this.state;
    return (
      <View className={`litigation-regulation-page ${isReadMode ? 'read-mode' : ''}`}>
          <View>
            <AtSearchBar
              value={searchValue}
              onChange={this.onChange}
              onActionClick={this.onSearch}
              onClear={this.onClear}
              placeholder='搜索刑事诉讼规则'
            />
          </View>
          <View>
            <View>
              {/*{searchResult.length === 0 && this.renderOptions()}*/}
              {searchResult.length === 0 &&
              <HierarchicalOptions isReadMode={isReadMode} options={processLitigationOptions(litigationRegulationChapters, litigationRegulationSections)} onClick={this.onClickOptionItem} />}
            </View>
            <View>
              {searchResult.length > 0 && this.renderSearchList()}
            </View>
            {isLoading && <View className='loading-container'>
              <AtActivityIndicator mode='center' color='black' size={82}></AtActivityIndicator>
            </View>}
          </View>
        {isOpened && <View className={`modal ${isReadMode ? 'read-mode' : ''}`}>
          <View className='modal-content'>{modalContent.join('\n')}</View>
          <Button onClick={this.onModalClose} className='modal-button'>确定</Button>
        </View>}
      </View>
    )
  }
}
