import * as React from 'react'
import {
  Box,
  Text,
  List,
  Image,
  ListItemWithNoStyleType,
} from '@src/components/atoms'
import { GraphqlCategoryResult } from '@src/types'
import { StaticQuery, graphql, Link } from 'gatsby'
import styled from 'styled-components'
import {
  height,
  lineHeight,
  HeightProps,
  LineHeightProps,
  MinHeightProps,
  minHeight,
} from 'styled-system'
import theme from '@src/constants/theme'
import categoryIconRed from '@src/assets/images/icon-category-red.png'
import categoryIcon from '@src/assets/images/icon-category.png'

const ListItemWithHeight = styled(ListItemWithNoStyleType)<
  HeightProps & LineHeightProps & MinHeightProps
>`
  ${height}
  ${lineHeight}
  ${minHeight}
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    transition: all 0.3s ease;
    margin-right: 5px;
  }

  .icon-category-red {
    display: none;
  }

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
`

export default function(props) {
  return (
    <StaticQuery
      query={graphql`
        query CategoryQuery {
          categorys: allMarkdownRemark {
            group(field: frontmatter___category) {
              totalCount
              category: fieldValue
            }
          }
        }
      `}
      render={({ categorys }: { categorys: GraphqlCategoryResult }) => {
        return (
          <Box mt="40px" width={[0.9, 0.9, 0.9, 0.22]} {...props}>
            <Text fontSize="18px" mb="30px" fontWeight="bold">
              分类
            </Text>

            <List>
              {categorys.group.map(category => (
                <Link
                  key={category.category}
                  to={`/category/${category.category}`}
                >
                  <ListItemWithHeight minHeight="40px" lineHeight="40px">
                    <Image
                      className="icon-category-red"
                      width="24px"
                      height="24px"
                      src={categoryIconRed}
                    />
                    <Image
                      className="icon-category"
                      width="24px"
                      height="24px"
                      src={categoryIcon}
                    />
                    {category.category}({category.totalCount})
                  </ListItemWithHeight>
                </Link>
              ))}
            </List>
          </Box>
        )
      }}
    />
  )
}
