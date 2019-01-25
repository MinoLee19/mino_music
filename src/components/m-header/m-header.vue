<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Mino Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 45px
    color: $color-theme
    display flex
    justify-content center
    align-items center
    .icon
      width: 25px
      height: 20px
      margin-right: 9px
      bg-image('logo')
      background-size: 100% 100%
    .text
      line-height 20px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 21px
        color: $color-theme
</style>
