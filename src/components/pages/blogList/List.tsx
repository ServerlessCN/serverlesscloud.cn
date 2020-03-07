import * as React from 'react'
import { Box } from '@src/components/atoms'
import BlogListItem from './ListItem'
import Pagination from './Pagination'
import { Blog } from '@src/types'
import { navigate } from 'gatsby'
import { WidthProps } from 'styled-system'

export default function({
  blogs,
  offset,
  limit,
  totalCount,
  generateDataUrl,
  ...rest
}: {
  blogs: Blog[]
  offset: number
  limit: number
  totalCount: number
  generateDataUrl: (pageNum: number) => string
} & WidthProps) {
  return (
    <Box>
      <Box>
        {blogs.map(blog => (
          <BlogListItem key={blog.node.id} data={blog} />
        ))}
      </Box>

      <Pagination
        currentPage={Math.floor(offset / limit) + 1}
        totalCount={totalCount}
        pageSize={limit}
        onChange={(pageNum: number) => {
          const url = (generateDataUrl && generateDataUrl(pageNum)) || ''

          if (url === '') return

          navigate(url)
        }}
      />
    </Box>
  )
}
