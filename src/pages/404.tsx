import * as React from 'react'

import Helmet from '@src/components/Helmet'

const NotFoundPage = props => (
  <div>
    <Helmet title="404 Page Not Found" location={props.location} />
    <h1>404 Page Not Found</h1>
  </div>
)

export default NotFoundPage
