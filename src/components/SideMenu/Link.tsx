import * as React from 'react'
import * as classnames from 'classnames'
import { Link as GatsbyLink } from 'gatsby'

interface Props extends React.Props<any> {
  className: string
  classNameActive: string
  classNameHasActiveChild: string
  active: boolean
  hasActiveChild: boolean
  to: string
  externalLink?: boolean
  hasSubMenu: boolean
  toggleSubMenu: () => any
  activateMe: () => any
}

const Link = ({
  className,
  classNameActive,
  classNameHasActiveChild,
  active,
  hasActiveChild,
  to,
  externalLink,
  hasSubMenu,
  toggleSubMenu,
  activateMe,
  children,
}: Props) => {
  to = to || '#'

  const _toggleSubMenu = e => {
    if (to === '#') {
      e.preventDefault()
    }

    toggleSubMenu()
  }

  return (
    <GatsbyLink
      className={classnames(
        className,
        active && classNameActive,
        hasActiveChild && classNameHasActiveChild
      )}
      to={to}
      onClick={hasSubMenu ? _toggleSubMenu : activateMe}
      target={externalLink ? '_blank' : undefined}
    >
      {children}
    </GatsbyLink>
  )
}

export default Link
