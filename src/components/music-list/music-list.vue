<template>
  <div class="music-list">
    <mt-header :title="title">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <scroll :data="songs" :mode="mode">
      <div class="bg-image" :style="bgStyle">
        <div class="filter"></div>
        <div class="play-wrapper">
          <div ref="playBtn" class="play" v-show="songs.length>0" @click="random">
            <i class="icon icon-icon-9"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
      </div>
      <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
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
  import {mapActions, mapGetters} from 'vuex'
  import {scrollMode} from 'common/js/config'

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: function () {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      mode () {
        return this.playlist.length > 0 ? scrollMode.detail : scrollMode.detailNo
      },
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      },
      ...mapGetters([
        'playlist'
      ])
    },
    components: {
      SongList,
      Scroll,
      Loading
    },
    methods: {
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random () {
        this.randomPlay({list: this.songs})
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    z-index 20
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .bg-image
      position relative
      width 100%
      height 260px
      background-size cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(0, 0, 0, 0.3)
      .play-wrapper
        position absolute
        bottom 20px
        z-index 30
        width 100%
        .play
          width 135px
          padding 7px 10px
          margin 0 auto
          display flex
          align-items center
          border 1px solid $color-theme
          color $color-theme
          border-radius 100px
          .text
            font-size: $font-size-small
            margin-left 10px

</style>
