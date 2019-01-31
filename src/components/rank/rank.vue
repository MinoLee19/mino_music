<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="topList" :mode="mode">
      <ul v-show="topList.length>0">
        <li class="item" v-for="item of topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of item.songList">
              <span>{{index+1}}.</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getToplist} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  import {mapGetters} from 'vuex'
  import {scrollMode} from 'common/js/config'

  export default {
    data () {
      return {
        topList: []
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
      this._getToplist()
    },
    methods: {
      selectItem (item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getToplist () {
        getToplist().then(res => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    watch: {},
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    width: 100%
    .toplist
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
