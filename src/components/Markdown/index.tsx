import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  ul {
    list-style: disc;

    li {
      line-height: 2;
    }
  }

  ol {
    list-style: decimal;
  }

  p {
    line-height: 2;
  }

  img {
    display: block;
    margin: 20px auto;
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
