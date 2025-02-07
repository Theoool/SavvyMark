export const created =async ()=>{
  console.log("caonima1");
  await browser.bookmarks.create(
    {'parentId': '0', 'title': 'Extension bookmarks',url:"www.baidu.com"},
    
  );
  
}
export async function createBookmark(data:any) {
 
  
  try {
    const newBookmark = await new Promise((resolve) => {
      browser.bookmarks.create(
        { title: 'Example', url: data },
        (result) => resolve(result),
      );
    });
    console.log('Bookmark created:', data);
  } catch (error) {
    console.error('Failed to create bookmark:', error);
  }
}
interface Bookmark{
  title:string,
  url:string,
}
interface Bookmarks{
  title:string
  data:Bookmark[]

}

async function Bookmarks(params:Bookmarks) {
  const ID=Date.now()
  try {
  
    // 先创建书签文件夹
    const bookmarkFolder = await new Promise((resolve, reject) => {
     
      browser.bookmarks.create({
        'parentId': ID.toString(),
        'title': params.title
      }, (result) => {
        console.log('书签文件夹已创建: ', result);
        resolve(result);
      });
    });

    const bookmarks = await Promise.all(params.data.map(element => 
      new Promise((resolve) => {
        browser.bookmarks.create({
          'parentId': ID.toString(),
          'title': element.title,
          'url': element.url
        }, (result) => resolve(result))
      })
    ));

    return { bookmarkFolder,bookmarks};
  } catch (error) {
    console.error('创建书签失败:', error);
    throw error;
  }
}
// ... existing code ...

// background.ts
export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'createBookmark') {
      chrome.bookmarks.create({
        title: 'Example Bookmark',
        url: 'https://example.com',
      }, (newBookmark) => {
        console.log('Bookmark created:', newBookmark);
        sendResponse({ success: true });
      });
      return true; // 保持异步响应
    }
    if (request.action === 'doSomething') {
      // 执行插件功能（例如创建书签）
      browser.bookmarks.create({
        title: request.data.title,
        url: request.data.url
      }, (bookmark) => {
        sendResponse({ success: true, bookmark });
      });
      return true; // 保持异步通道
    }
    if (request.action === 'Bookmarks') {
      Bookmarks(request.data);
      sendResponse({ success: true });
      return true; // 保持异步通道
    }
  });
});
