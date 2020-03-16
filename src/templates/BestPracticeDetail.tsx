import * as React from 'react'
import {graphql} from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {Box, BackgroundProps, Text, InlineBlock} from '@src/components/atoms'
import {Blog, GraphqlBlogResult} from '@src/types'
import styled from 'styled-components'
import Markdown from '@src/components/Markdown'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import theme from '@src/constants/theme'
import Helmet from '@src/components/Helmet'
import {background} from 'styled-system'
import {formateDate} from '@src/utils'
import {display, DisplayProps, space, SpaceProps} from 'styled-system'
import ExternalLink from '@src/components/Link/ExternalLink'
import Activitys from '@src/components/pages/home/Activitys'
import CategoryLink from '@src/components/Link/CategoryLink'
import RecommandRead from '@src/components/pages/home/RecommandRead'
import crypto from 'crypto'

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
const LinkWrapper = styled.div < DisplayProps & SpaceProps > `
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
  data : {
    currentBlog: Blog['node'],
    previousBlog: Blog['node'],
    nextBlog: Blog['node'],
    recommendBlogs: GraphqlBlogResult
  }
  location : any
}

const BoxWithBackground = styled(Box) < BackgroundProps > `
  ${background}
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`

const BestPracticeDetail = ({
  data: {
    currentBlog,
    previousBlog,
    nextBlog,
    recommendBlogs
  },
  location
} : Props) => {
  currentBlog.frontmatter.categories = currentBlog.frontmatter.categories || []

  React.useEffect(() => {

    function reportPv(id, fn) {
      const data = {
        article: id
      }
      const api = 'https://service-hhbpj9e6-1253970226.gz.apigw.tencentcs.com/release/report/article';
      fetch(api, {
        body: JSON.stringify(data),
        method: 'POST'})
          .then((response) => response.json() )
          .then((response)=>{
        
            fn(null, response);
          })
          .catch((error)=>{
            fn(error, null);
      });
    }

    var md5 = crypto.createHash('md5');
    var id = md5.update(currentBlog.fields.slug).digest('hex');
    reportPv(id, function (error, response){
      if (error || response.error) {
        console.log(error || response.error);
      }
    })
  })
  return (
    <Layout>
      <Helmet {...currentBlog.frontmatter} location={location}/>
      <Box className="scf-content" style={{marginTop:0}}>
        <Box className="scf-page-blog-detail scf-layout-pattern">
          <Box className="scf-home-block">
            <Box className="scf-home-block__inner">
              <Box className="scf-detail">
                <Box className="scf-grid scf-detail__content">
                  <Box className="scf-grid__item-18">
                    <Box className="scf-grid__box">
                      <Box className="scf-detail__docs">
                        <h1 className="scf-detail-docs__title">{currentBlog.frontmatter.title}</h1>
                        <Box className="scf-detail-docs__info">
                          <Box>作者：{currentBlog
                              .frontmatter
                              .authors
                              .map((author, index) => (
                                <ExternalLinkWrapper key={author}>
                                  {currentBlog.frontmatter.authorslink && currentBlog.frontmatter.authorslink[index]
                                    ? (
                                      <ExternalLink to={currentBlog.frontmatter.authorslink[index]}>
                                        {author}
                                      </ExternalLink>
                                    )
                                    : (author)}
                                </ExternalLinkWrapper>
                              ))}</Box>
                          <Box>发布于： {formateDate(currentBlog.frontmatter.date)}</Box>
                          {currentBlog.frontmatter.categories && currentBlog.frontmatter.categories.length
                            ? <Box>归档于： {currentBlog
                                  .frontmatter
                                  .categories
                                  .map(o => (
                                    <LinkWrapper key={o} display="inline-block" ml="5px">
                                      <CategoryLink category={o}/>
                                    </LinkWrapper>
                                  ))}</Box>
                            : null}
                        </Box>
                        <Markdown html={currentBlog.html as string}></Markdown>
                      </Box>
                    </Box>
                  </Box>
                  <BlogCatalogs html={currentBlog.tableOfContents}/>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="scf-home-block">
            <Box className="scf-home-block__inner">
              <Box className="scf-grid">
                <RecommandRead/><Activitys/>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default BestPracticeDetail

export const query = graphql `
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

  query BestPracticeDetail(
    $blogId: String!
    $previousBlogId: String
    $nextBlogId: String
  ) {
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
