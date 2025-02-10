<template>
  <div class="hello">
    <h2>导入书签的JSON文件</h2>
    <input 
    v-if="!fileContent"
      type="file" 
      accept=".json"
      @change="handleFileUpload"
      ref="fileInput"
    >
   
    <button @click="importBookmarks">导入书签</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const fileContent = ref<string>('')

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    fileContent.value = e.target?.result as string
  }

  reader.readAsText(file)
  console.log(reader);
  
}

const importBookmarks = () => {
  // console.log("1");
  // alert("1")
  if (!fileContent.value) {
    alert('请先选择文件')
    return
  }
  // alert(fileContent.value)
//  console.log(fileContent.value);
 
  // 发送消息给content script
  chrome.runtime.sendMessage({
    action: 'importBookmarks',
    data: fileContent.value
  }, (response) => {
    if (response.success) {
      alert('书签导入成功！')
      if (fileInput.value) {
        fileInput.value.value = '' // 清空文件输入
      }
      fileContent.value = '' // 清空文件内容
    } else {
      alert(`导入失败: ${response.error}`)
    }
  })
}

// 监听导入结果
window.addEventListener('message', (event) => {
  // console.log(event);
  // alert(event)
  // if (event.data.type === 'ImportBookmarks') {
   
    const response = event.data.result
   
    if (response.success) {
      alert('书签导入成功！')
      if (fileInput.value) {
        fileInput.value.value = '' // 清空文件输入
      }
      fileContent.value = '' // 清空文件内容
    } else {
      alert(`导入失败: ${response.error}`)
    }
  // }
})
</script>
<style scoped>
.hello{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap:20px
}
</style>
