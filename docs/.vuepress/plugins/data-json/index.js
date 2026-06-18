/**
 * VuePress 插件：将全局页面数据生成为独立 JSON 文件
 * 目的：实现增量编译，修改单个 MD 文件不影响其他页面的 HTML
 *
 * 注意：VuePress 1.x 使用 bundle-require 打包配置，需要兼容 ESM/CJS
 */

const path = require('path')

module.exports = (options = {}, context) => {
  const outputDir = options.outputDir || 'data'

  return {
    name: 'vuepress-plugin-data-json',

    // 在构建完成后生成 JSON 文件
    async generated(pagePaths) {
      // 动态导入 fs（兼容 ESM 环境）
      const fs = require('fs')

      const { pages, sourceDir } = context
      const destDir = path.resolve(sourceDir, '.vuepress/dist', outputDir)

      // 确保 output 目录存在
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }

      // 1. posts.json - 所有文章数据
      const posts = pages
        .filter(page => {
          // 过滤出真正的文章页
          const fm = page.frontmatter || {}
          return fm.article !== false &&
                 !fm.categoriesPage &&
                 !fm.tagsPage &&
                 !fm.archivesPage &&
                 !fm.home &&
                 page.path.startsWith('/pages/')
        })
        .map(page => ({
          title: page.title,
          path: page.path,
          date: page.frontmatter.date || '',
          categories: page.frontmatter.categories || [],
          tags: page.frontmatter.tags || [],
          permalink: page.frontmatter.permalink || '',
          sticky: page.frontmatter.sticky || 0,
          titleTag: page.frontmatter.titleTag || '',
          lastUpdated: page.lastUpdated || ''
        }))
        .sort((a, b) => {
          // 按置顶和时间排序
          if (a.sticky !== b.sticky) return b.sticky - a.sticky
          const dateA = new Date(a.date).getTime() || 0
          const dateB = new Date(b.date).getTime() || 0
          return dateB - dateA
        })

      fs.writeFileSync(
        path.join(destDir, 'posts.json'),
        JSON.stringify(posts, null, 2)
      )

      // 2. categories.json - 分类数据
      const categoriesMap = {}
      posts.forEach(post => {
        const cats = post.categories || []
        cats.forEach(cat => {
          if (!categoriesMap[cat]) {
            categoriesMap[cat] = { name: cat, posts: [], count: 0 }
          }
          categoriesMap[cat].posts.push(post)
          categoriesMap[cat].count++
        })
      })
      const categories = Object.values(categoriesMap)
        .sort((a, b) => b.count - a.count)

      fs.writeFileSync(
        path.join(destDir, 'categories.json'),
        JSON.stringify(categories, null, 2)
      )

      // 3. tags.json - 标签数据
      const tagsMap = {}
      posts.forEach(post => {
        const tags = post.tags || []
        tags.forEach(tag => {
          if (!tag) return // 过滤空标签
          if (!tagsMap[tag]) {
            tagsMap[tag] = { name: tag, posts: [], count: 0 }
          }
          tagsMap[tag].posts.push(post)
          tagsMap[tag].count++
        })
      })
      const tags = Object.values(tagsMap)
        .sort((a, b) => b.count - a.count)

      fs.writeFileSync(
        path.join(destDir, 'tags.json'),
        JSON.stringify(tags, null, 2)
      )

      // 4. archives.json - 按年份归档的数据
      const archivesMap = {}
      posts.forEach(post => {
        if (!post.date) return
        const year = post.date.substring(0, 4)
        if (!archivesMap[year]) {
          archivesMap[year] = { year, posts: [], count: 0 }
        }
        archivesMap[year].posts.push(post)
        archivesMap[year].count++
      })
      const archives = Object.values(archivesMap)
        .sort((a, b) => b.year - a.year)

      fs.writeFileSync(
        path.join(destDir, 'archives.json'),
        JSON.stringify(archives, null, 2)
      )

      console.log(`[data-json] Generated 4 JSON files in /${outputDir}/`)
      console.log(`[data-json] posts: ${posts.length}, categories: ${categories.length}, tags: ${tags.length}`)
    }
  }
}