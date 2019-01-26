<template>
  <div class="singer">
    <list-view :data="singers" ref="list" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data () {
      return {
        singers: [],
        shortcutList: []
      }
    },
    components: {
      ListView: ListView
    },
    created () {
      this._getSingerList()
    },
    methods: {
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.singers = this._normalizeSinger(res.singerList.data.singerlist)
          }
        })
      },
      _normalizeSinger (list) {
        // 对数据进行格式化
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push({
              name: item.singer_name,
              mid: item.singer_mid,
              pic: item.singer_pic
            })
          }

          const key = item.country

          if (key){
            if (!map[key]) {
              map[key] = {
                title: key,
                items: []
              }
            }
            map[key].items.push({
              name: item.singer_name,
              mid: item.singer_mid,
              pic: item.singer_pic
            })
          }
        })

        // console.log(map)

        // 按想要的顺序排列
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title === HOT_NAME) {
            hot.push(val)
          } else {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return b.items.length - a.items.length
        })

        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
