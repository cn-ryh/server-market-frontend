import { h, Component, ref } from 'vue'
import { HomeOutline, 
  AddCircleOutline, 
  AppsOutline, 
  DownloadOutline, 
  IdCardOutline, 
  StatsChartOutline, 
  PeopleOutline,
  CloudyOutline, 
  ConstructOutline, 
  WalletOutline, 
  BuildOutline, 
  SettingsOutline, 
  ListOutline, 
  CubeOutline
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
          link: '/servers/list',
        },
        {
          label: '上架商品',
          icon: renderIcon(ListOutline),
          key: 'servers-online',
          link: '/servers/online',
        }
    ]
  },
  {
    label: '订单中心',
    icon: renderIcon(AppsOutline),
    key: 'order-center',
    children: [
        {
          label: '浏览商品',
          icon: renderIcon(AddCircleOutline),
          key: 'create-tunnel',
          link: '/order/create',
        },
        {
          label: '上架商品',
          icon: renderIcon(ListOutline),
          key: 'proxy-list',
          link: '/order/list',
        }
    ]
  },
  {

    label: '节点状态',
    icon: renderIcon(StatsChartOutline),
    key: 'node-status',
    link: '/dashboard/node/status',
  },
  {
    label: '文件下载',
    icon: renderIcon(DownloadOutline),
    key: 'downloads',
    link: '/dashboard/downloads',
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
    link: '/dashboard/user/my-profile',
  },
  {
    label: '增值服务',
    key: 'cash',
    icon: renderIcon(WalletOutline),
    link: '/dashboard/cash',
  },
  {
    label: '更多',
    key: 'mores',
    icon: renderIcon(ListOutline),
    children: [
      {
        label: '关于面板',
        key: 'about',
        icon: renderIcon(CubeOutline),
        link: '/dashboard/more/about',
      },
    ]
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
      link: '/dashboard/admin/users',
      icon: renderIcon(PeopleOutline)
    },
    {
      label: '节点管理',
      key: 'admin-nodes',
      link: '/dashboard/admin/nodes',
      icon: renderIcon(CloudyOutline)
    },
    {
      label: '隧道管理',
      key: 'admin-proxies',
      link: '/dashboard/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: '产品管理',
      key: 'admin-products',
      link: '/dashboard/admin/products',
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
  })
}

export const defaultExpandedKeys = ref<string[]>(['more'])