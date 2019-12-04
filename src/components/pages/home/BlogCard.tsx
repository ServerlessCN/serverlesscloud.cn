import * as React from 'react'
import { Flex, Box, Text, Background, Image } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { formateDate } from '@src/utils'
import styled from 'styled-components'
import { Blog } from '@src/types'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import Card from '@src/components/Card'

const BoxWithFlex = styled(Box)`
  flex: 1;
`

const BlogInfo = styled(Flex)`
  flex: 1;
`

interface Props {
  blog: Blog
}

export default function BlogCard({ blog }: Props) {
  return (
    <BlogDetailLink key={blog.node.id} blog={blog}>
      <Card>
        <Background
          width={[1]}
          height={[200]}
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
    </BlogDetailLink>
  )
}
