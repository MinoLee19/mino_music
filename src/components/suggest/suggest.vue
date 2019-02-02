<template>
  <scroll class="suggest" :mode="mode">
    <ul class="suggest-list" ref="suggest">
      <li ref="title" class="suggest-item name">搜索结果:</li>
      <li class="suggest-item" v-for="item of result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <span class="loadmore" @click="loadmore" v-show="hasMore">点击加载更多</span>
    <span class="loadmore" v-show="!hasMore">没有更多了..</span>
  </scroll>
</template>

<script>
  import {keySearch} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createDiscSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {scrollMode} from 'common/js/config'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 30

  export default {
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        hasMore: true
      }
    },
    computed: {
      mode () {
        return this.playlist.length > 0 ? scrollMode.search : scrollMode.searchNo
      },
      ...mapGetters([
        'playlist'
      ])
    },
    components: {
      Scroll
    },
    methods: {
      search () {
        this.hasMore = true
        // 设置当前页为1
        this.page = 1
        // 设置当前列表回到顶部
        this.$refs.title.scrollIntoView()
        keySearch(this.query, this.page, this.showSinger, PERPAGE).then(res => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            // 检查还有没有更多数据
            this._checkMore(res.data.song)
          }
        })
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName: function (item) {
        if (item.type === TYPE_SINGER) {
          return item.zhida_singer.singerName
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      loadmore () {
        // 点击加载更多
        if (!this.hasMore) {
          return
        }
        this.page++
        keySearch(this.query, this.page, !this.showSinger, PERPAGE).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data.song)
          }
        })
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = {
            name: item.zhida_singer.singerName,
            mid: item.zhida_singer.singerMID,
            pic: item.zhida_singer.singerPic,
            bigPic: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${item.zhida_singer.singerMID}.jpg`
          }
          this.$router.push({
            path: `/search/${singer.mid}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.type === 1) {
          // 存在zhida，并且type为1，即为singer
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let songs = []
        list.forEach((item) => {
          if (item.id) {
            songs.push(createDiscSong(item))
          }
        })
        return songs
      },
      _checkMore (song) {
        if (!song.list.length) {
          // 没有更多数据了，修改hasMore为false
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    .suggest-list
      height auto
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        height 36px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-l
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-l
        overflow: hidden
        .text
          no-wrap()
    .loadmore
      font-size $font-size-small
      color $color-text-d
      display flex
      align-items center
      justify-content center
      height 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>
