import { Job } from '@prisma/client'
import { FormikErrors } from 'formik'

export type JobFormValues = Omit<Job, 'id' | 'date' | 'userId'>

export const validateJobFormValues = (values: JobFormValues) => {
  const errors: FormikErrors<JobFormValues> = {}

  if (!lengthIsBetween(values.jobTitle, 3, 50)) {
    errors.jobTitle = 'Job title must contain between 3 and 50 characters.'
  }
  if (!lengthIsBetween(values.company, 3, 50)) {
    errors.company = 'Company name must contain between 3 and 50 characters.'
  }
  if (!lengthIsBetween(values.description, 150, 1500)) {
    errors.description =
      'Description must contain between 150 and 1500 characters.'
  }
  if (!isValidUrl(values.applyUrl)) {
    errors.applyUrl = 'Apply URL must be a valid URL.'
  }

  return errors
}

const lengthIsBetween = (value: any, min: number, max: number) => {
  const length = (value ?? '').length
  return length >= min && length <= max
}

const isValidUrl = (url: any) => {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}
