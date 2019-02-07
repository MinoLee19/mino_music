<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li class="item" v-for="item of hotKey" @click="addQuery(item.k)">
          <span>{{item.k}}</span>
        </li>
      </ul>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'

  export default {
    components: {
      SearchBox,
      Suggest
    },
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      addQuery (query) {
        // 调用search-box的方法setQuery
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange (query) {
        this.query = query
      },
      _getHotKey () {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            // console.log(res.data.hotkey)
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      width: 100%
      padding 0 20px 20px 20px
      .title
        margin-bottom 17px
        font-size: $font-size-medium
        color: $color-text-l
      ul
        width 100%
        display flex
        flex-wrap wrap
        .item
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-l
</style>
