import { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { JobFormValues } from '../../lib/jobForm'
import { useRouter } from 'next/router'
import { JobForm } from '../../components/JobForm'

const PostJobPage: NextPage = () => {
  const router = useRouter()

  const initialValues: JobFormValues = {
    jobTitle: '',
    company: '',
    description: '',
    applyUrl: '',
  }

  const onSubmit = (values: JobFormValues) => {
    fetch('/api/create-job', {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.jobId) {
          router.push(`/jobs/${res.jobId}`)
        }
      })
      .catch(console.error)
  }

  return (
    <Layout title="Post a job">
      <h2>Post a new job</h2>
      <JobForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        buttonText="Create"
      />
    </Layout>
  )
}

export default PostJobPage
