import * as React from 'react'
import {Box, Row, Background, Container, Center} from '@src/components/atoms'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import './LatestBlogs.css'

type LatestBlog = Blog

let BlogSort = "DESC"

function changeSort() {
  BlogSort = "DESC"
}
function changeSortAgain() {
  BlogSort = "!DESC"
}
interface Props {
  blogs : LatestBlog[]
}

function BlogCard({blog} : {
  blog: Blog
}) {
  return (
    <Box className="scf-article-item scf-article-item--block">
      <Link to={blog.node.fields.slug}>
        <Box className="scf-article-item__img">
          <Box className="scf-article-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt=""/>
          </Box>
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__statistics">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
              13.3K</span>
            {blog.node.frontmatter.authors}
            · {blog
              .node
              .frontmatter
              .date
              .slice(2, 10)}
            · 阅读大约需要{parseInt((Math.random() * 4 + 4) + '', 10)}分钟</Box>
          <Box className="scf-article-item__title">
            <h4>{blog.node.frontmatter.title}</h4>
          </Box>
          <Box className="scf-article-item__intro">{blog.node.frontmatter.description}</Box>
        </Box>
      </Link>
    </Box>
  )
}

function HotBlogs() {
  return (
    <Box className="scf-box__body" id="scf-box-hot-blogs">
      <div class="Box-jLJQJw evQvdc scf-article-item scf-article-item--block">
        <a href="#">
          <div class="Box-jLJQJw evQvdc scf-article-item__img">
            <div class="Box-jLJQJw evQvdc scf-article-item__img-inner"><img src="https://img.serverlesscloud.cn/202032/1583158864577-wuhan_wechat6.jpg" alt="" /></div>
          </div>
          <div class="Box-jLJQJw evQvdc scf-article-item__content">
            <div class="Box-jLJQJw evQvdc scf-article-item__statistics"><span class="scf-article-item__statistics-item"><i class="scf-icon scf-icon-view"></i>13.3K</span>Serverless 中文网· 20-03-02· 阅读大约需要6分钟</div>
            <div class="Box-jLJQJw evQvdc scf-article-item__title"><h4>Hack for Wuhan，每一颗渺小的种子都能创造伟大的力量！</h4></div>
            <div class="Box-jLJQJw evQvdc scf-article-item__intro">疫情之下，我们都能贡献自己的力量！</div>
          </div>
        </a>
      </div>
      <div class="Box-jLJQJw evQvdc scf-article-item scf-article-item--block">
        <a href="#">
          <div class="Box-jLJQJw evQvdc scf-article-item__img">
            <div class="Box-jLJQJw evQvdc scf-article-item__img-inner"><img src="https://img.serverlesscloud.cn/202032/1583158864577-wuhan_wechat6.jpg" alt="" /></div>
          </div>
          <div class="Box-jLJQJw evQvdc scf-article-item__content">
            <div class="Box-jLJQJw evQvdc scf-article-item__statistics"><span class="scf-article-item__statistics-item"><i class="scf-icon scf-icon-view"></i>13.3K</span>Serverless 中文网· 20-03-02· 阅读大约需要6分钟</div>
            <div class="Box-jLJQJw evQvdc scf-article-item__title"><h4>Hack for Wuhan，每一颗渺小的种子都能创造伟大的力量！</h4></div>
            <div class="Box-jLJQJw evQvdc scf-article-item__intro">疫情之下，我们都能贡献自己的力量！</div>
          </div>
        </a>
      </div>
    </Box>
  )
}

function Blogs() {
  const query = graphql `query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } fileAbsolutePath fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({blogs} : {
      blogs: GraphqlBlogResult
    }) => {
      return (
        <Box className="scf-box__body" id="scf-box-lateat-blogs">
          {blogs
            .edges
            .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
        </Box>
      )
    }}/>
  )
}



export default function () {

  React.useEffect(() => {

    function sortFun() {
      return function(src, tar) {
          var v1 = Object.values(src)[0];
          var v2 = Object.values(tar)[0];
          if (v1 > v2) {
              return -1;
          }
          if (v1 < v2) {
              return 1;
          }
          return 0;
      };
    }

    const response = {
        "uuid": "1adc1096-5f5d-11ea-b031-0242cb007107",
        "error": false,
        "message": {
            "/blog/2020-03-02-hack-for-wuhan/": 2244,
            "/blog/2020-02-20-resource/": 3244,
            "/blog/2020-02-19-Serverless-base/": 1244,
        }
    }

    const hotBlogList = [];
    for (let k in response.message) {
      const item = {};
      item[k] = response.message[k];
      hotBlogList.push(item);
    }
    hotBlogList.sort(sortFun());

    let blogs = document.getElementById('scf-box-page-blog-top').children;
    let blogTabsBtn = document.getElementById('scf-blog-tab').children;

    console.log(blogs)
    const tabOnClick = function(n) {
      for (var i = 0; i < blogTabsBtn.length; ++i) {
        if (i != n) 
          blogTabsBtn[i].classList.remove('is-active');

      }
      blogTabsBtn[n].classList.add('is-active');
      for (var i = 1; i < blogs.length; ++i) {
        if (i != n + 1)
          blogs[i].style.display = 'none';
        else 
          blogs[i].style.display = 'block';
      }
    }

    for (var i = 0; i < blogTabsBtn.length; ++i) {
      (function (i){
        blogTabsBtn[i].onclick = function(){
          tabOnClick(i)
        };
      })(i)
    }
    
  });

  return (
    <Box className="scf-grid__item-16">
      <Box className="scf-grid__box">
        <Box className="scf-box scf-home-blog" id="scf-box-page-blog-top">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>博客</h3>
              <Box className="scf-box__header-segment" id="scf-blog-tab">
                <a className={`scf-box__header-segment-item is-active`}>最新</a>
                <a className={`scf-box__header-segment-item`}>最热</a>
              </Box>
            </Box>
            <Box className="scf-box__header-more">
              <Link to="/blog">
                更多博客 &gt;
              </Link>
            </Box>
          </Box>
          <Blogs/>
          <HotBlogs/>
        </Box>
      </Box>
    </Box>
  )
}