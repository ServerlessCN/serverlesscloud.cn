import * as React from 'react'
import { Link } from 'gatsby'
import { Blog } from '@src/types'

interface Props extends React.Props<any> {
  blog: Blog
}

export function getBlogLink(blog: Blog) {
  return (
    (blog.node.fields && blog.node.fields.slug) ||
    `/blog/${blog.node.fileAbsolutePath
      .replace('.md', '')
      .split('/')
      .pop()}`
  )
}

export default function(props: Props) {
  const to = getBlogLink(props.blog)

  return <Link to={to}>{props.children}</Link>
}
