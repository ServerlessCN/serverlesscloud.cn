import * as React from 'react'
import {
  Flex,
  Box,
  Column,
  Text,
  Button,
  Background,
  Row,
  Image,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import { Blog } from '@src/types'
import { width } from 'styled-system'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import { generateCategoryText } from '@src/components/Link/CategoryLink'

import { formateDate } from '@src/utils'

const InlineText = styled(Text)`
  display: inline-block;
  padding: 0 3px;
`

const ColumnWithHeight = styled(Column)`
  height: 100%;
`

const BoxWithFlex = styled(Box)`
  flex: 1;
  ${width}
`

export default function({ data }: { data: Blog }) {
  const {
    node: { id, frontmatter, timeToRead },
  } = data

  return (
    <BlogDetailLink blog={data}>
      <Box mt="40px" mb="40px">
        <Flex
          alignItems={['center', 'center', 'center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'flex-start']}
          flexDirection={['column', 'column', 'column', 'row']}
        >
          <Background
            width={[0.9, 0.9, 0.9, 0.35]}
            height={[200]}
            background={`url(${JSON.stringify(frontmatter.thumbnail)})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
          />
          <BoxWithFlex width={[0.9, 0.9, 0.9, 0.65]} ml={[0, 0, 0, '30px']}>
            <ColumnWithHeight
              alignItems="flex-end"
              justifyContent="space-between"
            >
              <Box width={[1]}>
                <Text mt="20px" mb="10px" fontSize="24px" fontWeight="bold">
                  {frontmatter.title}
                </Text>
                <Box>
                  <InlineText fontSize="14px">
                    作者: {frontmatter.authors.join(',')}
                  </InlineText>
                  <InlineText fontSize="14px">
                    阅读大概需要{timeToRead}分钟
                  </InlineText>
                  <InlineText fontSize="14px">
                    归档于
                    {(frontmatter.categories || [])
                      .map(o => generateCategoryText(o))
                      .map(o => (
                        <span key={o}>{o}&nbsp;</span>
                      ))}
                  </InlineText>
                </Box>
                <Row justifyContent="flex-end">
                  <Text
                    color={theme.colors.gray[2]}
                    fontSize="14px"
                    mt="20px"
                    mb="20px"
                  >
                    {formateDate(frontmatter.date)}
                  </Text>
                </Row>
              </Box>

              <Button width="160px" p="0.4rem" fontSize="18px" theme={theme}>
                继续阅读
              </Button>
            </ColumnWithHeight>
          </BoxWithFlex>
        </Flex>
      </Box>
    </BlogDetailLink>
  )
}
