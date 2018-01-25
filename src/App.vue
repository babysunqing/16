<template>
  <div id="app">
    <router-view @route-data-loaded="changeTitle"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    changeTitle (vm) {
      if (vm.pageTitle) {
        document.title = `${vm.pageTitle}`
      }
    }
  }
}
</script>

<style scoped>
#app{
  width: 100%;
  height: 100%;
  position: fixed;
  margin: 0px;
  padding: 0px;
} 
</style>