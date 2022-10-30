import { Layout } from '../../components/Layout'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { deserializeJob, SerializedJob, serializeJob } from '../../lib/jobs'
import { formatDate } from '../../lib/dates'
import { getJob } from '../../lib/jobs_server'
import { User } from '@prisma/client'
import { useCurrentUser } from '../../lib/hooks'
import Link from 'next/link'

export interface Props {
  job: SerializedJob
  user: User | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const jobWithUser = await getJob(context.params!.id as string)
  if (!jobWithUser) {
    return { notFound: true }
  }
  const { user, ...job } = jobWithUser
  // We don’t need to make user serializable, as its attributes
  // are already strings.
  return { props: { job: serializeJob(job), user } }
}

const JobPage: NextPage<Props> = ({ job: serializedJob, user }) => {
  const { user: currentUser } = useCurrentUser()

  const job = deserializeJob(serializedJob)
  const isOwner = currentUser && currentUser.id === job.userId

  return (
    <Layout title={`${job.jobTitle} at ${job.company}`}>
      <h2>{job.jobTitle}</h2>
      <p>
        <strong>{job.company}</strong>
      </p>
      <p>
        <small>
          Posted on {formatDate(job.date)}
          {user && (
            <>
              {' '}
              by <strong>{user.name}</strong>
            </>
          )}
          {isOwner && (
            <>
              {' '}
              · <Link href={`/private/${job.id}/delete`}>Delete</Link> ·{' '}
              <Link href={`/private/${job.id}/edit`}>Edit</Link>
            </>
          )}
        </small>
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
