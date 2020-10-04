import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'
import NotFound from '@/components/NotFound';
import Map from '@/components/Map';

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'HelloWorld', component: HelloWorld },
    { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
    { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
    { path: '/dashboard', name: 'Userboard', component: UserBoard, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true, is_admin: true } },
    { path: '/map', name: 'Map', component: Map, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          let user = JSON.parse(localStorage.getItem('user'));
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.RoleId == 1){
                  next()
              }
              else{
                  next({ name: 'Map'})
              }
          }else {
              next()
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'Map'})
      }
  }else {
      next()
  }
})

export default router