import type { NextPage } from 'next'
import { JobList } from '../components/JobList'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <JobList />
    </Layout>
  )
}

export default Home
