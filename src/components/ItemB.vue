<template>
   <div>
      This is item B
      <button @click="addItem()">Add</button>
      <div style="position:relative;">
         <transition-group name="animtest"> 
            <span v-for="(num,index) in nums" v-bind:key="num" :style="myStyle">{{num}}</span>
         </transition-group>
      </div>
   </div>
</template>
<script>
export default {
  props: {
    itemCount: {
      type: Number,
      default:5,
      validator(value){
          return value <= 10; 
      }
    }
  },
  data() {
    return {
        nums2:6,
        myStyle:{
          color:'red',
          fontSize:'18px'
        }
    };
  },
  computed:{
      nums(){
         var arr = [];
         for(let i = 1 ; i <= this.nums2; i++){
             arr.push(`ITEM:${i}`);
         }
         return arr;
      }
  },
  methods: {
    addItem() {
      this.nums2++;
    }
  }
};
</script>
<style>
span {
  margin-right: 10px;
  display: inline-block;
  transition: all 1s;
}
.animtest-enter {
  opacity: 0;
  transform: translateY(30px);
}
</style>