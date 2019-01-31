<template>
  <div class="recommend" ref="recommend">
    <scroll :mode="mode">
      <div v-if="recmdSlider.length" class="recmd-slider">
        <mt-swipe :auto="3000">
          <mt-swipe-item v-for="(item,index) in recmdSlider" :key="index">
            <img :src="item.picUrl" class="swiper-img">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div v-if="discList.length" class="disc-list">
        <h1 class="disc-title">热门歌单推荐</h1>
        <ul>
          <li v-for="item in discList" class="disc-item" @click="selectDisc(item)" :data-dissid="item.dissid">
            <div class="disc-img">
              <img width="60" height="60" v-lazy="item.imgurl">
            </div>
            <div class="disc-text">
              <h2 class="name" v-html="item.dissname"></h2>
              <p class="desc">
                <span v-html="item.creator.name"></span>
                <span>播放量:{{item.listennum | numFormat}} </span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="!discList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getRecommend, getDiscList} from 'api/recommend'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapMutations, mapGetters} from 'vuex'
  import {scrollMode} from 'common/js/config'

  export default {
    data () {
      return {
        recmdSlider: [],
        discList: []
      }
    },
    computed: {
      mode () {
        return this.playlist.length > 0 ? scrollMode.miniPlay : scrollMode.fullScreen
      },
      ...mapGetters([
        'playlist'
      ])
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      selectDisc (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recmdSlider = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Scroll: Scroll,
      Loading: Loading
    },
    filters: {
      numFormat (value) {
        if (value >= 10000) {
          return Math.round(value / 1000) / 10 + '万'
        } else if (value >= 1000) {
          return Math.round(value / 100) / 10 + '千'
        } else {
          return value
        }
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recmd-slider
    height 170px

  .swiper-img
    width 100%
    height 100%

  .disc-list
    .disc-title
      height 65px
      line-height 65px
      text-align center
      font-size $font-size-medium
      color $color-theme
    ul
      .disc-item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .disc-img
          width 60px
          padding-right 20px
        .disc-text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow: hidden
          font-size $font-size-medium
          .name
            margin-bottom: 10px
            color $color-text
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
          .desc
            color $color-text-d
            display flex
            justify-content space-between
            span
              width 50%
              white-space nowrap
              text-overflow ellipsis
              overflow hidden

  .loading-container
    position absolute
    width 100%
    top: 50%
    transform translateY(-50%)
</style>
<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"

  .mint-swipe-indicator
    background $color-sub-theme
    opacity 0.8

  .mint-swipe-indicator.is-active
    background $color-theme
    width 16px
    height 8px
    border-radius 8px
</style>
