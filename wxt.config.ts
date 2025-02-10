
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions:['bookmarks','downloads'],
    action:{
      default_title:"标签同步",
     
    },
  
  }
 
});
