<script lang="ts" setup>
import {onMounted} from 'vue'
import HelloWorld from '@/components/HelloWorld.vue';

onMounted(() => {
  

})
//导入书签，导出书签
</script>

<template>
  导入书签，导出书签，
  
  搜索书签

  我会在网页端提供一个东西：同比浏览器标签数据
  这个插件检测，如果复制的文本包含大量的http,则会将这些数据复制到剪贴板，判断是否批量导入
  

  我要做的这个东西希望每一步都进行同步，在主观上替代了浏览器的标签页，但是实际上是在浏览器的书签栏上进行的操作。
  
  <!-- 创建书签，删除书签 -->
  <HelloWorld msg="WXT + Vue" />
</template>

<style scoped>

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
