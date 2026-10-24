// Vercel emits .ts sources as .js; keep the runtime import valid after compilation.
import { createVisitorsReader } from '../server/visitors.js'

const readVisitors = createVisitorsReader(() => ({
  ANALYTICS_READ_TOKEN: process.env.ANALYTICS_READ_TOKEN,
  ANALYTICS_PROJECT_ID: process.env.ANALYTICS_PROJECT_ID,
  ANALYTICS_TEAM_ID: process.env.ANALYTICS_TEAM_ID,
}))

export default {
  fetch(request: Request) {
    return readVisitors(request)
  },
}
