import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    // We MUST use port 5432 (Direct connection) to build tables
    url: "postgresql://postgres.nddaaxrpzpmwhnirxmxq:owhfvnsk20948@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
})