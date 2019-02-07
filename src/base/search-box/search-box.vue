<template>
  <div class="search-box">
    <i class="icon icon-icon-7"></i>
    <input ref="query" :placeholder="placeholder" v-model="query" class="box">
    <i @click="clear" v-show="query" class="icon icon-shanchu"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      }
    },
    created () {
      // 使用节流函数
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display flex
    align-items center
    width 100%
    padding 0 6px
    height 40px
    background $color-highlight-background
    border-radius 6px
    .box
      flex 1
      margin 0 5px
      line-height 18px
      background $color-highlight-background
      color $color-text
      font-size $font-size-medium
      &::placeholder
        color $color-text-l
      &:focus
        outline none
    .icon
      font-size: 16px
      color: $color-background
</style>
