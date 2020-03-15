import * as React from 'react'
import {
  Flex,
  Box,
} from '@src/components/atoms'
import styled from 'styled-components'
import {Blog} from '@src/types'
import {width} from 'styled-system'

function getBlogLink(blog : Blog) {
  return ((blog.node.fields && blog.node.fields.slug) || `/blog/${blog.node.fileAbsolutePath.replace('.md', '').split('/').pop()}`)
}

export default function ({data} : {
  data: Blog
}) {
  const {
    node: {
      id,
      frontmatter,
      timeToRead
    }
  } = data

  frontmatter.categories = frontmatter.categories || []
  return (
    <a
      data-id={data.node.id}
      className="scf-article-item scf-article-item--block"
      href={getBlogLink(data)}>
      <div className="scf-article-item__img">
        <div className="scf-article-item__img-inner"><img src={frontmatter.thumbnail} alt=""/></div>
      </div>
      <div className="scf-article-item__content">
        <div className="scf-article-item__statistics">
          <span className="scf-article-item__statistics-item">
            <i className="scf-icon scf-icon-view"></i>
          </span>{frontmatter
            .authors
            .join(',')}
          · {frontmatter
            .date
            .slice(2, 10)}
          · 阅读大约需要{timeToRead}分钟</div>
        <div className="scf-article-item__title">
          <h4>{frontmatter.title}</h4>
        </div>
        <div className="scf-article-item__intro">
          {frontmatter.description}</div>
      </div>
    </a>
  )
}
