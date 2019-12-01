import * as React from 'react'
import styled from 'styled-components'
import theme from '@src/constants/theme'

const Wrapper = styled.div`
  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }
`

export default function(props: { html: string }) {
  return (
    <Wrapper
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: props.html }}
    ></Wrapper>
  )
}
