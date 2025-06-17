import { h, Component, ref } from 'vue'
import {
  HomeOutline,
  AddCircleOutline,
  AppsOutline,
  IdCardOutline,
  PeopleOutline,
  CloudyOutline,
  ConstructOutline,
  BuildOutline,
  SettingsOutline,
  ListOutline,
} from '@vicons/ionicons5'
import { NIcon, type MenuOption } from 'naive-ui'

const baseMenuOptions: MenuOption[] = [
  {
    label: '首页',
    icon: renderIcon(HomeOutline),
    key: 'dashboardIndex',
    link: '/home',
  },
  {
    label: '商品中心',
    icon: renderIcon(AppsOutline),
    key: 'servers-center',
    children: [
      {
        label: '浏览商品',
        icon: renderIcon(AddCircleOutline),
        key: 'servers-list',
        link: '/product/list',
      },
      {
        label: '上架商品',
        icon: renderIcon(ListOutline),
        key: 'servers-online',
        link: '/product/online',
      }
    ]
  },
  {
    label: '我的订单',
    icon: renderIcon(AppsOutline),
    key: 'order-center',
    link: '/order/list'
  },
  // {
  //   label: '帮助中心',
  //   icon: renderIcon(HelpCircleOutline),
  //   key: 'help',
  //   link: '/dashboard/help',
  // },
  {
    label: '用户中心',
    icon: renderIcon(IdCardOutline),
    key: 'profile',
    link: '/user/my-profile',
  }
]

const adminMenuOptions: MenuOption = {
  label: '管理中心',
  icon: renderIcon(ConstructOutline),
  key: 'admin',
  children: [
    {
      label: '用户管理',
      key: 'admin-users',
      link: '/admin/users',
      icon: renderIcon(PeopleOutline)
    },
    {
      label: '节点管理',
      key: 'admin-nodes',
      link: '/admin/nodes',
      icon: renderIcon(CloudyOutline)
    },
    {
      label: '隧道管理',
      key: 'admin-proxies',
      link: '/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: '产品管理',
      key: 'admin-products',
      link: '/admin/products',
      icon: renderIcon(BuildOutline)
    },
    {
      label: '系统管理',
      key: 'admin-system',
      link: '/dashboard/admin/system',
      icon: renderIcon(SettingsOutline)
    }
  ]
}

export function getMenuOptions(): MenuOption[] {
  const userGroup = localStorage.getItem('group')
  const options = [...baseMenuOptions]

  if (userGroup === 'admin') {
    options.push(adminMenuOptions)
  }
  return options
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, {
    component: icon,
    size: 22
  });
}

export const defaultExpandedKeys = ref<string[]>(['more']);