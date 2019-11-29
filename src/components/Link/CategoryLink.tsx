import * as React from 'react'
import { Link } from 'gatsby'
import { categoryCnMap } from '@src/constants/categoryCnMap'

interface Props extends React.Props<any> {
  // 目录英文名
  category: string
  // 是否自定义，是的话，渲染全靠children
  custom?: boolean
  preAddon?: string | JSX.Element
  postAddon?: string | JSX.Element
}

export const baseCategoryUrl = '/category'

export function generateCategoryText(category: string) {
  return categoryCnMap[category] || category
}

export default function({
  category,
  preAddon,
  postAddon,
  custom,
  children,
}: Props) {
  if (custom) {
    return <Link to={`${baseCategoryUrl}/${category}`}>{children}</Link>
  }

  return (
    <Link to={`${baseCategoryUrl}/${category}`}>
      {preAddon}
      {generateCategoryText(category)}
      {postAddon}
    </Link>
  )
}
