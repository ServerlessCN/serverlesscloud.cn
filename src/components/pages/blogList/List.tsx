import * as React from 'react'
import { Box } from '@src/components/atoms'
import BlogListItem from './ListItem'
import Pagination from './Pagination'
import { Blog } from '@src/types'
import { navigate } from 'gatsby'
import { WidthProps } from 'styled-system'

export default function({
  blogs,
  offset,
  limit,
  totalCount,
  generateDataUrl,
  ...rest
}: {
  blogs: Blog[]
  offset: number
  limit: number
  totalCount: number
  generateDataUrl: (pageNum: number) => string
} & WidthProps) {
  React.useEffect(() => {
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

    getBlogPv(function(error, response) {
      if (error || response.error) {
        console.log(error || response.error);
        return;
      }
      const bestList = document.getElementById('scf-best-practice').children;
      for (var i = 0; i < bestList.length; ++i) {
        const id = bestList[i].getAttribute('data-id');
        if (!id) continue;

        const statistics = bestList[i].getElementsByClassName('scf-article-item__statistics-item');
        if (!statistics) continue;
        const icon = statistics[0].getElementsByClassName('scf-icon');
        if (!icon) continue;
        let pv = response.message[id] || Math.ceil(Math.random() * 100);
        if (pv >= 1000) {
          pv = (pv / 1000).toFixed(1) + 'K';
        }
        icon[0].innerHTML = pv + '&nbsp;·&nbsp;';
      }
    });
  })

  return (
    <Box width={[0.9, 0.9, 0.9, 0.76]} {...rest}>
      <Box mx="auto" id="scf-best-practice">
        {blogs.map(blog => (
          <BlogListItem key={blog.node.id} data={blog}  />
        ))}
      </Box>

      <Pagination
        currentPage={Math.floor(offset / limit) + 1}
        totalCount={totalCount}
        pageSize={limit}
        onChange={(pageNum: number) => {
          const url = (generateDataUrl && generateDataUrl(pageNum)) || ''
          if (url === '') return
          navigate(url)
        }}
      />
    </Box>
  )
}
