import * as React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Box, List, Text, ListItemWithNoStyleType } from '@src/components/atoms'
import styled from 'styled-components'
import { display, color, textAlign, TextAlignProps } from 'styled-system'
import { Link as InternalLink } from 'gatsby'
import ExternalLink from '../Link/ExternalLink'
import theme from '@src/constants/theme'
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

const BoxWithTextAlign = styled(Box)<TextAlignProps>`
  ${textAlign}
`

const navList: { title: string; link: string; isInternal?: boolean; event?: () => void }[] = [
  {
    title: '最佳实践',
    link: '/best-practice',
    isInternal: true,
    event: () => MtaH5.clickStat('bestpractice'),
  },
  {
    title: '组件',
    link: 'https://serverless.com/cn/components/',
    event: () => MtaH5.clickStat('component'),
  },
  {
    title: '文档',
    link: 'https://serverless.com/cn/framework/docs/',
    event: () => MtaH5.clickStat('doc'),
  },
  {
    title: '博客',
    link: '/blog',
    isInternal: true,
    event: () => MtaH5.clickStat('blog'),
  },
  {
    title: '资源',
    link: '/resource',
    isInternal: true,
    event: () => MtaH5.clickStat('resource'),
  },
  {
    title: '活动',
    link: '/meetup',
    isInternal: true,
    event: () => MtaH5.clickStat('meetup'),
  },
  {
    title: '课程',
    link: 'https://cloud.tencent.com/edu/paths/series/Serverless',
    isInternal: false,
    event: () => MtaH5.clickStat('course'),
  },
  {
    title: '关于',
    link: '/about',
    isInternal: true,
    event: () => MtaH5.clickStat('about'),
  },
]

interface Props {
  isActive: boolean
  isDesktopView: boolean
  searchList: []
}

interface State {
  searchVisible: boolean
  searchContnet: string
}

function Blogs(props) {
  const query = graphql`
    query {
      blogs: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 999999
        filter: { fileAbsolutePath: { regex: "/blog/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              thumbnail
              thumbnail
              authors
              description
              date
            }
            fileAbsolutePath
            fields {
              slug
            }
          }
        }
      }
      bests: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 999999
        filter: { fileAbsolutePath: { regex: "/best-practice/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              thumbnail
              thumbnail
              authors
              description
              date
            }
            fileAbsolutePath
            fields {
              slug
            }
          }
        }
      }
    }
  `
  return (
    <StaticQuery
      query={query}
      render={({ blogs, bests }: { blogs: any; bests: any }) => {
        const contentList = new Array()
        for (let i = 0; i < bests.edges.length; i++) {
          contentList.push(bests.edges[i])
        }
        for (let i = 0; i < blogs.edges.length; i++) {
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
                      return (
                        <li className="scf-header-search-result-list__item">
                          <a target="_blank" href={item.node.fields.slug} className="scf-header-search-result-list">
                            <p className="scf-header-search-result-list__item-title">{item.node.frontmatter.title}</p>
                            <p className="scf-header-search-result-list__item-info">
                              {item.node.frontmatter.description}
                            </p>
                          </a>
                        </li>
                      )
                    }
                  })
                })}
              </ul>
            </div>
          )
        }
      }}
    />
  )
}

export default class NavList extends React.Component<Props, State> {
  search: HTMLInputElement | null
  constructor(props) {
    super(props)
    this.state = {
      searchVisible: false,
      searchContnet: '',
    }
    this.search = null
  }

  changeSearch() {
    this.setState(
      {
        searchVisible: !this.state.searchVisible,
      },
      () => {
        if (this.search) {
          this.setState({
            searchContnet: this.search.value,
          })
        }
      }
    )
  }

  render() {
    if (typeof window !== 'undefined') {
      const { searchVisible, searchContnet } = this.state
      const { isActive, isDesktopView } = this.props
      const isMobileNavListDisplay = () => (isActive ? 'block' : 'none')

      const navListBoxWidth = isDesktopView ? 0.71 : 1
      return (
        <BoxWithTextAlign
          width={navListBoxWidth}
          bg={theme.colors.theme}
          className="scf-box-header-menu"
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
          <List p={0} mr={0} mb={0} style={{ position: 'relative', marginRight: 35 }}>
            {navList.map(({ title, link, isInternal, event }, index) => {
              const color = (window as any).location.pathname.includes(link)
                ? isDesktopView
                  ? '#000'
                  : '#0052D9'
                : '#333'
              const bold = (window as any).location.pathname.includes(link) && isDesktopView ? 'bold' : 'normal'
              const Link = isInternal ? InternalLink : ExternalLink
              return (
                <NavListItem
                  className="scf-header-nav_listItem"
                  onClick={() => {
                    if (link === '/') {
                      ;(window as any).MtaH5.clickStat('homelink')
                    }
                  }}
                  key={index}
                  display={['block', 'block', 'block', 'inline-block']}
                >
                  <Link to={link}>
                    <Box
                      className="scf-header-nav_item"
                      style={{ fontSize: 15, color: color, fontWeight: bold }}
                      onClick={() => event && event()}
                    >
                      {title}
                    </Box>
                  </Link>
                </NavListItem>
              )
            })}
          </List>
          {searchVisible ? (
            <div className="scf-header-search">
              <div className="scf-header-search__input-wrap" style={{ display: 'flex' }}>
                <button className="scf-header-search__search-btn">
                  <i className="scf-icon scf-icon-search-white"></i>
                </button>
                <input
                  ref={r => (this.search = r)}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({
                      searchContnet: e.target.value,
                    })
                  }}
                  type="text"
                  placeholder="搜索文章或关键词"
                  className="scf-header-search__input"
                />
                <button className="scf-header-search__clear-btn" onClick={() => this.changeSearch()}>
                  <i className="scf-icon scf-icon-clear"></i>
                </button>
                <Blogs value={searchContnet} />
              </div>
            </div>
          ) : (
            <Text
              className="scf-box-header-search-icon"
              color={theme.colors.gray_text}
              onClick={() => this.changeSearch()}
              style={{ fontSize: 15 }}
            >
              <i className="scf-icon scf-icon-search-white"></i>
            </Text>
          )}
        </BoxWithTextAlign>
      )
    } else {
      // if window does not exist

      return null
    }
  }
}
