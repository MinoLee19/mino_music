<template>
  <div class="scroll" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import {scrollMode} from 'common/js/config'

  export default {
    name: 'scroll',
    data () {
      return {
        clientHeight: document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      height: {
        type: Number,
        default: 200
      },
      mode: {
        type: Number,
        default: scrollMode.fullScreen
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.contentHeight = 0
    },
    mounted () {
      this._initHeight()

      // 自动检测浏览器高度的变化，改变scroll的高度
      if (this.mode !== scrollMode.assign) {
        window.onresize = () => {
          this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        }
      }

      if (this.listenScroll) {
        console.log('listen scroll start')
        let me = this
        this.$refs.scroll.onscroll = function (e) {
          console.log('1--' + this.scrollTop)
          me.$emit('scroll', this.scrollTop)
          e.stopPropagation()
        }
      }
    },
    methods: {
      _initHeight () {
        if (this.mode === scrollMode.fullScreen) {
          this.contentHeight = this.clientHeight - 90
        } else if (this.mode === scrollMode.miniPlay) {
          this.contentHeight = this.clientHeight - 150
        } else if (this.mode === scrollMode.assign) {
          this.contentHeight = this.height
        } else if (this.mode === scrollMode.detailNo) {
          this.contentHeight = this.clientHeight - 45
        } else if (this.mode === scrollMode.detail) {
          this.contentHeight = this.clientHeight - 105
        } else if (this.mode === scrollMode.searchNo) {
          this.contentHeight = this.clientHeight - 170
        } else if (this.mode === scrollMode.search) {
          this.contentHeight = this.clientHeight - 230
        }
        this.$refs.scroll.style.height = this.contentHeight + 'px'
      }
    },
    watch: {
      clientHeight () {
        // 如果窗口的高度发生变化，重新初始化scroll的高
        this._initHeight()
      },
      mode () {
        // 如果父元素传入的模式有变化，就重新初始化scroll的高度
        this._initHeight()
      }
    }
  }
</script>

<style scoped lang="stylus">
  // 设置滚动条不显示
  // 谷歌浏览器/opera
  .scroll::-webkit-scrollbar
    display none

  .scroll
    width 100%
    position relative
    overflow-x hidden
    overflow-y scroll
    // IE 1O+
    -ms-overflow-style none
    // 火狐
    scrollbar-width: none;
</style>
