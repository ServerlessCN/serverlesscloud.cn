import * as React from 'react'
import {
  Box,
  Text,
  List,
  Image,
  ListItemWithNoStyleType,
} from '@src/components/atoms'
import { GraphqlCategoryResult } from '@src/types'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import { HeightProps, LineHeightProps, MinHeightProps } from 'styled-system'
import theme from '@src/constants/theme'
import CategoryLink from '@src/components/Link/CategoryLink'
import categoryIconRed from '@src/assets/images/icon-category-red.png'
import categoryIcon from '@src/assets/images/icon-category.png'

const LinkWrapper = styled(ListItemWithNoStyleType)<
  HeightProps & LineHeightProps & MinHeightProps
>`
  img {
    margin-right: 5px;
  }
  a {
    min-height: 40px;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    world-break: break-all;
    word-wrap: break-word;

    &:hover {
      color: ${theme.colors.serverlessRed};

      .icon-category-red {
        display: inline-block;
      }

      .icon-category {
        display: none;
      }
    }
  }

  .icon-category-red {
    display: none;
  }
`

export default function(props) {
  return (
    <StaticQuery
      query={graphql`
        query CategoryQuery {
          categorys: allMarkdownRemark {
            group(field: frontmatter___categories) {
              totalCount
              categories: fieldValue
            }
          }
        }
      `}
      render={({ categorys }: { categorys: GraphqlCategoryResult }) => {
        return (
          <Box mt="40px" mb="20px" width={[0.9, 0.9, 0.9, 0.22]} {...props}>
            <Text fontSize="18px" mb="30px" fontWeight="bold">
              分类
            </Text>

            <List>
              {categorys.group.map(category => (
                <LinkWrapper key={category.categories}>
                  <CategoryLink
                    preAddon={
                      <>
                        <Image
                          className="icon-category-red"
                          width="24px"
                          height="24px"
                          alt="categoryIconRed"
                          src={categoryIconRed}
                        />
                        <Image
                          className="icon-category"
                          width="24px"
                          height="24px"
                          alt="categoryIcon"
                          src={categoryIcon}
                        />
                      </>
                    }
                    postAddon={`(${category.totalCount})`}
                    key={category.categories}
                    category={category.categories}
                  />
                </LinkWrapper>
              ))}
            </List>
          </Box>
        )
      }}
    />
  )
}
