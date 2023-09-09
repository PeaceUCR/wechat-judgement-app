import Taro, { setStorageSync }  from '@tarojs/taro'
import { BASE_REQUEST_URL } from './consult'

export const searchJudgments = async (searchValue, cause, tags) => {
  const params = {
    url: `${BASE_REQUEST_URL}/api/judgment/list`,
    method: 'POST',
    data: {
      searchValue,
      cause,
      tags
    }
  }

  const res = await Taro.request(params);
  if (res.statusCode > 399) {
    Taro.showToast({
      title: '搜索失败！',
      icon: 'none',
      duration: 3000
    })
    throw 'error'
  }
  const { data } = res;
  return data;
}

export const getJudgmentByRowKey = async (rowKey) => {
  const params = {
    url: `${BASE_REQUEST_URL}/api/judgment/${rowKey}`,
    method: 'GET',
  }

  const res = await Taro.request(params);
  if (res.statusCode > 399) {
    Taro.showToast({
      title: '搜索失败！',
      icon: 'none',
      duration: 3000
    })
    throw 'error'
  }
  const { data } = res;
  return data;
}

export const getJudgmentDetailByRowKey = async (rowKey) => {
  const params = {
    url: `${BASE_REQUEST_URL}/api/judgment-detail/${rowKey}`,
    method: 'GET',
  }

  const res = await Taro.request(params);
  if (res.statusCode > 399) {
    Taro.showToast({
      title: '搜索失败！',
      icon: 'none',
      duration: 3000
    })
    throw 'error'
  }
  const { data } = res;
  return data;
}


export const searchCivilSimilarCases = async (cause) => {
  const params = {
    url: `${BASE_REQUEST_URL}/api/civil-similar-case?casecause=${cause}`,
    method: 'GET'
  }

  const res = await Taro.request(params);
  if (res.statusCode > 399) {
    Taro.showToast({
      title: '搜索失败！',
      icon: 'none',
      duration: 3000
    })
    throw 'error'
  }
  const { data } = res;
  return data;
}

export const getCivilSimilarCaseById = async (uniqid) => {
  const params = {
    url: `${BASE_REQUEST_URL}/api/civil-similar-case/${uniqid}`,
    method: 'GET',
  }

  const res = await Taro.request(params);
  if (res.statusCode > 399) {
    Taro.showToast({
      title: '搜索失败！',
      icon: 'none',
      duration: 3000
    })
    throw 'error'
  }
  const { data } = res;
  return data;
}
