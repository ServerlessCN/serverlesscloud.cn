import * as React from 'react'
import {
  Flex,
  Row,
  Background,
  Container,
  Box,
  Center
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import {Link} from 'gatsby'
import ExternalLink from '@src/components/Link/ExternalLink'
import ComponentCard from './ComponentCard'
import componentConfig from '@src/constants/componentConfig'

export default function () {
  return (
    <Box className="scf-component-recommend">
      <Container
        width={[
        0.95,
        0.95,
        0.95,
        0.95,
        0.76,
        1200
      ]}
        px={0}
        pt={0}>
        <Box className="scf-box">
          <Box className="scf-box__header">
            <div className="scf-box__header-title">
              <h3>组件推荐</h3>
            </div>
            <div className="scf-box__header-more">
              <ExternalLink to="https://serverless.com/cn/components/">
                更多组件 &gt;
              </ExternalLink>
            </div>
          </Box>
          <Box className="scf-box__body">
            <Box className="scf-grid">
              {componentConfig
                .slice(0, 3)
                .map(blog => (<ComponentCard key={blog.name} blog={blog}/>))}
            </Box>
            <Box className="scf-grid">
              {componentConfig
                .slice(3, 6)
                .map(blog => (<ComponentCard key={blog.name} blog={blog}/>))}
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  )
}
