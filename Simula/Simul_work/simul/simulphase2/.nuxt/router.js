import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _46edade8 = () => interopDefault(import('..\\pages\\about.vue' /* webpackChunkName: "pages_about" */))
const _3acb3410 = () => interopDefault(import('..\\pages\\createproject.vue' /* webpackChunkName: "pages_createproject" */))
const _49b50375 = () => interopDefault(import('..\\pages\\directorforgotpass.vue' /* webpackChunkName: "pages_directorforgotpass" */))
const _22dd22b8 = () => interopDefault(import('..\\pages\\directorlogin.vue' /* webpackChunkName: "pages_directorlogin" */))
const _3bc749b8 = () => interopDefault(import('..\\pages\\directorregister.vue' /* webpackChunkName: "pages_directorregister" */))
const _1c67068e = () => interopDefault(import('..\\pages\\directorresetpassword.vue' /* webpackChunkName: "pages_directorresetpassword" */))
const _9e26b984 = () => interopDefault(import('..\\pages\\divtest.vue' /* webpackChunkName: "pages_divtest" */))
const _db467c2e = () => interopDefault(import('..\\pages\\forgotpass.vue' /* webpackChunkName: "pages_forgotpass" */))
const _304d2bc4 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _1dd63b95 = () => interopDefault(import('..\\pages\\privacypolicy.vue' /* webpackChunkName: "pages_privacypolicy" */))
const _4cde2144 = () => interopDefault(import('..\\pages\\profile.vue' /* webpackChunkName: "pages_profile" */))
const _0a41aab4 = () => interopDefault(import('..\\pages\\project.vue' /* webpackChunkName: "pages_project" */))
const _419f4cef = () => interopDefault(import('..\\pages\\projects.vue' /* webpackChunkName: "pages_projects" */))
const _ba6db2d0 = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages_register" */))
const _17b7e436 = () => interopDefault(import('..\\pages\\resetPassword.vue' /* webpackChunkName: "pages_resetPassword" */))
const _97196222 = () => interopDefault(import('..\\pages\\sharedproject.vue' /* webpackChunkName: "pages_sharedproject" */))
const _10a346e2 = () => interopDefault(import('..\\pages\\terms.vue' /* webpackChunkName: "pages_terms" */))
const _66a588ad = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _46edade8,
    name: "about"
  }, {
    path: "/createproject",
    component: _3acb3410,
    name: "createproject"
  }, {
    path: "/directorforgotpass",
    component: _49b50375,
    name: "directorforgotpass"
  }, {
    path: "/directorlogin",
    component: _22dd22b8,
    name: "directorlogin"
  }, {
    path: "/directorregister",
    component: _3bc749b8,
    name: "directorregister"
  }, {
    path: "/directorresetpassword",
    component: _1c67068e,
    name: "directorresetpassword"
  }, {
    path: "/divtest",
    component: _9e26b984,
    name: "divtest"
  }, {
    path: "/forgotpass",
    component: _db467c2e,
    name: "forgotpass"
  }, {
    path: "/login",
    component: _304d2bc4,
    name: "login"
  }, {
    path: "/privacypolicy",
    component: _1dd63b95,
    name: "privacypolicy"
  }, {
    path: "/profile",
    component: _4cde2144,
    name: "profile"
  }, {
    path: "/project",
    component: _0a41aab4,
    name: "project"
  }, {
    path: "/projects",
    component: _419f4cef,
    name: "projects"
  }, {
    path: "/register",
    component: _ba6db2d0,
    name: "register"
  }, {
    path: "/resetPassword",
    component: _17b7e436,
    name: "resetPassword"
  }, {
    path: "/sharedproject",
    component: _97196222,
    name: "sharedproject"
  }, {
    path: "/terms",
    component: _10a346e2,
    name: "terms"
  }, {
    path: "/",
    component: _66a588ad,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
