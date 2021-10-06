import Taro from '@tarojs/taro'
import { AtListItem} from "taro-ui";
import {View} from "@tarojs/components";


import './index.scss'

const MyCollection = (props) => {
  let {collection} = props;
  collection = collection ? collection : []

  return (<View className='my-collection' >
    <View>
      {collection.map(item => (
        <AtListItem
          key={item.rowKey}
          title={item.title}
          arrow='right'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/exampleDetail/index?id=${item.rowKey}&type=${item.type}`
            })
          }}
        />
        ))}
    </View>

  </View>)
}

export default MyCollection;
