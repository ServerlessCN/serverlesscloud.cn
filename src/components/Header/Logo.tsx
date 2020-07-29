import * as React from 'react'

import { Link } from 'gatsby'
import { Row } from '@src/components/atoms'
import './Logo.css'
import logoImage from '../../assets/images/logo.svg'

interface Props {
  logoHeight: string
}

export default function({ logoHeight }: Props) {
  return (
    <Link to="/" style={{ zIndex: 999 }}>
      <Row minWidth={['auto', 'auto', '210px']} alignItems="center" height={logoHeight}>
        <div className="scf-logo-wrap">
          <img className="logo-image" src={logoImage} />
        </div>
      </Row>
    </Link>
  )
}
