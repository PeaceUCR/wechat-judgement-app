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
          key={item.rowkey}
          title={item.title}
          arrow='right'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/exampleDetail/index?id=${item.rowkey}`
            })
          }}
        />
        ))}
    </View>

  </View>)
}

export default MyCollection;
