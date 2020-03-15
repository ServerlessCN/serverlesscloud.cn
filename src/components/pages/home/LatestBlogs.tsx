import * as React from 'react'
import {Box, Row, Background, Container, Center} from '@src/components/atoms'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import './LatestBlogs.css'
import BlogLists from '@src/constants/blog.json'

type LatestBlog = Blog

interface Props {
  blogs : LatestBlog[]
}

function BlogCard({blog} : {
  blog: Blog
}) {
  return (
    <Box className="scf-article-item scf-article-item--block">
      <Link to={blog.node.fields.slug} data-id={blog.node.id}>
        <Box className="scf-article-item__img">
          <Box className="scf-article-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt=""/>
          </Box>
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__statistics">
            <span className="scf-blog-item-pv-icon">
              <i className="scf-icon scf-icon-view"></i>
              </span>
            {blog.node.frontmatter.authors}
            · {blog
              .node
              .frontmatter
              .date
              .slice(2, 10)}
            <span className='scf-article-item__statistics__timeToRead'>· 阅读大约需要{blog.node.timeToRead}分钟</span></Box>
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
      loading...
    </Box>
  )
}

function Blogs() {
  const query = graphql `query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } timeToRead fileAbsolutePath fields { slug } } } } } `
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

    
    const blogHash = {};
    for (var i = 0; i < BlogLists.length; ++i) {
      const item = BlogLists[i].node;
      blogHash[item.id] = item;
    }


    function getBlogPv(fn) {
      const api = 'https://service-hhbpj9e6-1253970226.gz.apigw.tencentcs.com/release/get/article?env=test';
      fetch(api)
          .then((response) => response.json() )
          .then((response)=>{
        
            fn(null, response);
          })
          .catch((error)=>{
            fn(error, null);
          });
    }


    function buildHotBlogBody(hotBlogList, blogHash) {
      const temp = '<div class="Box-jLJQJw evQvdc scf-article-item scf-article-item--block"> \
        <a href="{LINK}"> \
          <div class="Box-jLJQJw evQvdc scf-article-item__img"> \
            <div class="Box-jLJQJw evQvdc scf-article-item__img-inner"><img src="{IMG}" alt="" /></div> \
          </div> \
          <div class="Box-jLJQJw evQvdc scf-article-item__content"> \
            <div class="Box-jLJQJw evQvdc scf-article-item__statistics"><span class="scf-blog-item-pv-icon"><i class="scf-icon scf-icon-view"></i></span>{PV} · {AUTHOR} · {DATE}<span class="scf-article-item__statistics__timeToRead"> · 阅读大约需要{READTIME}分钟</span></div>\
            <div class="Box-jLJQJw evQvdc scf-article-item__title"><h4>{TITLE}</h4></div>\
            <div class="Box-jLJQJw evQvdc scf-article-item__intro">{DESC}</div>\
          </div>\
        </a>\
      </div>';

      let htmlBody = '';
      let n = 6;
      for (var i = 0; i < hotBlogList.length && n > 0; i++) {
        const id = Object.keys(hotBlogList[i])[0];
        let pv;
        if (Object.values(hotBlogList[i])[0] < 1000) {
          pv = Object.values(hotBlogList[i])[0];
        } else {
          pv = Object.values(hotBlogList[i])[0] / 1000;
          pv = pv.toFixed(1) + 'K';
        }
        const blogItem = blogHash[id];
        if (!blogItem) 
          continue;

        const buildBody = temp.replace('{LINK}', blogItem.fields.slug)
          .replace('{IMG}', blogItem.frontmatter.thumbnail)
          .replace('{PV}', pv)
          .replace('{AUTHOR}', blogItem.frontmatter.authors.join(','))
          .replace('{READTIME}', blogItem.timeToRead)
          .replace('{DATE}', blogItem.frontmatter.date.substr(0, 10))
          .replace('{TITLE}', blogItem.frontmatter.title)
          .replace('{DESC}', blogItem.frontmatter.description);
        htmlBody += buildBody;
        n--;
      }
      return htmlBody;
    }


    function updateLatestBlogPv(blogPvs) {
      const latestBlogChilds = document.getElementById('scf-box-lateat-blogs').children;

      for (var i = 0; i < latestBlogChilds.length; ++i) {
        const id = latestBlogChilds[i].children ? latestBlogChilds[i].children[0].getAttribute('data-id') : null;
        if (!id) continue;
        let pv = blogPvs[id];
        if (!pv) {
          pv = Math.ceil(Math.random() * 100);
        }

        if (!latestBlogChilds[i].children[0].children[1] || !latestBlogChilds[i].children[0].children[1].children[0]) continue;

        const titleDom = latestBlogChilds[i].children[0].children[1].children[0];
        const oldHtml = titleDom.innerHTML;
        const idx = oldHtml.indexOf('</span>');
        const text = oldHtml.substr(idx + 7);
        const html = oldHtml.substr(0, idx + 7);

        if (text && html) {
          let newHtml;
          if (pv < 1000) {
            newHtml = html + pv + ' · ' + text;
          } else {
            newHtml = html + (pv/1000).toFixed(1) + 'K · ' + text;
          }
          titleDom.innerHTML = newHtml;
        }
      }
    }

    function updateHomeBest(blogPvs) {
      const bestList = document.getElementById('scf-box-home-best-practices');
      const links = bestList.getElementsByTagName('A');

      for (var i = 0; i < links.length; ++i) {
        const id = links[i].getAttribute('data-id');
        if (!id) continue;
        let pv = blogPvs[id] || Math.ceil(Math.random() * 100);
        if (pv >= 1000) {
          pv = (pv/1000).toFixed(1) + 'K';
        }
        const icons = links[i].getElementsByClassName('scf-icon');
        if (!icons) continue;
        icons[0].innerHTML = pv;
      }
    }

    getBlogPv(function(error, response) {
      if (error || response.error) {
        console.log(error || response.error);
        return;
      }
      const hotBlogList = [];
      for (let k in response.message) {
        const item = {};
        item[k] = response.message[k];
        hotBlogList.push(item);
      }
      hotBlogList.sort(sortFun());

      updateLatestBlogPv(response.message);
      updateHomeBest(response.message);

      let hotBlogs = document.getElementById('scf-box-hot-blogs');
      hotBlogs.innerHTML = buildHotBlogBody(hotBlogList, blogHash);
    })
    

    let blogs = document.getElementById('scf-box-page-blog-top').children;
    let blogTabsBtn = document.getElementById('scf-blog-tab').children;
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