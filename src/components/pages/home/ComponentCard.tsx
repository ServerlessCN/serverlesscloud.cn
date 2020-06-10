import * as React from 'react'
import { Component } from '@src/types'
import ExternalLink from '@src/components/Link/ExternalLink'
import './ComponentCard.css'
import { Box } from '../../atoms/Box/index'

interface Props {
  blog: Component
}

export default function ComponentCard({ blog }: Props) {
  return (
    <Box className="scf-grid__item-8">
      <ExternalLink to={blog.link}>
        <Box className="scf-grid__box">
          <Box className="scf-article-item">
            <Box className="scf-article-item__img">
              <img src={blog.thumbnail} alt={blog.slogan} />
            </Box>
            <Box className="scf-article-item__content">
              <Box className="scf-article-item__statistics">
                <span className="scf-article-item__statistics-item">
                  <i className="scf-icon scf-icon-favout"></i>
                </span>
                <span className="scf-article-item__statistics-item">
                  <i className="scf-icon scf-icon-download"></i>
                </span>
              </Box>
              <Box className="scf-article-item__title">
                <h4>{blog.slogan}</h4>
              </Box>
              <Box className="scf-article-item__intro">{blog.description}</Box>
            </Box>
          </Box>
        </Box>
      </ExternalLink>
    </Box>
  )
}
