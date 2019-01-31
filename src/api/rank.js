import {commonParams} from '../api/config'
import axios from 'axios'

export function getToplist () {
  var url = '/getToplist'
  const data = Object.assign({}, commonParams, {
    uni: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getTopMusicList (id) {
  var url = '/getTopMusicList'
  const data = Object.assign({}, commonParams, {
    uni: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
