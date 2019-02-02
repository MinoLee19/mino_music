<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    name: 'singer-detail',
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.bigPic
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      console.log('create 执行')
      this._getDetail()
    },
    mounted () {
      console.log('mounted 执行')
    },
    deactivated () {
      console.log('deactivated 执行')
    },
    destroyed () {
      console.log('destory 执行')
    },
    methods: {
      _getDetail () {
        // 如果不存在mid，回退到上一页（歌手列表）
        if (!this.singer.mid) {
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.mid).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition all 0.5s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
