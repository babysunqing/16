<template>
<div class="container" v-title="'玩法介绍'">
  <img src="../../assets/playImg.png">
</div>
</template>

<script>
export default {
  name: 'playMethod',
  data () {
    return {
    }
  },
  methods:{
  }  
}
</script> 

<style scoped>
.container{
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f3f3f3;
  -webkit-overflow-scrolling : touch;
  background-size:100% 100%;
}
img{
  width: 100%;
}
</style>




