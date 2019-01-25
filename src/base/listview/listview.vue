<template>
  <scroll :data="data" class="listview" :listenScroll="listenScroll" @scroll="scroll" ref="listview">
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
    <ul ref="listUl">
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created () {
      // 不在data中创建的原因：在vue中，写在data和props中的数据会默认进行监听，这里不需要
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
    },
    methods: {
      onShortcutTouchStart (e) {
        // 利用冒泡，得到li的index
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        let fisrtTouch = e.touches[0]
        this.touch.y2 = fisrtTouch.pageY

        // 得到在shortcutlist上滚动了个多少元素
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = Number(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll (pos) {
        this.scrollY = pos
      },
      selectItem (item) {
        this.$emit('select', item)
      },
      _calculateHeight () {
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          // 每次加上li的高度
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo (index) {
        if (!index) {
          return
        }

        // 边界限制
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

        let cur = this.$refs.listGroup[index]
        // 出现在视野中
        cur.scrollIntoView()

      }
    },
    watch: {
      // 检测传入的data（singers的变化）
      data: function () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY: function (newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1] || this.$refs.listUl.clientHeight
          // 得到当前y在哪个区间
          if (newY >= height1 && newY < height2) {
            this.currentIndex = i
            // 每个区间的上限值y值减去当前y值，得到一个距离
            this.diff = height2 - newY
            console.log(this.diff)
            return
          }
        }
      },
      diff: function (newVal) {
        var fixTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixTop) {
          return
        }
        this.fixedTop = fixTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    width: 100%
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: fixed
      z-index: 30
      right: 0
      top: 55%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: fixed
      top: 90px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
