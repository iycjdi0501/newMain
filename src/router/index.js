import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import serviceSign from '@/service/sign'
import NotFound from '@/views/guide/NotFound'
// import SaleHome from '@/views/SaleHouse/SaleHome'
import {
  errorHandler,
  ERROR_TYPE,
} from '@/modules/errorHandler'
import MainPage from '@/views/MainPage2'
import userService from '@/service/user'

const routes = [
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
  {
    path: '/',
    name: 'Main',
    component: MainPage,
  },
  {
    path: '/guide',
    name: 'ApartGuide',
    component: () =>
      import(/* webpackChunkName: "apartguide" */ '@/views/guide/ApartGuide'),
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    beforeEnter: (to, from, next) => {
      store.commit('OPEN_SIGN_IN_MODAL')
      next(from)
    },
  },
  {
    path: '/buyer',
    name: 'SaleHouse',
    component: () =>
      import(/* webpackChunkName: "salahouse" */ '@/views/SaleHouse/SaleHome'),
    beforeEnter: (to, from, next) => {
      store.commit('RESET_FILTER')
      next()
    },
  },
  {
    path: '/policy',
    component: () =>
      import(/* webpackChunkName: "policy" */ '@/views/policy/Policy'),
    children: [
      {
        path: '',
        name: 'TermsOfUse',
        component: () =>
          import(/* webpackChunkName: "policy" */ '@/views/policy/TermsOfUse'),
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: () =>
          import(
            /* webpackChunkName: "policy" */ '@/views/policy/PrivacyPolicy'
          ),
      },
      {
        path: 'marketing',
        name: 'Marketing',
        component: () =>
          import(/* webpackChunkName: "policy" */ '@/views/policy/Marketing'),
      },
    ],
  },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('@/views/localsign/PasswordReset'),
  },
  {
    path: '/callback/kakao',
    redirect: (to) => {
      store.commit('OPEN_SIGN_IN_MODAL')
      store.commit('START_LOADING')

      const authCode = to.query.code
      store
        .dispatch('setTokenFromKakao', authCode)
        .then(() => {
          store.commit('END_LOADING')
          store.commit('CLOSE_SIGN_IN_MODAL')
        })
        .catch(() => {
          store
            .dispatch('insertNotification', {
              type: 'error',
              content: '로그인에 실패하였습니다.<br>잠시후 다시 시도해 주세요.',
            })
            .then(() => store.commit('CLOSE_SIGN_IN_MODAL'))
          store.commit('END_LOADING')
        })

      const previousPath = localStorage.getItem('previous-path')
      localStorage.removeItem('previous-path')

      to.query = ''

      return { path: previousPath }
    },
  },
  {
    path: '/callback/imp/verification',
    redirect: (to) => {
      store.commit('START_ROUTER_LOADING')

      const token = localStorage.getItem('token')

      store.commit('SET_TOKEN', token)

      const success = to.query.success

      if (success) {
        const imp_uid = to.query.imp_uid

        userService
          .checkPhoneVerification({ imp_uid })
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '본인인증 되었습니다.',
            })
            return { name: 'Account' }
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.VERIFICATION))
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: `${to.query.error_msg}`,
        })
        return { name: 'Account' }
      }
      to.query = ''
      return { name: 'Main' }
    },
  },
  {
    path: '/seller',
    name: 'SellerMain',
    component: () =>
      import(/* webpackChunkName: "seller" */ '@/views/seller/SellerMain'),
  },
  {
    path: '/seller/form',
    name: 'SellerForm',
    meta: { requiresAuth: 'user', identified: true },
    component: () =>
      import(/* webpackChunkName: "seller" */ '@/views/estate/EstateForm'),
  },
  {
    path: '/seller/call',
    name: 'SellerCall',
    component: () =>
      import(/* webpackChunkName: "seller" */ '@/views/seller/SellerCall'),
  },
  {
    path: '/buyer/estate/:id',
    name: 'EstateDetail',
    props: (route) => ({ id: route.params.id, isMine: false }),
    component: () =>
      import(/* webpackChunkName: "buyer" */ '@/views/estate/EstateDetail'),
  },
  {
    path: '/buyer/brokerage',
    name: 'Brokerage',
    props: (route) => ({ realEstateId: route.query.realEstateId }),
    component: () =>
      import(/* webpackChunkName: "buyer" */ '@/views/estate/Brokerage'),
  },
  {
    path: '/my',
    meta: { requiresAuth: 'user' },
    component: () => import(/* webpackChunkName: "my" */ '@/views/my/My'),
    children: [
      {
        path: 'account',
        name: 'Account',
        component: () =>
          import(/* webpackChunkName: "my" */ '@/views/my/Account'),
      },
      {
        path: 'estate',
        name: 'EstateList',
        props: (route) => ({ page: parseInt(route.query.page) || 1 }),
        component: () =>
          import(/* webpackChunkName: "my" */ '@/views/estate/EstateList'),
      },
      {
        path: 'wish-list',
        name: 'WishList',
        props: (route) => ({ page: parseInt(route.query.page) || 1 }),
        component: () =>
          import(/* webpackChunkName: "my" */ '@/views/estate/WishList'),
      },
      {
        path: 'inquiry',
        name: 'InquiryList',
        props: (route) => ({ page: parseInt(route.query.page) || 1 }),
        component: () =>
          import(/* webpackChunkName: "my" */ '@/views/inquiry/InquiryList'),
      },
    ],
  },
  {
    path: '/my/estate/:id',
    name: 'MyEstateDetail',
    meta: { requiresAuth: 'user' },
    props: (route) => ({ id: route.params.id, isMine: true }),
    component: () =>
      import(/* webpackChunkName: "my" */ '@/views/estate/EstateDetail'),
  },
  {
    path: '/my/estate/:id/update',
    name: 'EstateUpdate',
    props: true,
    meta: { requiresAuth: 'user', mobileAccessRestrictions: true },
    component: () =>
      import(/* webpackChunkName: "my" */ '@/views/estate/EstateUpdate'),
  },
  {
    path: '/my/inquiry/:id',
    name: 'MyInquiryDetail',
    meta: { requiresAuth: 'user', mobileAccessRestrictions: true },
    props: true,
    component: () =>
      import(/* webpackChunkName: "my" */ '@/views/inquiry/InquiryDetail'),
  },
  {
    path: '/inquiry/form',
    name: 'InquiryForm',
    meta: { requiresAuth: 'user', mobileAccessRestrictions: true },
    component: () =>
      import(/* webpackChunkName: "inquiry" */ '@/views/inquiry/InquiryForm'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  store.commit('START_ROUTER_LOADING')

  if (store.getters.loggedIn) {
    await store.dispatch('renewToken').catch((error) => {
      store.commit('REMOVE_TOKEN')
      errorHandler(error, ERROR_TYPE.AUTH)
    })
  }

  if (store.getters.isMobile && to.fullPath === '/') {
    next({ name: 'SaleHouse' })
  } else {
    if (to.matched.find((record) => record.meta.requiresAuth)) {
      if (store.getters.loggedIn) {
        if (
          to.matched.find(
            (record) =>
              record.meta.requiresAuth === store.state.sign.userData.userType
          )
        ) {
          if (to.matched.find((record) => record.meta.identified)) {
            const privacyResponse = await serviceSign.getUserData(['privacy'])
            store.commit('SET_USER_ID', privacyResponse.data.userId)
            if (privacyResponse.data?.privacy) {
              next()
            } else {
              store.commit('OPEN_IDENTIFY_MODAL')
              next(false)
            }
          } else {
            next()
          }
        } else {
          await store.dispatch('insertNotification', {
            type: 'error',
            content: '해당 서비스를 이용하실 수 없습니다.',
          })
          next(false)
        }
      } else {
        store.commit('OPEN_SIGN_IN_MODAL')
        next(false)
      }
    } else {
      next()
    }
  }
})
router.afterEach((to, from) => {
  store.commit('END_ROUTER_LOADING')
  store.commit('CLOSE_SIDE_BAR')
})
export default router
