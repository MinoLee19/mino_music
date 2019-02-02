import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 寻找当前歌曲在randomList中的index
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, false)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  // 总体思路:将新歌插入到当前播放,再判断之前播放列表中有无这首歌,如果有,删除这首歌的旧歌
  // playlist为副本
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  //查找当前列表中是否有待插入的歌曲
  let fpIndex = findIndex(playlist, song)
  // 当前索引加一（插入歌曲）
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果有这首歌
  if (fpIndex > -1) {
    //  删除这首歌
    if (currentIndex > fpIndex) {
      // 如果新歌插入序号大于旧歌在列表中的序号(在后面插入，旧歌序号不会有改变，但删除旧歌后，新歌的序号需要减一)
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 新歌插入的序号小于旧歌的序号(在前面插入,旧歌的序号需要加一,旧歌删除后,不影响新歌的序号)
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 修改sequenceList
  let currentSongIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSongIndex, 0, song)
  if (fsIndex > -1) {
    //  删除这首歌
    if (currentSongIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, false)
}
