import { useRuntimeConfig } from '#imports'

export const sendEmail = async (subject, html, replyTo, files) => {
  const config = useRuntimeConfig()
  const { from, to } = config.gothamform
  const { key } = config.gothamform.brevo
  try {
    let payload = {
      sender: { email: from },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }
    if(replyTo){
      payload.replyTo = { email: replyTo }
    }
    if (files && Object.keys(files).length) {
      payload.attachment = []
      for (const f of Object.keys(files)) {
        const file = files[f]
        payload.attachment.push({
          content: file?.data?.toString('base64'),
          name: file.filename,
        })
      }
    }
    const options = {
      method: 'POST',
      body: payload,
      headers: { 'api-key': key },
    }

    await $fetch('https://api.brevo.com/v3/smtp/email', options)

    return true
  }
  catch (e) {
    throw e
  }
}
