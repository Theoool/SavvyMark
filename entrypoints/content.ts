// src/content-scripts/main.ts

const urlRegex = /https?:\/\/[^\s]+/g;

// 检测文本并提取所有链接
function extractLinksFromSelectedText() {
  const selectedText = window.getSelection()!.toString();
  if (selectedText) {
    // 提取文本中的所有链接
    const urls = selectedText.match(urlRegex);
    if (urls && urls.length > 0) {
      return urls;
    }
  }
  return null;
}

export default defineContentScript({
  matches: ['<all_urls>']  , // 域名 + 端口], // 仅在此域名下注入脚本
  allFrames: true, // 可选：是否在所有 iframe 中运行
  main() {
    

    // // 监听网页发送的消息
    window.addEventListener('message', handleMessageFromWebPage);

    window.addEventListener('bookmarks', handleBookmarks);
    
    window.addEventListener('ImportBookmarks', handleImportBookmarks);
// 监听文本选择事件
document.addEventListener('mouseup', () => {
  const links = extractLinksFromSelectedText();
  if (links && links.length >= 1) { // 如果选中的文本包含超过 3 个链接
    showActionButton(links); // 显示按钮
  }
});

// 清除按钮（例如当用户取消选择时）
document.addEventListener('mousedown', () => {
  const existingButton = document.querySelector('button');
  const selection = window.getSelection()!;
  if (existingButton) {
    existingButton.remove();
    selection.removeAllRanges(); // 清除所有选区
  }
 
}); 
  },
});

// 处理来自网页的消息
function handleMessageFromWebPage(event: MessageEvent) {
  console.log("*成功");
  
  // 1. 验证消息来源（重要！防止恶意网站调用）
  if (event.origin !== 'http://localhost:8080') return;
  console.log("未退出");
  // 2. 检查消息格式
  if (event.data?.action === 'callExtensionFunction') {
    // 3. 转发给后台脚本
    browser.runtime.sendMessage(
      {
        action: 'doSomething',
        data: event.data.params,
      },
      (response) => {
        // 4. 将结果返回给网页
        window.postMessage(
          {
            type: 'extensionResponse',
            result: response,
          },
          'http://localhost:8080', // 严格指定目标 origin
        );
      },
    );
  }
}
// 处理来自网页的消息
function handleBookmarks(event: MessageEvent) {
  
  
  // 1. 验证消息来源（重要！防止恶意网站调用）
  if (event.origin !== 'http://localhost:8080') return;
  console.log("未退出");
  // 2. 检查消息格式
  if (event.data?.action === 'callExtensionFunction') {
    // 3. 转发给后台脚本
    browser.runtime.sendMessage(
      {
        action: 'doSomething',
        data: event.data.params,
      },
      (response) => {
        // 4. 将结果返回给网页
        window.postMessage(
          {
            type: 'extensionResponse',
            result: response,
          },
          'http://localhost:8080', // 严格指定目标 origin
        );
      },
    );
  }
}
function handleImportBookmarks(event: MessageEvent) {
  if (event.origin !== 'http://localhost:8080') return;
  
  if (event.data?.action === 'importBookmarks') {
    const fileData = event.data.fileContent;
    
    browser.runtime.sendMessage({
      action: 'importBookmarks',
      data: fileData
    }, (response) => {
      window.postMessage(
        {
          type: 'importBookmarksResponse',
          result: response,
        },
        'http://localhost:8080'
      );
    });
  }
}
function saveLinksAsBookmarks(links:any) {
  console.log(links);
  
  browser.runtime.sendMessage({ action: 'saveBookmarks', links: links });
}
// 在选中文本上方插入一个浮动按钮
function showActionButton(links:any) {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);
  const rect = range.getBoundingClientRect();
    
  // 创建按钮元素
  const button = document.createElement('button');
  button.innerHTML = '导入收藏链接';
  button.style.position = 'absolute';
  
// 设置按钮的位置
button.style.left = `${rect.left + window.scrollX + (rect.width - 50) / 2}px`;
button.style.top = `${rect.top + window.scrollY - 20 - 10}px`;
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#007BFF';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';

  // 给按钮绑定点击事件
  button.addEventListener('click', () => {
    saveLinksAsBookmarks(links);
    const selection = window.getSelection();
   
    button.remove(); // 保存完成后移除按钮

    if (selection) {
      selection.removeAllRanges(); // 清除所有选区
    }
   
  });

  // 将按钮插入到页面
  document.body.appendChild(button);
}
