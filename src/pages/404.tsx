import * as React from 'react'

import Layout from '@src/layouts'
import Helmet from '@src/components/Helmet'

const NotFoundPage = props => (
  <Layout>
    <div>
      <Helmet
        title="Serverless 中文技术网"
        description="Serverless 中文技术网，专注 Serverless 架构最佳实践"
        location={props.location}
      />
      <h1>404 NOT FOUND</h1>
    </div>
  </Layout>
)

export default NotFoundPage
