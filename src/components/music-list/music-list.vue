<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div ref="playBtn" class="play" v-show="songs.length>0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <scroll :data="songs"
            :listen-scroll="listenScroll"
            :mode="scrollMode"
            :height="scrollHeight"
            class="list"
            ref="list"
            @scroll="scroll">
      <song-list :songs="songs"></song-list>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    created () {
      this.listenScroll = true
      this.scrollMode = false
      this.scrollHeight = document.documentElement.clientHeight - RESERVED_HEIGHT || document.body.clientHeight - RESERVED_HEIGHT
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    },
    methods: {
      scroll (val) {
        if (val < 260 - RESERVED_HEIGHT) {
          this.$refs.list.$el.style[transform] = `translateY(${-val}px)`
        }
      },
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 260px
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)

  .list
    position fixed
    top 260px
    background-color $color-background
    z-index 100

  .loading-container
    position: absolute
    width: 100%
    top: 30%
    transform: translateY(-50%)
</style>