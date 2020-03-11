import * as React from 'react'
import { Link } from 'gatsby'
import { Blog } from '@src/types'
import crypto from 'crypto'

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
  var md5 = crypto.createHash('md5');
  var id = md5.update(props.blog.node.fields.slug).digest('hex');
  return <Link to={to} style={{height:"100%"}} data-id={id}>{props.children}</Link>
}
