import * as React from 'react'
import { Blog } from '@src/types'
import crypto from 'crypto'
import { Link } from 'gatsby'

function getBlogLink(blog: Blog) {
  return (
    (blog.node.fields && blog.node.fields.slug) ||
    `/blog/${blog.node.fileAbsolutePath
      .replace('.md', '')
      .split('/')
      .pop()}`
  )
}
const baseCategoryUrl = '/tags'

export default function({ data }: { data: Blog }) {
  const {
    node: { frontmatter, timeToRead },
  } = data

  frontmatter.categories = frontmatter.categories || []
  var md5 = crypto.createHash('md5')
  var aid = md5.update(data.node.fields.slug).digest('hex')
  return (
    <Link data-id={aid} className="scf-article-item scf-article-item--block" to={getBlogLink(data)}>
      <div className="scf-article-item__img">
        <div className="scf-article-item__img-inner">
          <img src={frontmatter.thumbnail} alt={frontmatter.title} />
        </div>
      </div>
      <div className="scf-article-item__content">
        <div className="scf-article-item__title">
          <h4>{frontmatter.title}</h4>
        </div>
        <div className="scf-article-item__intro">{frontmatter.description}</div>
        {frontmatter.tags ? (
          <div className="scf-article-item__seotag">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
            </span>
            {frontmatter.authors.join(',')} · {frontmatter.date.slice(2, 10)} ·
            <div className="scf-article-item__con">
              {frontmatter.tags.map((tag, index) => (
                <Link to={`${baseCategoryUrl}/${tag}`} key={tag}>
                  <span className="scf-seotag__item">{tag}</span>
                  {index !== frontmatter.tags!.length - 1 && <span className="scf-seotag__slash">/</span>}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
