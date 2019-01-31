<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getTopMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      this._getTopMusicList()
      this.rank = true
    },
    methods: {
      _getTopMusicList () {
        getTopMusicList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeTopList(res.songlist)
          }
        })
      },
      _normalizeTopList (list) {
        let ret = []
        list.forEach((item) => {
          let musicData = item.data
          if (musicData.albummid && musicData.songmid) {
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
