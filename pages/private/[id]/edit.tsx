import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { JobForm } from '../../../components/JobForm'
import { Layout } from '../../../components/Layout'
import { JobFormValues } from '../../../lib/jobForm'
import { SerializedJob, serializeJob } from '../../../lib/jobs'
import { getJob } from '../../../lib/jobs_server'
import { getCurrentUser } from '../../../lib/user_server'

export interface Props {
  job: SerializedJob | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const jobId = String(context.query.id)
  const job = await getJob(jobId)
  if (!job) return { notFound: true }

  const user = await getCurrentUser({ req: context.req })
  // We know we’ll get a user as this page is protected by the
  // middleware. If we don’t get one, then it’s an error
  // by the developer.
  if (!user) throw new Error('Missing user')

  if (user.id !== job.userId) {
    context.res.statusCode = 403
    return { props: { job: null } }
  }

  return { props: { job: serializeJob(job) } }
}

const EditJobPage: NextPage<Props> = ({ job }) => {
  const router = useRouter()

  if (!job) {
    return (
      <Layout title="Unauthorized">
        <p>You are not authorized to access this page.</p>
      </Layout>
    )
  }

  const initialValues: JobFormValues = {
    jobTitle: job.jobTitle,
    company: job.company,
    description: job.description,
    applyUrl: job.applyUrl,
  }

  const onSubmit = (values: JobFormValues): void => {
    fetch(`/api/edit-job?id=${job.id}`, {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          router.push(`/jobs/${job.id}`)
        }
      })
      .catch(console.error)
  }

  return (
    <Layout title={`Edit job ${job.jobTitle} at ${job.company}`}>
      <h2>
        Edit job <strong>{job.jobTitle}</strong> at{' '}
        <strong>{job.company}</strong>
      </h2>
      <JobForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        buttonText="Update"
      />
    </Layout>
  )
}

export default EditJobPage
