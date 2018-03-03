<template>
  <section class="real-app">
      <input 
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来要做什么？"
      v-on:keyup.enter="addTodo"
      >
      <!-- @keyup.enter="addTodo" 简写 enter 修饰符，必须敲下回车键才执行-->
      <Item 
        :todo="todo"
        v-for="todo in filteredTodos"
        :key="todo.id"
        @del="deleteTodo"
      />
      <!--在vue里面组件内实现的任何事件触发操作，在父组件内都可以用  @来监听
      这样就可以实现父子组件的解耦-->
      <Tabs
        :filter="filter"
        :todos="todos"
        @toggle="toggleFilter"
        @clearAllCompleted="clearAllCompleted"
       />
  </section>
</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id=0;
export default {
    data(){
        return {
            todos:[],
            filter:'all'
        }
    },
    components:{
        Item,Tabs
    },
    computed:{
        //过滤过的todo列表
        filteredTodos(){
            if(this.filter==='all'){
                return this.todos
            }
            const completed=this.filter==='completed';
            return this.todos.filter(todo=>completed===todo.completed)
        }
    },
    methods:{
        addTodo(e){
            const val=e.target.value.trim();
            if(val===''){
                alert('请输入要完成的事件');
                return false
            }
            this.todos.unshift({
                id:id++,
                content:val,
                completed:false
            })
            e.target.value=''
        },
        deleteTodo(id){
            this.todos.splice(this.todos.findIndex(todo=>todo.id===id),1)
        },
        toggleFilter(state){
            this.filter=state
        },
        clearAllCompleted(){
            this.todos=this.todos.filter(todo=>!todo.completed)
        }
    }
}
</script>
<style lang="stylus" scoped>
.real-app{
  width 600px
  margin 0 auto
  box-shadow 0 0 5px #666
}
.add-input{
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}
</style>


