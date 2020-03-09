import * as React from 'react'
import { StaticQuery, useStaticQuery, graphql } from 'gatsby'
import { Box, List, Text, ListItemWithNoStyleType } from '@src/components/atoms'
import styled from 'styled-components'
import { display, color, textAlign, TextAlignProps } from 'styled-system'
import { Link as InternalLink } from 'gatsby'
import ExternalLink from '../Link/ExternalLink'
import theme from '@src/constants/theme'
import { requestBlogs } from '@src/utils'
import { getSearch } from '@src/utils/search'

const NavListItem = styled(ListItemWithNoStyleType)`
  ${display}
  ${color}

  div {
    transition: all 0.3s ease;
    padding: 0 20px;
    font-size: 15px;
  }

  &:hover {
    div {
      color: ${theme.colors.white};
    }
  }
`

const BoxWithTextAlign = styled(Box) <TextAlignProps>`
  ${textAlign}
`

const navList: { title: string; link: string; isInternal?: boolean }[] = [
  {
    title: '最佳实践',
    link: '/best-practice',
    isInternal: true,
  },
  {
    title: '组件',
    link: 'https://serverless.com/cn/components/',
  },
  {
    title: '文档',
    link: 'https://serverless.com/cn/framework/docs/',
  },
  {
    title: '博客',
    link: '/blog',
    isInternal: true,
  },
  {
    title: '资源',
    link: '/resource',
    isInternal: true,
  },
  {
    title: '论坛',
    link: '/forum',
    isInternal: true,
  },
  {
    title: '关于',
    link: '/about',
    isInternal: true,
  },
]

interface Props {
  isActive: boolean
  isDesktopView: boolean,
  searchList: []
}

interface State {
  searchVisible: boolean,
  searchContnet: string,
}

function Blogs(props) {

  // const query = graphql`query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 999999 filter: { fileAbsolutePath: { regex: "//best-practice// | //blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  // authors description date } fileAbsolutePath fields { slug } } } } } `
  const query = graphql`query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 999999 filter: { fileAbsolutePath: { regex: "//blog//" } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } fileAbsolutePath fields { slug } } } }, bests: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 999999 filter: { fileAbsolutePath: { regex: "//best-practice//" } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } fileAbsolutePath fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({ blogs, bests }: {
        blogs: any,
        bests: any
      }) => {
        const contentList = new Array()
        for(let i =0;i<bests.edges.length;i++){
          contentList.push(bests.edges[i])
        }
        for(let i =0;i<blogs.edges.length;i++){
          contentList.push(blogs.edges[i])
        }
        let searchKeys = getSearch(props.value || '', contentList, ['Serverless Framework'])
        if (searchKeys.length > 0) {
          return (
            <div className="scf-header-search__panel">
              <ul className="scf-header-search-result-list">
                {contentList.map((item, index) => {
                  return searchKeys.map((itemSearchKey, indexSearchKey) => {
                    if (item.node.id == itemSearchKey) {
                      console.log(item)
                      return (
                        <li className="scf-header-search-result-list__item">
                          <a target="_blank" href={item.node.fields.slug} className="scf-header-search-result-list">
                            <p className="scf-header-search-result-list__item-title">{item.node.frontmatter.title}</p>
                            <p
                              className="scf-header-search-result-list__item-info">{item.node.frontmatter.description}</p>
                          </a>
                        </li>
                      )
                    }
                  })
                })
                }
              </ul>
            </div>
          )
        }
      }}
    />
  )
}


export default class NavList extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      searchVisible: false,
      searchContnet: '',
    }
    this.search = null
  }

  changeSearch() {
    this.setState({
      searchVisible: !this.state.searchVisible,
    }, () => {
      if (this.search) {
        this.setState({
          searchContnet: this.search.value,
        })
      }
    })
  }

  render() {
    const { searchVisible, searchContnet } = this.state
    const { isActive, isDesktopView } = this.props
    const isMobileNavListDisplay = () => (isActive ? 'block' : 'none')

    console.log(this)

    const navListBoxWidth = isDesktopView ? 0.6 : 1
    return (
      <BoxWithTextAlign
        width={navListBoxWidth}
        bg={theme.colors.black}
        display={[
          isMobileNavListDisplay(),
          isMobileNavListDisplay(),
          isMobileNavListDisplay(),
          'block',
          'block',
          'block',
          'block',
        ]}
        textAlign={isDesktopView ? 'right' : 'left'}
      >

        <List p={0} mr={0} mb={0}>
          {navList.map(({ title, link, isInternal }, index) => {
            const Link = isInternal
              ? InternalLink
              : ExternalLink
            return (
              <NavListItem
                onClick={() => {
                  if (link === '/') {
                    ;(window as any).MtaH5.clickStat('homelink')
                  }
                }}
                key={index}
                display={['block', 'block', 'block', 'inline-block']}
              >
                <Link to={link}>
                  <Text color={theme.colors.gray_text} style={{ fontSize: 15 }}>{title}</Text>
                </Link>
              </NavListItem>
            )
          })}
          {searchVisible ?
            <div className="scf-header-search">
              <div className="scf-header-search__input-wrap" style={{ display: 'flex' }}>
                <button className="scf-header-search__search-btn"><i className="scf-icon scf-icon-search-white"></i>
                </button>
                <input ref={(r) => this.search = r} onInput={(e) => {
                  console.log(e.target.value)
                  this.setState({
                    searchContnet: e.target.value,
                  })
                }} type="text" placeholder="搜索文章或关键词" className="scf-header-search__input"/>
                <button className="scf-header-search__clear-btn" onClick={() => this.changeSearch()}><i
                  className="scf-icon scf-icon-clear"></i></button>
                <Blogs value={searchContnet}/>
              </div>
            </div>
            :
            <NavListItem
              key={'search'}
              display={['block', 'block', 'block', 'inline-block']}
              onClick={() => this.changeSearch()}
            >
              <Text color={theme.colors.gray_text} style={{ fontSize: 15 }}><i
                className="scf-icon scf-icon-search-white"></i></Text>
            </NavListItem>}

        </List>
      </BoxWithTextAlign>
    )
  }
}


{/* <StaticQuery
              query={graphql`
              query blogs($offset: Int!, $limit: Int!) {
                blogs: allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC }
                  filter: {
                    frontmatter: { date: { ne: null } }
                    fileAbsolutePath: { regex: "//blog//" }
                  }
                  skip: $offset
                  limit: $limit
                ) {
                  edges {
                    node {
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
                      timeToRead
                      fileAbsolutePath
                      fields {
                        slug
                      }
                    }
                  }
                  totalCount
                }
              }
              ` }
              render={data => {
                console.log(data, 9999)
                return (
                  <div className="scf-header-search">
                    <div className="scf-header-search__input-wrap" style={{ display: 'flex' }}>
                      <button className="scf-header-search__search-btn"><i className="scf-icon scf-icon-search-white"></i></button>
                      <input type="text" placeholder="搜索文章或关键词" className="scf-header-search__input" />
                      <button className="scf-header-search__clear-btn" onClick={() => this.changeSearch()}><i className="scf-icon scf-icon-clear"></i></button>
                      <div className="scf-header-search__panel">
                        <ul className="scf-header-search-result-list">
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.36: Bug fixes and quality of life inprovements for all!</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36 release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36 release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                          <li className="scf-header-search-result-list__item">
                            <p className="scf-header-search-result-list__item-title">Serverless Framework v1.45.0 - ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names &amp; More</p>
                            <p className="scf-header-search-result-list__item-info">Check out the latest Serverless Framework v1.36release, bug fixes and quality of life improvements for all!</p></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              }}
            /> */
}
