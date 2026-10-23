import { readVisitors } from '../server/visitors.ts'

export default {
  fetch(request: Request) {
    return readVisitors(request, {
      ANALYTICS_READ_TOKEN: process.env.ANALYTICS_READ_TOKEN,
      ANALYTICS_PROJECT_ID: process.env.ANALYTICS_PROJECT_ID,
      ANALYTICS_TEAM_ID: process.env.ANALYTICS_TEAM_ID,
    })
  },
}
