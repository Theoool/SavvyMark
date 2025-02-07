<script lang="ts" setup>
import { ref } from 'vue';
// import { createBookmark } from '../entrypoints/hooks/Tags';
function createBookmark() {
  chrome.runtime.sendMessage({ action: 'createBookmark' }, (response) => {
    if (response?.success) {
      alert('书签创建成功！');
    } else {
      alert('书签创建失败');
    }
  });
}
defineProps({
  msg: String,
});

const count = ref(0);

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="createBookmark()">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the WXT and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
