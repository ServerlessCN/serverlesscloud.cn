import * as React from 'react'
import {Container, Box} from '@src/components/atoms'
import ExternalLink from '@src/components/Link/ExternalLink'
import ComponentCard from './ComponentCard'
import componentConfig from '@src/constants/componentConfig'

export default function () {
  React.useEffect(() => {
    function getComponentData(fn) {
      const api = 'https://serverless-components-info-1300862921.cos.ap-guangzhou.myqcloud.com/comp' +
          'onents-with-stats.json';
      fetch(api).then((response) => response.json()).then((response) => {

        fn(null, response);
      }).catch((error) => {
        fn(error, null);
      });
    }

    function findComponentByUrl(url, components) {
      for (var i = 0; i < components.length; ++i) {
        let names = components[i]
          .name
          .split('/');
        let name;
        if (names[0] != '@serverless') {
          name = components[i].name;
        } else {
          name = names[1];
        }

        if (url.indexOf(name) != -1) {
          return components[i];
        }
      }
    }

    getComponentData(function (error, response) {
      if (error) {
        console.log(error);
        return;
      }
      const componentDom = document.getElementById('scf-box-recommend-component');
      if (!componentDom) 
        return;
      
      const linkDom = componentDom.getElementsByTagName('A');
      for (var i = 0; i < linkDom.length; ++i) {
        const favs = linkDom[i].getElementsByClassName('scf-icon-favout');
        const down = linkDom[i].getElementsByClassName('scf-icon-download');
        const compData = findComponentByUrl(linkDom[i].getAttribute('href'), response);

        let start,
          download;
        if (compData.githubStars >= 1000) {
          start = (compData.githubStars / 1000).toFixed(1) + 'K';
        } else {
          start = compData.githubStars;
        }
        if (compData.npmDownloads >= 1000) {
          download = (compData.npmDownloads / 1000).toFixed(1) + 'K';
        } else {
          download = compData.npmDownloads;
        }

        if (favs) 
          favs[0].innerHTML = start;
        if (down) 
          down[0].innerHTML = download;
        }
      })
  })
  return (
    <Box className="scf-component-recommend">
      <Container
      width={[1, 1, 1, 912, 0.76, 1200]}
        px={0}
        pt={0}>
        <Box className="scf-box">
          <Box className="scf-box__header">
            <div className="scf-box__header-title">
              <h3>组件推荐</h3>
            </div>
            <div className="scf-box__header-more">
              <ExternalLink to="https://serverless.com/cn/components/">
                更多组件 &gt;
              </ExternalLink>
            </div>
          </Box>
          <Box className="scf-box__body" id="scf-box-recommend-component">
            <Box className="scf-grid">
              {componentConfig
                .slice(0, 3)
                .map(blog => (<ComponentCard key={blog.name} blog={blog}/>))}
            </Box>
            <Box className="scf-grid">
              {componentConfig
                .slice(3, 6)
                .map(blog => (<ComponentCard key={blog.name} blog={blog}/>))}
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  )
}
