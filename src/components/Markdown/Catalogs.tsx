import * as React from 'react'
import styled from 'styled-components'
import theme from '@src/constants/theme'
import {
  display,
  DisplayProps,
  position,
  PositionProps,
  top,
  right,
  TopProps,
  RightProps,
} from 'styled-system'
import { Text, Box } from '../atoms'
const Wrapper = styled(Box)<
  DisplayProps & PositionProps & TopProps & RightProps
>`
  ${position}
  ${top}
  ${right}
  .markdown-body ol,
  ul {
    list-style: disc;

    li {
      line-height: 2;
    }

    padding-left: 2em;
    a {
      color: ${theme.colors.black};

      transition: all 0.3s ease;

      &:hover {
        color: ${theme.colors.serverlessRed};
        text-decoration: none;
      }
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
    return `<ul>${data
      .map(o =>
        o.length
          ? `<li>${o.map(x => `${generateCatalogsHtml(x)}`).join('')}</li>`
          : `<li>${generateCatalogsHtml(o)}</li>`
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
        const catalogsHtml = generateCatalogsHtml(catalogsData)
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
      const windowScrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      if (windowScrollTop > eleScrollTop) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }
    document.addEventListener('scroll', onScroll)
    onScroll()
  }, [eleScrollTop])

  return (
    <Wrapper
      ref={eleRef}
      position={isFixed ? 'fixed' : 'relative'}
      top={0}
      mt="40px"
      display={['none', 'none', 'none', 'block', 'block']}
    >
      <Text fontSize="18px" mb="30px" fontWeight="bold">
        目录
      </Text>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: catalogHtml }}
      ></div>
    </Wrapper>
  )
}
