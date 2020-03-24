import * as React from 'react'

import {Link} from 'gatsby'
import {  Row } from '@src/components/atoms'
import './Logo.css'

interface Props {
  logoHeight : string
}

export default function ({logoHeight} : Props) {
  return (
    <Link to="/">
    <Row
        minWidth={['auto', 'auto', '280px']}
        alignItems="center"
        height={logoHeight}
      >
      <div className="scf-logo-wrap">
        <span className="scf-logo-zh"></span>
        <span className="scf-logo-wrap__text">中文网</span>
      </div>
      </Row>
    </Link>
  )
}
