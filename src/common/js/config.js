export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export const scrollMode = {
  // 没有mini播放器时，高度为总高度-90（header+tab）
  fullScreen: 0,
  // 有mini播放器时，高度为总高度-150（header+tab+miniplayer）
  miniPlay: 1,
  // 指定高度
  assign: 2,
  // singerDetail 没有mini播放器
  detailNo: 3,
  detail: 4,
  // 搜索页面，有、无miniplayer
  searchNo: 5,
  search: 6
}
