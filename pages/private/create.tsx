import { NextPage } from 'next'
import { Layout } from '../../components/Layout'

const PostJobPage: NextPage = () => {
  return (
    <Layout title="Post a job">
      <h2>Post a new job</h2>
      <p>This page can be seen only by authenticated users.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          fetch('/api/create-job', { method: 'POST' })
            .then((res) => res.json())
            .then(console.log)
            .catch(console.error)
        }}
      >
        <button type="submit">Create a job</button>
      </form>
    </Layout>
  )
}

export default PostJobPage
