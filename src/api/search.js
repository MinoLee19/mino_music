import {commonParams} from './config'
import axios from 'axios'

export function getHotKey () {
  var url = '/getHotKey'

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

export function keySearch (query, page, zhida, perpage) {
  var url = '/keySearch'

  const data = {
    p: page,
    w: query,
    catZhida: zhida ? 1 : 0,
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.song',
    t: 0,
    aggr: 1,
    cr: 1,
    lossless: 0,
    flag_qc: 0,
    n: perpage,
    g_tk: 1000691038,
    loginUin: 645564131,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })

}
