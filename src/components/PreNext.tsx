import * as React from 'react'
import { Flex, Box } from '@src/components/atoms'
import styled from 'styled-components'
import theme from '@src/constants/theme'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import { display, DisplayProps, space, SpaceProps } from 'styled-system'
import { Blog } from '@src/types'

const LinkWrapper = styled.div<DisplayProps & SpaceProps>`
  ${display}
  ${space}
  a {
    margin: 20px 0;

    transition: all 0.3s ease;

    line-height: 22px;

    &:hover {
      color: ${theme.colors.serverlessRed};
    }
  }
`

interface Props {
  previous: Blog['node']
  next: Blog['node']
}

export default function(props: Props) {
  const { previous, next } = props
  return (
    <Box mt="50px" mb="40px">
      <Flex
        alignItems="flex-start"
        justifyContent={['center', 'center', 'center', 'space-between']}
        flexDirection={['column', 'column', 'column', 'row']}
      >
        {previous ? (
          <LinkWrapper>
            <BlogDetailLink blog={{ node: previous }}>
              上一篇：{previous.frontmatter.title}
            </BlogDetailLink>
          </LinkWrapper>
        ) : null}

        {next ? (
          <LinkWrapper>
            <BlogDetailLink blog={{ node: next }}>
              下一篇：{next.frontmatter.title}
            </BlogDetailLink>
          </LinkWrapper>
        ) : (
          '已经是最后一篇了'
        )}
      </Flex>
    </Box>
  )
}
