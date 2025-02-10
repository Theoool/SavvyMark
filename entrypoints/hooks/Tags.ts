export async function createBookmark() {
  try {
    const newBookmark = await new Promise((resolve) => {
      chrome.bookmarks.create(
        { title: 'Example', url: 'https://example.com' },
        (result) => resolve(result),
      );
    });
    console.log('Bookmark created:', newBookmark);
  } catch (error) {
    console.error('Failed to create bookmark:', error);
  }
}

export async function GetAllbookmarks(){
  try {
    const bookmarks = await new Promise((resolve) => {
      chrome.bookmarks.getTree(
        (result) => resolve(result),
      );
    });
    console.log('Bookmark created:', bookmarks);
  } catch (error) {
    console.error('Failed to create bookmark:', error);
}
}
