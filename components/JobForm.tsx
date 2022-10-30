import { ErrorMessage, Field, Form, Formik } from 'formik'
import { JobFormValues, validateJobFormValues } from '../lib/jobForm'

export interface Props {
  initialValues: JobFormValues
  onSubmit: (values: JobFormValues) => void
  buttonText: string
}

export const JobForm = ({ initialValues, onSubmit, buttonText }: Props) => {
  return (
    <Formik<JobFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateJobFormValues}
    >
      <Form>
        <section>
          <label htmlFor="jobTitle">Job title</label>
          <Field
            type="text"
            name="jobTitle"
            id="jobTitle"
            placeholder="e.g. “Chief Geek”"
          />
          <span className="error">
            <ErrorMessage name="jobTitle" />
          </span>
        </section>

        <section>
          <label htmlFor="company">Company name</label>
          <Field
            type="text"
            name="company"
            id="company"
            placeholder="e.g. “Oceans Clean Up”"
          />
          <span className="error">
            <ErrorMessage name="company" />
          </span>
        </section>

        <section>
          <label htmlFor="description">Description</label>
          <Field as="textarea" name="description" id="description" />
          <span className="error">
            <ErrorMessage name="description" />
          </span>
        </section>

        <section>
          <label htmlFor="applyUrl">Apply URL</label>
          <Field
            type="url"
            name="applyUrl"
            id="applyUrl"
            placeholder="https://..."
          />
          <span className="error">
            <ErrorMessage name="applyUrl" />
          </span>
        </section>

        <button type="submit">{buttonText}</button>
      </Form>
    </Formik>
  )
}
