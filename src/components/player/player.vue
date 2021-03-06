<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="i-left">
              <i :class="iconMode" @click="changeMode" class="icon"></i>
            </div>
            <div class="i-left" :class="disableCls">
              <i class="icon-icon-3 icon" @click="prev"></i>
            </div>
            <div class="i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon" class="icon"></i>
            </div>
            <div class="i-right" :class="disableCls">
              <i class="icon icon-icon-2" @click="next"></i>
            </div>
            <div class="i-right">
              <i class="icon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="cd">
          <img :class="cdClass" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="playIcon" @click.stop="togglePlaying" class="icon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon icon-icon-"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"
           @ended="songEnd"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {getSongVkey} from 'api/singer'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'

  export default {
    name: 'player',
    components: {
      ProgressBar,
      ProgressCircle
    },
    data () {
      return {
        vkey: '',
        songReady: false,
        currentTime: 0,
        radius: 32
      }
    },
    computed: {
      playIcon () {
        return this.playing ? 'icon-icon-4' : 'icon-icon-9'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass () {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-icon-6' : this.mode === playMode.loop ? 'icon-icon-5' : 'icon-icon-8'
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    created () {
      this.touch = {}
    },
    watch: {
      currentSong: function (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          // 当前歌曲没有变化，不执行任何操作
          return
        }
        getSongVkey(this.currentSong.mid).then(res => {
          this.setCurrentUrl(res.req_0.data.midurlinfo[0].purl)
          this.$nextTick(() => {
            // 添加一个延时
            this.$refs.audio.play()
          })
          // selectPlay的时候设置playing为false，在这里设置为true，防止上一首歌点击暂停后选择另一首歌，会播放上一首歌一部分的情况
          this.setPlayingState(true)
        })
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
      },
      prev () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        this.songReady = false
      },
      next () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        this.songReady = false
      },
      ready () {
        this.songReady = true
        console.log('songReady:' + this.songReady)
      },
      error () {
        // 歌曲不能加载时，可点击下一首或者上一首
        this.songReady = true
        // 当前歌曲错误，跳转到下一首
        this.next()
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      format (interval) {
        // 将秒转换为 xx：xx的格式
        interval = interval | 0
        const minute = interval / 60 | 0
        // 如果当前秒是一个数字，则前面加0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      onProgressBarChange (percent) {
        // 改变currentTime
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        // 如果当前歌曲是暂停的，改变进度后，让它开始播放
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      changeMode () {
        const mode = (this.mode + 1) % 3
        // 设置当前的播放模式
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          // 如果当前播放模式是随机，就打乱sequenceList
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        // 为了保证改变模式时，不影响当前歌曲的播放，设置CurrentIndex为当前歌曲在list中的index
        this.resetCurrentIndex(list)
        // 设置当前playlist为list
        this.setPlaylist(list)
      },
      resetCurrentIndex (list) {
        // 找到当前歌曲的索引
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        // 设置
        this.setCurrentIndex(index)
      },
      songEnd () {
        //  一首歌播放结束触发事件
        if (this.mode === playMode.loop) {
          // 调用loop方法
          this.loop()
        } else {
          // 如果不是循环单曲，调用next方法，让currentIndex+1
          this.next()
        }
      },
      loop () {
        // 单曲循环时，直接设置currentTime为0，并开始播放
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setCurrentUrl: 'SET_CURRENT_URL',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST'
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  /* 添加touch-action，防止连续点击报错 */
  .icon-prev, .icon-next, .icon
    touch-action none

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 40
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.7
        filter: blur(5px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          line-height 40px
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 20%
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          > div
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 60
      width 100%
      height 60px
      background $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity 0
      .cd
        width 80px
        padding 0 10px 0 20px
        img
          border-radius: 50%
          width 40px
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        width: 32px
        height 32px
        margin: 0 10px
        position relative
        .icon-icon-4, .icon-icon-9, .icon-icon-
          font-size: 30px
          color: $color-theme-d
        .icon
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
