import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
})

envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProccessEnv extends z.infer<typeof envSchema> {}
  }
}
