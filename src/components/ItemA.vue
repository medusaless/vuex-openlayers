<template>
   <div>
      This is item A 
      {{ $route.params.itemIndex }}
       <button v-on:click="show = !show">
          Toggle
       </button>
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
   </div>
</template>
<script>
export default {
    data(){
        return {
            show:true
        }
    },
    methods:{

    }
}
</script>
<style>
p{
    transition: all 1s
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  font-size:25px;
  color:red;
}
</style>