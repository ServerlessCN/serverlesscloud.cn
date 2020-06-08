import * as React from 'react'
import { Box } from '@src/components/atoms'
import { StaticQuery, graphql, Link } from 'gatsby'
import { Blog, GraphqlBlogResult } from '@src/types'
import { formateDate } from '@src/utils'
import { debounce } from '@src/utils'
import './Meetups.less'

type LatestBlog = Blog

interface Props {
  blogs: LatestBlog[]
}

function BlogCard({ history, blog }: { blog: Blog; history: boolean }) {
  return (
    <Box className="scf-meetup-item" key={blog.node.id}>
      <Link to={blog.node.fields.slug}>
        <div className="scf-meetup">
          <div className={!history ? 'scf-meetup_future scf-meetup_date' : 'scf-meetup_date'}>
            <p>{formateDate(blog.node.frontmatter.date, true, '.')}</p>
          </div>
          <div className="scf-meetup-content">
            <h5 title={blog.node.frontmatter.title}>{blog.node.frontmatter.title}</h5>
            <p title={blog.node.frontmatter.description}>{blog.node.frontmatter.description}</p>
            <div className="meetup-content_location">
              <i className="scf-icon scf-icon-map">{blog.node.frontmatter.location}</i>
            </div>
          </div>
        </div>
        <Box className="scf-meetup-item__img">
          <Box className="scf-meetup-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt={blog.node.frontmatter.title} />
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

function Meetups(Props) {
  const query = graphql`
    {
      meetups: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: ASC }
        filter: {
          fileAbsolutePath: { regex: "/blog/" }
          frontmatter: { categories: { in: "meetup" }, time: { in: "future" } }
        }
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
              location
            }
            fileAbsolutePath
            fields {
              slug
            }
          }
        }
      }
      historyMeetups: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          fileAbsolutePath: { regex: "/blog/" }
          frontmatter: { categories: { in: "meetup" }, time: { nin: "future" } }
        }
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
              location
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
      render={({ meetups, historyMeetups }: { meetups: GraphqlBlogResult; historyMeetups: GraphqlBlogResult }) => {
        return (
          <Box className="scf-meetup__body">
            <Box className="timeline">
              {Props.history
                ? historyMeetups.edges.map(blog => <BlogCard key={blog.node.id} blog={blog} {...Props} />)
                : meetups.edges.map(blog => <BlogCard key={blog.node.id} blog={blog} history={false} />)}
            </Box>
          </Box>
        )
      }}
    />
  )
}

export default function(Props) {
  const [isShowAll, setIsShowAll] = React.useState(false)

  React.useEffect(() => {
    setIsShowAll(false)
  }, [])

  const onToggleShow = () => {
    setIsShowAll(true)
  }
  return (
    <Box className="scf-grid__item-16">
      <Box className="">
        <Box className="scf-box scf-home-blog">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>近期活动</h3>
            </Box>
          </Box>
          <Meetups />
        </Box>
      </Box>
      <Box className={isShowAll ? 'showAll' : ''}>
        <Box className="scf-box scf-home-blog scf-meetup-history">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>往期活动</h3>
            </Box>
          </Box>
          <Meetups history={true} />
          {!isShowAll ? (
            <Box className="scf-detail__show-more">
              <Box className="scf-detail__mask"></Box>
              <button className="scf-btn scf-btn--line scf-meetup-btn" onClick={onToggleShow}>
                查看更多活动
              </button>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}
