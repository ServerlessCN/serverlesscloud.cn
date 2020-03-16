import * as React from 'react'
import {Blog} from '@src/types'
import crypto from 'crypto'

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
  var md5 = crypto.createHash('md5');
  var aid = md5.update(data.node.fields.slug).digest('hex');
  return (
    <a
      data-id={aid}
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
          <span className="scf-articel-item-readtime">· 阅读大约需要{timeToRead}分钟</span></div>
        <div className="scf-article-item__title">
          <h4>{frontmatter.title}</h4>
        </div>
        <div className="scf-article-item__intro">
          {frontmatter.description}</div>
      </div>
    </a>
  )
}
