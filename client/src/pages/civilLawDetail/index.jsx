import Taro, { Component, setStorageSync, getStorageSync } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { AtDivider, AtActivityIndicator, AtTabs, AtTabsPane, AtListItem, AtIcon } from "taro-ui";
import DataPopup from '../../components/dataPopup/index.weapp'
import { db } from '../../util/db'
import {getNumber} from '../../util/convertNumber'
import './index.scss'

const getTermNumber = (text) => {
  return text.substring(0, text.indexOf('条') + 1);
}
export default class CivilLawDetail extends Component {

  state = {
    term: {},
    examples: [],
    isCollected: false,
    isReadMode: false,
    isLinkLoading: true,
    isExampleLinkLoading: true,
    links: [],
    exampleLinks: []
  }

  config = {
    navigationBarTitleText: '民法典条文详情'
  }

  onShareAppMessage() {
    return {
      path: 'pages/index/index'
    };
  }

  componentWillMount () {
    const { id } = this.$router.params;
    const that = this;
    db.collection('civil-law').where({_id: id}).get({
      success: (res) => {
        const term = res.data[0];
        that.setState({term});
        db.collection('civil-law-links').where({number: getNumber(term.number)}).get({
          success: (r) => {
            if (r.data && r.data.length > 0) {
              that.setState({links: JSON.parse(r.data[0].data) || [], isLinkLoading: false});
            }
            that.setState({isLinkLoading: false});
          }
        });

        db.collection('civil-law-link-examples').where({number: getNumber(term.number)}).get({
          success: (r) => {
            console.log(r)
            if (r.data && r.data.length > 0) {
              that.setState({exampleLinks: r.data[0].examples || [], isExampleLinkLoading: false});
            }
            that.setState({isExampleLinkLoading: false});
          }
        });
        //
        // db.collection('court-examples').where({criminalLaw: db.RegExp({
        //     regexp: '.*' + getTermNumber(term.text),
        //     options: 'i',
        //   })}).get({
        //   success: (res) => {
        //     that.setState({courtExamples: res.data, isCourtExampleLoading: false});
        //   }
        // });
        //
        // db.collection('explanation').where({criminalLaw: db.RegExp({
        //     regexp: '.*' + getTermNumber(term.text),
        //     options: 'i',
        //   })}).get({
        //   success: (res) => {
        //     that.setState({explanations: res.data, isExplanationLoading: false});
        //   }
        // });
        //
        // db.collection('complement').where({criminalLaw: db.RegExp({
        //     regexp: '.*' + getTermNumber(term.text),
        //     options: 'i',
        //   })}).get({
        //   success: (res) => {
        //
        //     if (res.data.length > 0) {
        //       const courtComplementExamples = res.data.filter(item => item.title.indexOf('案例') !== -1)
        //       if(courtComplementExamples.length > 0) {
        //         const complements = res.data.filter(item => item.title.indexOf('案例') === -1)
        //         that.setState({complements, courtComplementExamples, isComplementLoading: false});
        //
        //       } else {
        //         that.setState({complements: res.data, isComplementLoading: false});
        //       }
        //     } else {
        //       that.setState({isComplementLoading: false})
        //     }
        //
        //   }
        // })
      }
    })

    let civilCollection = getStorageSync('civilCollection');
    civilCollection = civilCollection ? civilCollection : {};
    that.setState({
      isCollected: civilCollection[id] === true
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

  renderExample = () => {
    const {examples, term} = this.state;
    const num = getTermNumber(term.text).replace('第', '').replace('条', '');
    return (<View>
      {examples.map(example => (<View className='example' key={`example-${example._id}`}>
        <DataPopup data={example} type='procuratorate' num={num} />
      </View>))}
    </View>)
  }

  renderCourtExample = () => {
    const {courtExamples, term} = this.state;
    const num = getTermNumber(term.text).replace('第', '').replace('条', '');
    return (<View>
      {courtExamples.map(example => (<View className='example' key={`court-example-${example._id}`}>
        <DataPopup data={example} type='court' num={num} />
      </View>))}
    </View>)
  }

  renderExplanation = () => {
    const {explanations, term} = this.state;
    const num = getTermNumber(term.text).replace('第', '').replace('条', '');
    return (<View>
      {explanations.map(explanation => (<View className='example' key={`explanation-${explanation._id}`}>
        <DataPopup data={explanation} type='explanation' num={num} />
      </View>))}
    </View>)
  }

  renderComplement = () => {
    const { complements, term } = this.state;
    const num = getTermNumber(term.text).replace('第', '').replace('条', '');
    return (<View>
      {complements.map(complement => (<View className='example' key={`complement-${complement._id}`}>
        <DataPopup data={complement} type='complement' num={num} />
      </View>))}
    </View>)
  }

  renderCourtComplementExamples = () => {
    const { courtComplementExamples, term } = this.state;
    const num = getTermNumber(term.text).replace('第', '').replace('条', '');
    return (<View>
      {courtComplementExamples.map(complement => (<View className='example' key={`complement-${complement._id}`}>
        <DataPopup data={complement} type='complement' num={num} />
      </View>))}
    </View>)
  }

  handleCollect = () => {
    const { isCollected, term } = this.state;
    const {_id} = term
    let collection = getStorageSync('civilCollection');
    collection = collection ? collection : {};
    if (isCollected) {
      delete collection[_id]
      setStorageSync('civilCollection', collection)
    } else {
      collection[_id] = true
      setStorageSync('civilCollection', collection)
    }
    Taro.showToast({
      title: isCollected ? '收藏取消' : '收藏成功',
      icon: 'none',
      duration: 1000
    })
    this.setState({isCollected : !isCollected})

  };

  renderTermText = () => {
    const {term} = this.state;
    term.text = term.text ? term.text : ''
    const lines = term.text.split('\n').filter(l => l.trim())
    return (lines.map((line, index) => {
      return (<View className='civil-term-line' key={`key-civil-${index}`}>{line}</View>)
    }))
  }

  handleClick = (value) => {
    this.setState({
      current: value
    })
  }
  render () {
    const {current, term, isLinkLoading, isExampleLinkLoading, links, exampleLinks, isCollected, isReadMode} = this.state;
    return (
      <View className={`civil-term-detail-page ${isReadMode ? 'read-mode' : ''}`}>
          <View className='main section'>
            <View className='tag-line'><Text className='pre-tag'>法条要旨:</Text><Text className='tag'>{term.tag}</Text></View>
            {this.renderTermText()}
          </View>
          {!isLinkLoading && links.length === 0 && <View className='center'>暂无</View>}
          <AtTabs
            current={current}
            scroll
            tabList={[
              { title: '关联法条' },
              { title: '关联案例' }
            ]}
            onClick={this.handleClick}
          >
            <AtTabsPane current={current} index={0}>
              <View className='pane'>
                {links.map((link, index) => {
                  return (<View className='link' key={`civil-key-${index}`}>
                    <View className='title'><RichText nodes={link.title}></RichText></View>
                    <RichText nodes={link.content}></RichText>
                    <AtDivider lineColor='#777' height='60' />
                  </View>)
                })}
                {links.length === 0 && !isLinkLoading && (<View>暂无</View>)}
              </View>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <View className='pane'>
                {exampleLinks.map((link, index) => {
                  return (<View key={`civil-example-key-${index}`} onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/exampleDetail/index?type=civil&id=${link.detailId}`,
                    })
                  }
                  }
                  >
                    <AtListItem title={link.subhead} note={link.title} arrow='right' />
                  </View>)
                })}
                {exampleLinks.length === 0 && !isExampleLinkLoading && (<View>暂无</View>)}
              </View>
            </AtTabsPane>
          </AtTabs>

          {
            isLinkLoading && isExampleLinkLoading && <AtActivityIndicator mode='center' color='black' content='数据加载中...' size={62}></AtActivityIndicator>
          }
        <View className='favorite-container' onClick={this.handleCollect} >
          <AtIcon value={isCollected ? 'star-2' : 'star'} size='32' color={isCollected ? '#ffcc00' : 'rgba(0, 0, 0, 0.6)'}></AtIcon>
        </View>
      </View>
    )
  }
}
