export interface Blog {
  node: {
    id: string
    html?: string
    frontmatter: {
      title: string
      description: string
      date: string
      thumbnail: string
      categories?: string[]
      authors: string[]
      authorslink?: string[]
      translators?: string[]
      translatorslink?: string[]
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
  categories: string
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

export interface Component {
  name: string
  thumbnail: string
  slogan: string
  description: string
  link: string
}
