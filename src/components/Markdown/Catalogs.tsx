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

export default function(props: { html: string }) {
  const [eleScrollTop, setEleScrollTop] = React.useState<any>(undefined)
  const [isFixed, setIsFixed] = React.useState(false)

  const eleRef: any = React.useRef()
  React.useEffect(() => {
    if (typeof eleScrollTop === 'undefined') {
      setEleScrollTop(eleRef.current.offsetTop)
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
        dangerouslySetInnerHTML={{ __html: props.html }}
      ></div>
    </Wrapper>
  )
}
