import * as React from 'react'
import {
  Flex,
  Box,
  Column,
  Text,
  Button,
  Background,
  Row,
  Image
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import {Blog} from '@src/types'
import {width} from 'styled-system'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import {generateCategoryText} from '@src/components/Link/CategoryLink'

import {formateDate} from '@src/utils'

const InlineText = styled(Text)`
  display: inline-block;
  padding: 0 4px;
  line-height: 1.5;
`

const ColumnWithHeight = styled(Column)`
  height: 100%;
`

const BoxWithFlex = styled(Box)`
  flex: 1;
  ${width}
`
export default function ({data} : {
  data: Blog
}) {
  const {
    node: {
      id,
      frontmatter,
      timeToRead
    }
  } = data

  frontmatter.categories = frontmatter.categories || []
  return (

    <BlogDetailLink blog={data} data-id="jack">
      {/*
      <a
        className="scf-article-item scf-article-item--block"
        href={getBlogLink(data)}>
        <div className="scf-article-item__img">
          <div className="scf-article-item__img-inner"><img src={frontmatter.thumbnail} alt=""/></div>
        </div>
        <div className="scf-article-item__content">
          <div className="scf-article-item__statistics">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
              3.3K ·
            </span>{frontmatter
              .authors
              .join(',')}
            · {frontmatter
              .date
              .slice(2, 10)}
            · 阅读大约需要{timeToRead}分钟</div>
          <div className="scf-article-item__title">
            <h4>{frontmatter.title}</h4>
          </div>
          <div className="scf-article-item__intro">
            {frontmatter.description}</div>
        </div>
      </a>
      */}
      <Box mt="40px" mb="40px" data-id="1jack">
        <Flex
          alignItems={['center', 'center', 'center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'flex-start']}
          flexDirection={['column', 'column', 'column', 'row']}>

          <BoxWithFlex
            width={[0.9, 0.9, 0.9, 0.65]}
            ml={[0, 0, 0, '30px']}
            data-id="1jack">
            <ColumnWithHeight alignItems="flex-end" justifyContent="space-between">
              <Box width={[1]}>
                <Box>
                  <InlineText color={theme.colors.gray[2]} fontSize={['12px', '14px']}>
                    <span className="scf-article-item__statistics-item">
                      <i className="scf-icon scf-icon-view"></i>
                    </span>

                    {frontmatter
                      .authors
                      .join(',')}
                    &nbsp;·&nbsp;{formateDate(frontmatter.date)}
                    &nbsp;·&nbsp;阅读大概需要{timeToRead}分钟 {frontmatter.categories && frontmatter.categories.length
                      ? `  归档于${frontmatter
                        .categories
                        .map(o => generateCategoryText(o))}`
                      : ''}
                  </InlineText>
                </Box>

                <Text
                  mt="20px"
                  mb="10px"
                  fontSize={['20px', '20px', '20px', '24px', '24px']}
                  fontWeight="bold">
                  {frontmatter.title}
                </Text>

                <Row mt="10px">
                  <Text lineHeight={1.75} fontSize={'16px'} mt="20px" mb="20px">
                    {frontmatter.description}
                  </Text>
                </Row>
              </Box>

              {/*<Button width="160px" p="0.4rem" fontSize="18px" theme={theme}>
                              阅读全文
                            </Button>*/}
            </ColumnWithHeight>
          </BoxWithFlex>
          <Background
            width={[0.9, 0.9, 0.9, 0.35]}
            height={[200]}
            background={`url(${JSON.stringify(frontmatter.thumbnail)})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"/>
        </Flex>
      </Box>
    </BlogDetailLink>
  )
}
