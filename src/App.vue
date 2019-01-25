<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <!--将数据保存在缓存中 避免重复请求-->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default {
    components: {
      MHeader: MHeader,
      Tab: Tab
    }
  }
</script>

<style>
  html {
    overflow: -moz-scrollbars-none;
  }
</style>
