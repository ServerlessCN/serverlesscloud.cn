import * as React from 'react'
import { Box, Container } from '@src/components/atoms'
import { GraphqlCategoryResult } from '@src/types'
import { StaticQuery, graphql } from 'gatsby'
import { Link } from 'gatsby'
import { categoryCnMap } from '@src/constants/categoryCnMap'

export const baseCategoryUrl = '/category'
export function generateCategoryText(category: string) {
  return categoryCnMap[category] || category
}

export default function(props) {
  const matchPath = props.location.pathname.replace(/\/page\/\d+/, '')
  return (
    <StaticQuery
      query={graphql`
        query CategoryQuery {
          categorys: allMarkdownRemark(
            filter: {
              frontmatter: { categories: { nin: ["best-practice", "guides-and-tutorials"] } }
              fileAbsolutePath: { regex: "/blog/" }
            }
          ) {
            group(field: frontmatter___categories) {
              totalCount
              categories: fieldValue
            }
          }
        }
      `}
      render={({ categorys }: { categorys: GraphqlCategoryResult }) => {
        // @ts-ignore
        const TotalCount = categorys.group.reduce(function(a, b) {
          if (typeof a === 'number') return a + b.totalCount
          return a.totalCount + b.totalCount
        })
        return (
          <Box className={'scf-blog-header ' + (props.isDetail ? 'scf-blog-detail-header' : '')} {...props}>
            <Container className="scf-box-blog-tabs" width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <Box className="scf-segment">
                <Link to={`blog`}>
                  <span className={'scf-segment__item ' + (['/blog/', '/blog'].includes(matchPath) ? 'is-active' : '')}>
                    所有（{TotalCount}）
                  </span>
                </Link>
                {categorys.group.map(category => (
                  <Link to={`${baseCategoryUrl}/${category.categories}`} key={category.categories}>
                    <span
                      key={category.categories}
                      className={
                        'scf-segment__item ' +
                        ([
                          `${baseCategoryUrl}/${category.categories}`,
                          `${baseCategoryUrl}/${category.categories}/`,
                        ].includes(matchPath)
                          ? 'is-active'
                          : '')
                      }
                    >
                      {generateCategoryText(category.categories)}（{category.totalCount}）
                    </span>
                  </Link>
                ))}
              </Box>
            </Container>
          </Box>
        )
      }}
    />
  )
}
