export const parseFields = (fields = {}) => {
  return Object.keys(fields).map(key => `<b>${key}</b> <span>${fields[key]}</span>`).join('<br/>')
}
export const getTemplate = async (storyUuid) => {
  const query = {}
  if (storyUuid) {
    query.fullSlug = storyUuid
    query.find_by = 'uuid'
  }
  else {
    query.fullSlug = 'system/email/template'
  }

  try {
    const story = await $fetch('/api/storyblok/request', {
      query,
    })
    if (!story?.content) throw new Error('no template or subject found')
    const template = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="color-scheme" content="light">
                <meta name="supported-color-schemes" content="light">
            </head>
            <body style="background-color: {{backgroundColor}} !important; ">
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                ${story.content.template}
            </body>
        </html>`
    return { template, subject: story.content.subject, story: story }
  }
  catch (e) {
    console.log(e)
  }
}
export const parseMultipartFormFields = (body) => {
  const fields = {}
  const files = {}
  let emailTemplate = undefined
  for (const f of body) {
    if (f.name === 'emailTemplate') {
      emailTemplate = f.data.toString()
      continue
    }

    fields[f.name] = f.filename ? f.filename : f.data.toString()
    if (f.filename) {
      files[f.name] = f
    }
  }
  return { fields, files, emailTemplate }
}
export const textReplacer = (str, values) => {
  const regex = /\{\{([^}]+)\}\}/g
  values.site = values.host || `https://${values.site}`
  return str.replaceAll(regex, (match, property) => {
    var value = null
    if (values && values[property]) {
      value = values[property]
    }
    return value ?? match
  })
}
