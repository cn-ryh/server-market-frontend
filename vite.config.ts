import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 自定义静态资源路径
        chunkFileNames: 'static/assets/js/[name]-[hash].js',
        entryFileNames: 'static/assets/js/[name]-[hash].js',
        assetFileNames: 'static/assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('.pnpm')) {
              return id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString();
            }
            return id.toString().split('node_modules/')[1].split('/')[0].toString();

          }
          else {
            if (id.includes(__dirname)) {
              return id.toString().split(__dirname)[1].split('?')[0].toString().replace(/\//g, `_`);
            }
            return `app`;
          }
        }
      }
    },
  },
  plugins:
    [
      vue(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
  base: `/market`,
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src',
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: [`idc.cnryh.cn`]
  }
})