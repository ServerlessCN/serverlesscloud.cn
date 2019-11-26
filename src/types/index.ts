export interface Blog {
  node: {
    id: string
    html?: string
    frontmatter: {
      thumbnail: string
      date: string
      title: string
      description: string
      category: string[]
      authors: string[]
      heroImage: string
    }
    timeToRead: number
    wordCount: {
      words: number
      sentences: number
      paragraphs: number
    }
    tableOfContents: string
    fileAbsolutePath: string
    fields: {
      slug: string
    }
  }
}

export interface GraphqlBlogResult {
  edges: Blog[]
  totalCount: number
}

interface Category {
  totalCount: number
  category: string
}

export interface GraphqlCategoryResult {
  group: Category[]
}

export interface DocMenu {
  label: string
  to?: string
  content?: DocMenu[]
}

export interface Doc {
  id: string
  html: string
}
