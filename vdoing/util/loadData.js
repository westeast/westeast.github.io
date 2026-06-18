/**
 * 数据加载工具：从 JSON 文件异步加载全局数据
 * 目的：让页面 HTML 保持稳定，动态数据运行时加载
 */

// 数据缓存
let cache = {
  posts: null,
  categories: null,
  tags: null,
  archives: null
}

// 获取数据 JSON 的基础路径
function getBasePath() {
  // 在 dev 模式下使用相对路径，生产环境使用绝对路径
  if (process.env.NODE_ENV === 'development') {
    return '/data/'
  }
  // 生产环境下根据实际部署路径调整
  return '/data/'
}

/**
 * 异步加载 posts.json
 * @param {boolean} forceRefresh 是否强制刷新缓存
 */
export async function loadPosts(forceRefresh = false) {
  if (cache.posts && !forceRefresh) {
    return cache.posts
  }

  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}posts.json`)
    if (!response.ok) {
      throw new Error(`Failed to load posts.json: ${response.status}`)
    }
    cache.posts = await response.json()
    return cache.posts
  } catch (error) {
    console.error('[loadPosts] Error:', error)
    return []
  }
}

/**
 * 异步加载 categories.json
 */
export async function loadCategories(forceRefresh = false) {
  if (cache.categories && !forceRefresh) {
    return cache.categories
  }

  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}categories.json`)
    if (!response.ok) {
      throw new Error(`Failed to load categories.json: ${response.status}`)
    }
    cache.categories = await response.json()
    return cache.categories
  } catch (error) {
    console.error('[loadCategories] Error:', error)
    return []
  }
}

/**
 * 异步加载 tags.json
 */
export async function loadTags(forceRefresh = false) {
  if (cache.tags && !forceRefresh) {
    return cache.tags
  }

  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}tags.json`)
    if (!response.ok) {
      throw new Error(`Failed to load tags.json: ${response.status}`)
    }
    cache.tags = await response.json()
    return cache.tags
  } catch (error) {
    console.error('[loadTags] Error:', error)
    return []
  }
}

/**
 * 异步加载 archives.json
 */
export async function loadArchives(forceRefresh = false) {
  if (cache.archives && !forceRefresh) {
    return cache.archives
  }

  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}archives.json`)
    if (!response.ok) {
      throw new Error(`Failed to load archives.json: ${response.status}`)
    }
    cache.archives = await response.json()
    return cache.archives
  } catch (error) {
    console.error('[loadArchives] Error:', error)
    return []
  }
}

/**
 * 清除所有缓存
 */
export function clearCache() {
  cache = {
    posts: null,
    categories: null,
    tags: null,
    archives: null
  }
}

/**
 * 获取最近更新的文章（前 N 篇）
 * @param {number} limit 数量限制
 * @param {string} excludePath 要排除的当前页面路径
 */
export async function getRecentPosts(limit = 3, excludePath = '') {
  const posts = await loadPosts()
  return posts
    .filter(post => post.path !== excludePath)
    .slice(0, limit)
}

/**
 * 按分类获取文章
 * @param {string} categoryName 分类名称
 */
export async function getPostsByCategory(categoryName) {
  const categories = await loadCategories()
  const category = categories.find(c => c.name === categoryName)
  return category ? category.posts : []
}

/**
 * 按标签获取文章
 * @param {string} tagName 标签名称
 */
export async function getPostsByTag(tagName) {
  const tags = await loadTags()
  const tag = tags.find(t => t.name === tagName)
  return tag ? tag.posts : []
}