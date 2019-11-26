import * as React from 'react'
import styled from 'styled-components'
import theme from '@src/constants/theme'

const Wrapper = styled.div`
  .markdown-body ol,
  ul {
    list-style: disc;
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
