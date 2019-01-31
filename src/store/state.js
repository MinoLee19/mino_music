import {playMode} from '../common/js/config'

const state = {
  singer: {},
  playing: false,  //正在播放
  fullScreen: false,
  // 顺序播放时，playList和sequenceList一致，其余时不一致
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  // 当前播放的歌曲
  currentIndex: -1,
  disc: {},
  topList: {}
}

export default state
