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
