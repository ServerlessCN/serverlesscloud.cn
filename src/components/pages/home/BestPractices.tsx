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
import { MainTitle } from '@src/components/pages/home/Title'
import { StaticQuery, graphql, Link } from 'gatsby'
import { Blog, GraphqlBlogResult } from '@src/types'
import BlogCard from './BlogCard'
import './BestPractices.css'

type BestPractice = Blog

interface Props {
  blogs: BestPractice[]
}

function Blogs({ blogs }: Props) {

  return (
    <Container
      width={'76%'}
      maxWidth={['100%', '100%', '100%', '85%']}
    >
      <div style={{margin: "-21px",
        width: "100%"}}>      
      <Flex
        flexDirection={['column', 'column', 'row', 'row', 'row']}
        flexWrap={['initial', 'initial', 'wrap', 'wrap', 'initial']}
        justifyContent={['initial', 'initial', 'center']}
        width={[1]}
        mb={[32, 32, 0]}
        mt={[0, 0, 0]}
      >
        {blogs.slice(0,3).map(blog => (
          <BlogCard key={blog.node.id} blog={blog} />
        ))}
      </Flex>
      <Flex
        flexDirection={['column', 'column', 'row', 'row', 'row']}
        flexWrap={['initial', 'initial', 'wrap', 'wrap', 'initial']}
        justifyContent={['initial', 'initial', 'center']}
        width={[1]}
        mb={[32, 32, 0]}
        mt={[0, 0, 0]}
      >
        {blogs.slice(3,6).map(blog => (
          <BlogCard key={blog.node.id} blog={blog} />
        ))}
      </Flex>
      </div>
    </Container>
  )
}

export default function() {
  return (
    <StaticQuery
      query={graphql`
        query {
          blogs: allMarkdownRemark(
            sort: { fields: frontmatter___date, order: DESC }
            limit: 6
            filter: { fileAbsolutePath: { regex: "//best-practice//" } }
          ) {
            edges {
              node {
                id
                frontmatter {
                  title
                  thumbnail
                  description
                  date
                }
                fileAbsolutePath
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={({ blogs }: { blogs: GraphqlBlogResult }) => {
        return (
          <Background
            background={theme.colors.white}
            pt={'40px'}
            pb={'20px'}
            width={1}
            style={{margin:"0 auto"}}
          >
          
            <Center flexDirection="column">
              <Row className="scf-box__header" 
                width="76%"
                height="100%"
                alignItems="flex-end"
                justifyContent="space-between"
                style={{marginTop: "30px"}}>
                  <div className="scf-box__header-title"><h3>最佳实践</h3></div>
                  <div className="scf-box__header-more">
                  <Link to="/best-practice">
                  更多推荐 &gt;
                  </Link>
                  </div>
                </Row>
                <Blogs blogs={blogs.edges} />
            </Center>
          </Background>
        )
      }}
    />
  )
}
