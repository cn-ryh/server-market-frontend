import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net/base.js";
import { Window } from '@/types'

// 声明window类型
declare const window: Window

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      redirect: '/product/list',
      children: [
        {
          path: 'home',
          name: 'dashboardIndex',
          component: () => import('../views/Dashboard/index.vue'),
          meta: {
            title: '首页',
            requiresAuth: true
          }
        },
        {
          path: 'product',
          name: 'product',
          children: [
            {
              path: ':id(\\d+)',
              props: true,
              name: `product-detail`,
              component: () => import('../views/Dashboard/products/productDetail.vue'),
              meta: {
                title: '产品列表',
              }
            },
            {
              path: 'list',
              name: `product-list`,
              component: () => import('../views/Dashboard/products/productList.vue'),
              meta: {
                title: '产品列表',
              }
            }, {
              path: 'onsale',
              name: `product-onsale`,
              component: () => import('../views/Dashboard/products/productOnSale.vue'),
              meta: {
                requiresAuth: true,
                title: '上架产品',
              }
            }
          ]
        },
        {
          path: `order`,
          name: `order`,
          children: [
            {
              path: 'list',
              name: 'order-list',
              component: () => import('../views/Dashboard/orders/orderList.vue'),
              meta: {
                title: '订单列表',
              }
            },
            // {
            //   path: 'detail/:id(\\d+)',
            //   props: true,
            //   name: 'order-detail',
            //   component: () => import('../views/Dashboard/order/OrderDetail.vue'),
            //   meta: {
            //     title: '订单详情',
            //   }
            // }
          ],
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'user',
          name: 'user',
          meta: {
            title: '用户中心',
            requiresAuth: true
          },
          children: [
            {
              path: `balance`,
              name: 'user-balance',
              component: () => import('../views/Dashboard/user/userBalance.vue'),
              meta: {
                title: '我的余额',
              }
            }
          ]
        },
        {
          path: 'admin',
          name: 'admin',
          redirect: '/admin/users',
          children: [
            {
              path: 'users',
              name: 'admin-users',
              component: () => import('../views/Dashboard/admin/Users.vue'),
              meta: {
                title: '用户管理',
                requiresAdmin: true
              }
            },
            {
              path: 'system',
              name: 'admin-system',
              component: () => import('../views/Dashboard/admin/System.vue'),
              meta: {
                title: '系统管理',
                requiresAdmin: true
              }
            },
            {
              path: 'products',
              name: 'admin-products',
              component: () => import('@/views/Dashboard/admin/Products.vue'),
              meta: {
                title: '产品管理',
                requiresAdmin: true
              }
            },
          ]
        },
      ]
    }
  ],
})

router.beforeEach(async (to, _from, next) => {
  console.log(to);
  // 需要登录的路由校验
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (await unauthorized()) {
      window.location.href = '/login';
    } else {
      next()
    }
  }
  // 已登录用户禁止访问登录/注册页
  else if ((to.name === 'login' || to.name === 'register' || to.name === 'ResetPassword') && !unauthorized()) {
    next({ name: 'dashboard' })
  }
  // 其他情况直接放行
  else if (to.matched.length === 0) {
    next("/product/list")
  } else {
    next()
  }
})
router.beforeEach((to, _from, next) => {
  // 设置文档标题
  document.title = to.meta.title ?
    `${to.meta.title} - 核云二手交易市场` : // 自定义标题格式
    `核云二手交易市场` // 默认标题
  next()
})

// 添加路由导航守卫
router.beforeEach(() => {
  window.$loadingBar?.start()
})

router.afterEach(() => {
  window.$loadingBar?.finish()
})

router.onError(() => {
  window.$loadingBar?.error()
})

export default router
