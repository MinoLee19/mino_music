<template>
  <div class="scroll" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'scroll',
    data () {
      return {
        clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
        contentHeight: 0
      }
    },
    props: {
      // 若不是自动填充高度的模式，可指定一个高度，默认是200
      height: {
        type: Number,
        default: 200
      },
      // true为自动填充高度的模式，false是指定高度的模式
      mode: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this._initHeight()

      // 自动检测浏览器高度的变化，改变scroll的高度
      if (this.mode) {
        window.onresize = () => {
          this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        }
      }

      if (this.listenScroll) {
        let me = this
        this.$refs.scroll.onscroll = function () {
          me.$emit('scroll', this.scrollTop)
        }
      }
    },
    methods: {
      _initHeight () {
        if (this.mode) {
          // 90为tab和header的高度的和
          this.contentHeight = this.clientHeight - 90
        } else {
          this.contentHeight = this.height
        }
        this.$refs.scroll.style.height = this.contentHeight + 'px'
      }
    },
    watch: {
      clientHeight: {
        handler: function () {
          this._initHeight()
        }
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
    position relative
    overflow-x hidden
    overflow-y scroll
    // IE 1O+
    -ms-overflow-style none
    // 火狐
    scrollbar-width: none;
</style>
