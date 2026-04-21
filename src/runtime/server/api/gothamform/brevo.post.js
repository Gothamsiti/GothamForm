import { defineEventHandler, readMultipartFormData, createError } from '#imports'
import { sendEmail } from '../../utils/brevo'
import { parseFields, parseMultipartFormFields, getTemplate, textReplacer } from '../../utils/emailtemplate'

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body) throw createError({ statusCode: 400, statusMessage: 'Missing body' })
  const { fields, files, emailTemplate } = parseMultipartFormFields(body)

  const { template, subject, story } = await getTemplate(emailTemplate)

  const parsedFields = parseFields(fields)
  fields.logo = story.content?.logo?.filename
  fields.site = story.content?.site
  fields.backgroundColor = story.content?.backgroundColor?.color
  const html = template ? textReplacer(template, fields) : parsedFields

  try {
    const mailSent = await sendEmail(subject, html, fields.email, files)
    return { sent: mailSent }
  }
  catch (error) {
    throw error
  }
})
