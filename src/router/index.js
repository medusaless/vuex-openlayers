import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ItemA from '../components/ItemA.vue'
import ItemB from '../components/ItemB.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Hello',
      redirect:'/itema/1',
      component: HelloWorld
    },
    {
      path: '/itema/:itemIndex',
      component: ItemA
    },
    {
      path: '/itemb',
      component: ItemB
    }
  ]
})
