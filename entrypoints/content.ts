// src/content-scripts/main.ts
export default defineContentScript({
  matches: ['<all_urls>']  , // 域名 + 端口], // 仅在此域名下注入脚本
  allFrames: true, // 可选：是否在所有 iframe 中运行
  main() {
    

    // // 监听网页发送的消息
    window.addEventListener('message', handleMessageFromWebPage);
    
    // // 清理监听器（wxt 会自动处理，此处仅作示例）
    // return () => {
    //   window.removeEventListener('message', handleMessageFromWebPage);
    // };
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
