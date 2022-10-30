import { Layout } from '../../components/Layout'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { deserializeJob, SerializedJob, serializeJob } from '../../lib/jobs'
import { formatDate } from '../../lib/dates'
import { getJob } from '../../lib/jobs_server'

export interface Props {
  job: SerializedJob
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const job = await getJob(context.params!.id as string)
  if (!job) {
    return { notFound: true }
  }
  return { props: { job: serializeJob(job) } }
}

const JobPage: NextPage<Props> = ({ job: serializedJob }) => {
  const job = deserializeJob(serializedJob)
  return (
    <Layout title={`${job.jobTitle} at ${job.company}`}>
      <h2>{job.jobTitle}</h2>
      <p>
        <strong>{job.company}</strong>
      </p>
      <p>
        <small>Posted on {formatDate(job.date)}</small>
      </p>
      {/* An easy way to replace `\n` in description with new paragraphs: */}
      {job.description.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <p>
        <a href={job.applyUrl} target="_blank" rel="noreferrer">
          Apply
        </a>
      </p>
    </Layout>
  )
}

export default JobPage
