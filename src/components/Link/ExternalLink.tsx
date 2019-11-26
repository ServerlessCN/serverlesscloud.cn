import * as React from 'react'

export default function({ to, children }: { to: string } & React.Props<any>) {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
