import * as React from 'react'
import theme from '@src/constants/theme'
import {Component} from '@src/types'
import {Link} from 'gatsby'
import './ComponentCard.css'

interface Props {
  blog : Component
}

export default function ComponentCard({blog} : Component) {
  return (
    <div className="scf-component-grid__item">
      <Link
        to={blog.link}
        style={{
        height: "100%"
      }}>
        <div className="scf-component-grid__box">
          <div className="scf-component-article-item">
            <div className="scf-component-article-item__img">
              <img src={blog.thumbnail} alt=""/>
            </div>
            <div className="scf-component-article-item__content">
              <div className="scf-component-article-item__statistics">
                <span className="scf-article-item__statistics-item">
                  <i className="scf-icon scf-icon-favout"></i>
                  3.3K</span>
                <span className="scf-article-item__statistics-item">
                  <i className="scf-icon scf-icon-download"></i>
                  3.3K</span>
              </div>
              <div className="scf-component-article-item__title">
                <h4>{blog.slogan}</h4>
              </div>
              <div className="scf-component-article-item__intro">{blog.description}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
