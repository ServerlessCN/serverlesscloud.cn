import * as React from 'react'
import Helmet from '@src/components/Helmet'

export default props => {
  React.useEffect(() => {
    location.href = 'https://serverless.cloud.tencent.com/deploy/express'
  }, [])
  return <Helmet title="跳转中" location={props.location} />
}
