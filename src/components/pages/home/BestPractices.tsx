import * as React from 'react'
import {
  Flex,
  Button,
  Background,
  Container,
  Center,
  Box,
  Row

} from '@src/components/atoms'
import theme from '@src/constants/theme'
import {MainTitle} from '@src/components/pages/home/Title'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import BlogCard from './BlogCard'
import './BestPractices.css'

type BestPractice = Blog

interface Props {
  blogs : BestPractice[]
}

function Blogs({blogs} : Props) {

  return (
    <Box className="scf-box__body" id="scf-box-home-best-practices">
      <Box className="scf-grid">
        {blogs
          .slice(0, 3)
          .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
      </Box>
      <Box className="scf-grid">
        {blogs
          .slice(3, 6)
          .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
      </Box>
      </Box>
  )
}

export default function () {
  return (
    <StaticQuery
      query={graphql ` query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//best-practice//" } } ) { edges { node { id frontmatter { title thumbnail description date } fileAbsolutePath fields { slug } } } } } `}
      render={({blogs} : {
      blogs: GraphqlBlogResult
    }) => {
      return (
        <Box className="scf-best-practices">
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
          pt={30}>
            <Box className="scf-box__header">
              <div className="scf-box__header-title">
                <h3>最佳实践</h3>
              </div>
              <div className="scf-box__header-more">
                <Link to="/best-practice">
                  更多推荐 &gt;
                </Link>
              </div>
            </Box>
            <Blogs blogs={blogs.edges}/>
        </Container>
        </Box>
      )
    }}/>
  )
}
