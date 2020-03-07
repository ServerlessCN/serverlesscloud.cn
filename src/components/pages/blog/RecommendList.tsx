import * as React from 'react'
import {
  Box,
  Text,
  List,
  Image,
  ListItemWithNoStyleType,
} from '@src/components/atoms'
import { Blog } from '@src/types'
import styled from 'styled-components'
import {
  height,
  lineHeight,
  minHeight,
  HeightProps,
  MinHeightProps,
  LineHeightProps,
} from 'styled-system'
import theme from '@src/constants/theme'
import blogIconRed from '@src/assets/images/icon-blog-red.png'
import blogIcon from '@src/assets/images/icon-blog.png'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'

const ListItemWithHeight = styled(ListItemWithNoStyleType)<
  HeightProps & MinHeightProps & LineHeightProps
>`
  ${height}
  ${lineHeight}
  ${minHeight}
  cursor: pointer;
  transition: all 0.3s ease;
  world-break: break-all;
  word-wrap: break-word;

  img {
    transition: all 0.3s ease;
    margin-right: 5px;
  }

  .icon-blog-red {
    display: none;
  }

  &:hover {
    color: ${theme.colors.serverlessRed};

    .icon-blog-red {
      display: inline-block;
    }

    .icon-blog {
      display: none;
    }
  }
`

interface Props {
  blogs: Blog[]
  [key: string]: any
}

export default function({ blogs, ...rest }: Props) {
  if (!blogs.length) {
    return <noscript />
  }
  return (
    <Box mt="40px" width={[0.9, 0.9, 0.9, 0.22]} {...rest}>
      <Text fontSize="18px" mb="30px" fontWeight="bold">
        推荐阅读
      </Text>
      <List>
        {blogs.map(blog => {
          const {
            node: {
              id,
              frontmatter: { title },
            },
          } = blog
          return (
            <BlogDetailLink key={id} blog={blog}>
              <ListItemWithHeight minHeight="40px" lineHeight="40px">
                <Image
                  className="icon-blog-red"
                  width="24px"
                  height="24px"
                  alt="blogIconRed"
                  src={blogIconRed}
                />
                <Image
                  className="icon-blog"
                  width="24px"
                  height="24px"
                  alt="blogIcon"
                  src={blogIcon}
                />
                {title}
              </ListItemWithHeight>
            </BlogDetailLink>
          )
        })}
      </List>
    </Box>
  )
}
