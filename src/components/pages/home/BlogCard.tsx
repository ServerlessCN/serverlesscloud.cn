import * as React from 'react'
import { Box } from '@src/components/atoms'
import { Blog } from '@src/types'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import './BlogCard.css'

interface Props {
  blog: Blog
}

export default function BlogCard({ blog }: Props) {
  return (
    <Box className="scf-grid__item-8">
      <BlogDetailLink key={blog.node.id} blog={blog}>
        <Box className="scf-grid__box">
          <div className="scf-article-item">
            <div className="scf-article-item__img">
              <img src={blog.node.frontmatter.thumbnail} alt={blog.node.frontmatter.title} />
            </div>
            <div className="scf-article-item__content">
              <div className="scf-article-item__statistics">
                <span className="scf-article-item__statistics-item">
                  <i className="scf-icon scf-icon-view"></i>
                </span>
              </div>
              <div className="scf-article-item__title">
                <h4>{blog.node.frontmatter.title}</h4>
              </div>
              <div className="scf-article-item__intro">{blog.node.frontmatter.description}</div>
            </div>
          </div>
        </Box>
      </BlogDetailLink>
    </Box>
  )
}
