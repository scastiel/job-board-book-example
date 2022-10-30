import { useEffect, useRef, useState } from 'react'
import type { JobSummary } from './jobs'
import useSWR from 'swr'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'

const fetchUser = async (
  status: 'loading' | 'authenticated' | 'unauthenticated'
) => {
  if (status === 'authenticated') {
    const res = await fetch('/api/me')
    return res.json()
  }
  return null
}

export const useCurrentUser = () => {
  const { status } = useSession()
  const { data: user } = useSWR<User | null>(status, fetchUser)
  if (user === undefined) {
    return { loading: true, user: null }
  }
  return { loading: false, user }
}

export const useJobs = (
  initialJobs: JobSummary[],
  page?: number,
  jobTitle?: string,
  company?: string
) => {
  const [jobs, setJobs] = useState<JobSummary[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const isFirstRef = useRef(true)

  useEffect(() => {
    if (isFirstRef.current === true) {
      isFirstRef.current = false
      return
    }

    setLoading(true)
    setError(false)

    let query = []
    if (page !== undefined) {
      query.push(`page=${page}`)
    }
    if (jobTitle !== undefined) {
      query.push(`jobTitle=${encodeURIComponent(jobTitle)}`)
    }
    if (company !== undefined) {
      query.push(`company=${encodeURIComponent(company)}`)
    }

    let isCurrentRequest = true
    fetch(`/api/jobs?${query.join('&')}`)
      .then((res) => res.json())
      .then((jobs) => {
        if (isCurrentRequest) {
          setJobs(
            jobs.map((job: any) => ({
              ...job,
              date: new Date(job.date),
            }))
          )
        }
      })
      .catch((err) => {
        if (isCurrentRequest) {
          console.error(err)
          setError(err)
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [company, jobTitle, page])

  return { jobs, loading, error }
}
