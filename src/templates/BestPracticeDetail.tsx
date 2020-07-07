import * as React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Box, InlineBlock, Container } from '@src/components/atoms'
import { Blog, GraphqlBlogResult } from '@src/types'
import styled from 'styled-components'
import Markdown from '@src/components/Markdown'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import theme from '@src/constants/theme'
import Helmet from '@src/components/Helmet'
import { fitPromote, formateDate } from '@src/utils'
import userBehaviorStatistics from '@src/utils/statistics'
import { display, DisplayProps, space, SpaceProps } from 'styled-system'
import ExternalLink from '@src/components/Link/ExternalLink'
import Activitys from '@src/components/pages/home/Activitys'
import CategoryLink from '@src/components/Link/CategoryLink'
import RecommandRead from '@src/components/pages/home/RecommandRead'
import crypto from 'crypto'
import { debounce } from '@src/utils'
import { v4 as uuidv4 } from 'uuid'

const baseCategoryUrl = '/tags'

const ExternalLinkWrapper = styled(InlineBlock)`
  margin-left: 5px;

  a {
    transition: all 0.3s ease;
  }
  &:hover {
    a {
      color: ${theme.colors.serverlessRed};
    }
  }
`
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
  data: {
    currentBlog: Blog['node']
    previousBlog: Blog['node']
    nextBlog: Blog['node']
    recommendBlogs: GraphqlBlogResult
  }
  location: any
}

const BestPracticeDetail = ({ data: { currentBlog }, location }: Props) => {
  currentBlog.frontmatter.categories = currentBlog.frontmatter.categories || []

  const [uuid, setUuid] = React.useState(uuidv4())

  React.useEffect(() => {
    fitPromote()
    var md5 = crypto.createHash('md5')
    var id = md5.update(currentBlog.fields.slug).digest('hex')

    userBehaviorStatistics({
      dataType: 'startViewPage',
      acticleType: 1,
      uuid,
      acticleId: id,
      acticleTitle: currentBlog.frontmatter.title,
    })
    function isInViewPort(el) {
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      if (!el) return false
      const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
      return top <= viewPortHeight + 100
    }
    const onScroll = debounce(() => {
      const isShowCode = isInViewPort(document.getElementsByTagName('code')[0])
      const isEndViewPage = isInViewPort(document.getElementById('EndBlogDetail'))
      if (isShowCode) {
        userBehaviorStatistics({ dataType: 'startViewCode', uuid })
      }
      if (isEndViewPage) {
        userBehaviorStatistics({ dataType: 'endViewPage', uuid })
      }
    }, 50)
    const onCopy = el => {
      if (el.target.tagName === 'CODE') {
        userBehaviorStatistics({ dataType: 'copyCode', uuid })
      }
    }

    document.addEventListener('copy', onCopy)
    document.addEventListener('scroll', onScroll)
    function reportPv(id, fn) {
      const data = {
        article: id,
      }
      const api = 'https://service-94w2imn4-1300862921.gz.apigw.tencentcs.com/release/report/article'
      fetch(api, {
        body: JSON.stringify(data),
        method: 'POST',
      })
        .then(response => response.json())
        .then(response => {
          fn(null, response)
        })
        .catch(error => {
          fn(error, null)
        })
    }

    reportPv(id, function(error, response) {
      if (error || response.error) {
        console.log(error || response.error)
      }
    })

    const copyButtonList = document.getElementsByClassName('gatsby-code-button')
    for (var i = 0; i < copyButtonList.length; ++i) {
      ;(function(i) {
        const button: HTMLButtonElement = copyButtonList[i] as HTMLButtonElement
        button.onclick = function() {
          userBehaviorStatistics({ dataType: 'copyCode', uuid })
        }
      })(i)
    }

    return () => {
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('scroll', onScroll)
    }
  }, [uuid])
  return (
    <Layout>
      <Helmet {...currentBlog.frontmatter} location={location} />
      <Box className="scf-content" style={{ marginTop: 0 }}>
        <Box className="scf-page-blog-detail scf-layout-pattern">
          <Box className="scf-home-block">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <Box className="scf-detail">
                <Box className="scf-grid">
                  <Box className="scf-grid__item-16">
                    <Box className="scf-grid__box  scf-detail__content">
                      <Box className="scf-detail__docs">
                        <h1 className="scf-detail-docs__title">{currentBlog.frontmatter.title}</h1>
                        <Box className="scf-detail-docs__info">
                          <Box>
                            作者：
                            {currentBlog.frontmatter.authors.map((author, index) => (
                              <ExternalLinkWrapper key={author}>
                                {currentBlog.frontmatter.authorslink && currentBlog.frontmatter.authorslink[index] ? (
                                  <ExternalLink to={currentBlog.frontmatter.authorslink[index]}>{author}</ExternalLink>
                                ) : (
                                  author
                                )}
                              </ExternalLinkWrapper>
                            ))}
                          </Box>
                          <Box>发布于： {formateDate(currentBlog.frontmatter.date)}</Box>
                          {currentBlog.frontmatter.categories && currentBlog.frontmatter.categories.length ? (
                            <Box>
                              归档于：{' '}
                              {currentBlog.frontmatter.categories.map(o => (
                                <LinkWrapper key={o} display="inline-block" ml="5px">
                                  <CategoryLink category={o} />
                                </LinkWrapper>
                              ))}
                            </Box>
                          ) : null}
                          {currentBlog.frontmatter.tags && currentBlog.frontmatter.tags.length ? (
                            <p>
                              标签：
                              {currentBlog.frontmatter.tags.map(tag => (
                                <Link to={`${baseCategoryUrl}/${tag}`} key={tag}>
                                  <span className="scf-seotag__item" key={tag}>
                                    {tag}
                                  </span>
                                </Link>
                              ))}
                            </p>
                          ) : null}
                        </Box>
                        <Markdown html={currentBlog.html as string}></Markdown>
                      </Box>
                    </Box>
                  </Box>
                  <BlogCatalogs html={currentBlog.tableOfContents} />
                </Box>
              </Box>
            </Container>
            <div id="EndBlogDetail" />
          </Box>
          <Box className="scf-home-block">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <Box className="scf-grid">
                <RecommandRead />
                <Activitys />
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default BestPracticeDetail

export const query = graphql`
  fragment blogFields on MarkdownRemark {
    id
    frontmatter {
      thumbnail
      authors
      categories
      date
      title
      description
      authorslink
      translators
      translatorslink
      tags
    }
    wordCount {
      words
      sentences
      paragraphs
    }
    fileAbsolutePath
    fields {
      slug
    }
  }

  query BestPracticeDetail($blogId: String!, $previousBlogId: String, $nextBlogId: String) {
    currentBlog: markdownRemark(id: { eq: $blogId }) {
      ...blogFields
      html
      tableOfContents(pathToSlugField: "fields.slug")
    }

    previousBlog: markdownRemark(id: { eq: $previousBlogId }) {
      ...blogFields
    }

    nextBlog: markdownRemark(id: { eq: $nextBlogId }) {
      ...blogFields
    }
  }
`
