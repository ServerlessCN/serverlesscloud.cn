import * as React from 'react'
import styled from 'styled-components'
import theme from '@src/constants/theme'
import { display, DisplayProps, position, PositionProps, top, right, TopProps, RightProps } from 'styled-system'
import { Box } from '../atoms'
import RightAd from '@src/components/RightAd/RightAd'

const Wrapper = styled(Box)<DisplayProps & PositionProps & TopProps & RightProps>`
  ${position}
  ${top}
  ${right}
    a {
      color: ${theme.colors.black};
      transition: all 0.3s ease;
      &:hover {
        color: ${theme.colors.serverlessRed};
        text-decoration: none;
      }
    }

  ${display}
`

function generateCatalogsData(ele: Element) {
  if (ele.tagName === 'P' || ele.tagName === 'A') {
    return ele
  }

  if (ele.tagName === 'LI' || ele.tagName === 'UL') {
    const length = ele.children.length
    const results: any[] = []

    if (
      ele.tagName === 'UL' &&
      length === 1 &&
      ele.children[0].tagName === 'LI' &&
      ele.children[0].children.length === 1 &&
      ele.children[0].children[0].tagName === 'UL'
    ) {
      return generateCatalogsData(ele.children[0].children[0])
    } else {
      for (let i = 0; i < length; i++) {
        results.push(generateCatalogsData(ele.children[i]))
      }
      return results
    }
  }
}

function generateCatalogsHtml(data: any) {
  if (data.length) {
    return `<ul class="scf-toc-list">${data
      .map(o =>
        o.length
          ? `<li class="scf-toc-list__item" key=${o}><span class="scf-toc-list__item-label">${o
              .map(x => `${generateCatalogsHtml(x)}`)
              .join('')}</span></li>`
          : `<li class="scf-toc-list__item has-sub-list" key=${o}><span class="scf-toc-list__item-label">${generateCatalogsHtml(
              o
            )}</span></li>`
      )
      .join('')}</ul>`
  }

  if (data.tagName === 'A' || data.tagName === 'P') {
    return data.outerHTML
  }
}

export default function(props: { html: string }) {
  const [eleScrollTop, setEleScrollTop] = React.useState<any>(undefined)
  const [isFixed, setIsFixed] = React.useState(false)
  const [catalogHtml, setCatalogHtml] = React.useState(props.html)

  const eleRef: any = React.useRef()
  React.useEffect(() => {
    const formatCatalogsHtml = function() {
      try {
        const ele = document.createElement('div')
        ele.innerHTML = props.html

        const catalogsData = generateCatalogsData(ele.children[0])
        const catalogsHtml = '<span class="scf-toc__title">目录</span>' + generateCatalogsHtml(catalogsData)
        setCatalogHtml(catalogsHtml)
      } catch (err) {
        setCatalogHtml(props.html)
      }
    }

    if (typeof eleScrollTop === 'undefined') {
      setEleScrollTop(eleRef.current.offsetTop)

      formatCatalogsHtml()
    }

    const onScroll = function() {
      const windowScrollTop = document.body.scrollTop || document.documentElement.scrollTop
      if (windowScrollTop > eleScrollTop + 200) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }
    document.addEventListener('scroll', onScroll)
    onScroll()
  }, [eleScrollTop])

  return (
    <Box className="scf-grid__item-8" ref={eleRef}>
      <Box className="scf-box scf-home-active" pb={20}>
        <div className="list-right">
          <RightAd />
        </div>
      </Box>
      <Wrapper
        className="scf-grid__box"
        ref={eleRef}
        // position={isFixed
        // ? 'fixed'
        // : 'relative'}
        // top={isFixed
        //   ? 20
        //   : 0}
        width={1}
        display={['none', 'none', 'none', 'block', 'block']}
      >
        <Box
          className="scf-toc"
          dangerouslySetInnerHTML={{
            __html: catalogHtml,
          }}
        ></Box>
      </Wrapper>
    </Box>
  )
}
