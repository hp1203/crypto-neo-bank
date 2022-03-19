import React from 'react'
import Layout from "../components/dashboard/layout";
const AppLayout = ({children}) => {
  return (
      <Layout>

            <div>{children}</div>
      </Layout>
  )
}

export default AppLayout