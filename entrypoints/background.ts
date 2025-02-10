import {fetchPageMetadata} from './hooks/fetchPageMetadata'
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

//创建文件夹
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


//  一键收藏，今日标签整理/分类，标签跨端同步，

async function GetAllbookmarks(): Promise<any[]> {
  try {
    const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.getTree((result) => resolve(result));
    });
    
    // 将书签数据转换为更简洁的格式
    const formatBookmarks = (nodes: chrome.bookmarks.BookmarkTreeNode[]): any[] => {
      return nodes.map(node => {
        const bookmark: any = {
          title: node.title
        };
        
        if (node.url) {
          bookmark.url = node.url;
        }
        
        if (node.children) {
          bookmark.children = formatBookmarks(node.children);
        }
        
        return bookmark;
      });
    };
    const formattedBookmarks = formatBookmarks(bookmarks);
    
    // 导出为JSON文件
    const bookmarksJson = JSON.stringify(formattedBookmarks, null, 2);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(bookmarksJson);
    
    // 触发下载
    await new Promise<void>((resolve, reject) => {
      chrome.downloads.download({
        url: dataUrl,
        filename: `bookmarks_${new Date().toISOString().split('T')[0]}.json`,
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    // 清理URL对象
    URL.revokeObjectURL(dataUrl);
    
    return formattedBookmarks;
  } catch (error) {
    console.error('导出书签失败:', error);
    throw error;
  }
}

async function importBookmarks(bookmarkData: ImportedBookmark[], parentId?: string): Promise<void> {
  try {
    for (const bookmark of bookmarkData) {
      if (bookmark.children) {
        // 创建文件夹
        const folder = await new Promise<chrome.bookmarks.BookmarkTreeNode>((resolve, reject) => {
          chrome.bookmarks.create({
            parentId: parentId,
            title: bookmark.title
          }, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
        
        // 递归处理子书签
        await importBookmarks(bookmark.children, folder.id);
      } else if (bookmark.url) {
        // 创建书签
        await new Promise<void>((resolve, reject) => {
          chrome.bookmarks.create({
            parentId: parentId,
            title: bookmark.title,
            url: bookmark.url
          }, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('导入书签失败:', error);
    throw error;
  }
}
async function saveBookmarks(links:string[]) {

 console.log(links);
 
  const bookmarks = await Promise.all(links.map(element => 
    
    new Promise(async (resolve) => {
      const {title,url}=await fetchPageMetadata(element)
      browser.bookmarks.create({
        'parentId': '1',
        'title': title!,
        'url': url,
      
      }, (result) => resolve(result))
    })
  ));
 
  console.log(bookmarks);
  
}



export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'createBookmark':
        chrome.bookmarks.create({
          title: 'Example Bookmark',
          url: 'https://example.com',
        }, (newBookmark) => {
          console.log('Bookmark created:', newBookmark);
          sendResponse({ success: true });
        });
        return true; // 保持异步响应

      case "doSomething":
        // 执行插件功能（例如创建书签）
        browser.bookmarks.create({
          title: request.data.title,
          url: request.data.url
        }, (bookmark) => {
          sendResponse({ success: true, bookmark });
        });
        return true; // 保持异步通道

      case "Bookmarks":
        Bookmarks(request.data);
        sendResponse({ success: true });
        return true; // 保持异步通道

      case "GetAllbookmarks":
        GetAllbookmarks();
        sendResponse({ success: true });
        return true; // 保持异步通道
     case "importBookmarks":
        try {
          console.log(request);
          
          const bookmarkData = JSON.parse(request.data);
          importBookmarks(bookmarkData)
            .then(() => {
              sendResponse({ success: true, message: '书签导入成功' });
            })
            .catch(error => {
              sendResponse({ success: false, error: error.message });
            });
          return true;
        } catch (error) {
          sendResponse({ success: false, error: 'JSON 解析失败' });
          return true;
        }
case 'saveBookmarks':
const links = request.links;
  saveBookmarks(links);
  sendResponse({ success: true });
  return true; // 保持异步通道


      default:
        break;
    }
  });
});
