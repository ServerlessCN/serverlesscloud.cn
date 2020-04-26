import * as React from 'react'
import { Link } from 'gatsby'

interface Props extends React.Props<any> {
  tag: string
  // 是否自定义，是的话，渲染全靠children
  custom?: boolean
  preAddon?: string | JSX.Element
  postAddon?: string | JSX.Element
}

export const baseCategoryUrl = '/tags'


export default function({
  tag,
  preAddon,
  postAddon,
  custom,
  children,
}: Props) {
  if (custom) {
    return <Link to={`${baseCategoryUrl}/${tag}`}>{children}</Link>
  }

  return (
    <Link to={`${baseCategoryUrl}/${tag}`}>
      {preAddon}
      {tag}
      {postAddon}
    </Link>
  )
}
