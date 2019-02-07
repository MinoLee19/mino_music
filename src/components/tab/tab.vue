<template>
  <div class="tab">
    <!--tag指定router-link渲染什么标签,默认是a-->
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex
    height: 45px
    line-height: 45px
    font-size: $font-size-medium
    position relative
    // 不设置z-index，在歌手页面，fix-title会将tab覆盖
    z-index 10
    background-color $color-background
    .tab-item
      flex: 1
      /*flex-grow: 1;flex-shrink: 1;flex-basis: 0%;*/
      /*flex-grow 属性用于设置或检索弹性盒子的扩展比率，在这个例子中，设置为1，则将父元素分为四份，每个子元素占一份*/
      //flex-shrink的默认值为1，如果没有显示定义该属性，将会自动按照默认值1在所有因子相加之后计算比率来进行空间收缩
      //flex-basis 属性用于设置或检索弹性盒伸缩基准值
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
