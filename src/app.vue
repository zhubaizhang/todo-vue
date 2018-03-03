<template>
  <div id="app">
    <div id="cover">
    </div>
    <Header></Header>
      <Todo></Todo>
      <Footer></Footer>
  </div>
</template>
<script>
import Header from './todo/header.vue';
import Footer from './todo/footer.jsx';
import Todo from './todo/todo.vue'
export default {
  components:{
    //为了区分原生标签，请使用大写区分，或者使用自定义标签名
    Header,Footer,Todo
  }
}
</script>
<!--
  lang="stylus" 指定css预处理器
  scoped        指定的样式只应用该组件内
-->
<style lang="stylus" scoped>
#app{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
#cover{
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-color #999
  opacity .9
  z-index -1
}
</style>


