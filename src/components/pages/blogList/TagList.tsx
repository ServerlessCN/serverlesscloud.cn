import * as React from 'react'
import { Box, Container } from '@src/components/atoms'
import { GraphqlTagResult } from '@src/types'
import { StaticQuery, graphql } from 'gatsby'
import { Link } from 'gatsby'

export const baseCategoryUrl = '/tags'

export default function(props) {
  return (
    <StaticQuery
      query={graphql`
        query TagsQuery {
          tags: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/blog|best-practice/" } }
          ) {
            group(field: frontmatter___tags) {
              totalCount
              tags: fieldValue
            }
          }
        }
      `}
      render={({ tags }: { tags: GraphqlTagResult }) => {
        return (
          <Box
            className={
              'scf-blog-header ' +
              (props.isDetail ? 'scf-blog-detail-header' : '')
            }
            {...props}
          >
            <Container
              className="scf-box-blog-tabs"
              width={[1, 1, 1, 912, 0.76, 1200]}
              px={0}
            >
              <Box className="scf-segment">
                <span
                  className="scf-segment__item"
                  style={{ paddingRight: '0px' }}
                >
                  标签：
                </span>
                {tags.group.map(tag => (
                  <Link to={`${baseCategoryUrl}/${tag.tags}`} key={tag.tags}>
                    <span
                      key={tag.tags}
                      className={
                        'scf-segment__item scf-tag__item ' +
                        ([
                          `${baseCategoryUrl}/${tag.tags}`,
                          `${baseCategoryUrl}/${tag.tags}/`,
                        ].includes(decodeURIComponent(props.location.pathname))
                          ? 'is-active'
                          : '')
                      }
                    >
                      {tag.tags}
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
