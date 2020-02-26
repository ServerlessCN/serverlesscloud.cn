import * as React from 'react'
import { Flex, Box } from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import { Blog } from '@src/types'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import './BlogCard.css'

interface Props {
  blog: Blog
}

export default function BlogCard({ blog }: Props) {
  return (
    <div className="scf-grid__item">
    <BlogDetailLink key={blog.node.id} blog={blog} >
      <div className="scf-grid__box">
        <div className="scf-article-item">
          <div className="scf-article-item__img">
            <img src={blog.node.frontmatter.thumbnail} alt="" />
          </div>
          <div className="scf-article-item__content">
            <div className="scf-article-item__statistics">
              <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i> 3.3K
              </span>
            </div>
            <div className="scf-article-item__title">
              <h4>{blog.node.frontmatter.title}</h4>
            </div>
            <div className="scf-article-item__intro">{blog.node.frontmatter.description}</div>
          </div>
        </div>
       </div>
     
      {/* <Card><Background
          width={[1]}
          height={[200]}
          minHeight={[200]}
          background={`url(${JSON.stringify(blog.node.frontmatter.thumbnail)})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        />
        <BlogInfo flexDirection={'column'} p={'20px'}>
          <BoxWithFlex width={1}>
            <Text
              align={['left']}
              fontSize={['16px', '16px', '16px', '18px']}
              lineHeight={'38px'}
            >
              {blog.node.frontmatter.title}
            </Text>
            <Text
              align={['left']}
              my={'12px'}
              fontSize="14px"
              lineHeight={1.75}
              color={theme.colors.gray[2]}
            >
              {blog.node.frontmatter.description}
            </Text>
          </BoxWithFlex>
          <Box width={[1]}>
            <Flex justifyContent="space-between">
              <Text
                align={['left']}
                my={'12px'}
                fontSize="14px"
                color={theme.colors.gray[2]}
              >
                {formateDate(blog.node.frontmatter.date)}
              </Text>
              <Text
                align={['left']}
                my={'12px'}
                fontSize="14px"
                color={theme.colors.serverlessRed}
              >
                阅读全文
              </Text>
            </Flex>
          </Box>
        </BlogInfo>
         </Card>
        */} 
     
    </BlogDetailLink>
    </div>
  )
}
