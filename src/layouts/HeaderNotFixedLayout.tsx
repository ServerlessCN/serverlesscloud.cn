import * as React from 'react'
import Layout from './'
import { CheckIfHeaderFixed } from '@src/contexts'

export default function({ children }: React.Props<any>) {
  return (
    <CheckIfHeaderFixed.Provider value={false}>
      <Layout>{children}</Layout>
    </CheckIfHeaderFixed.Provider>
  )
}
