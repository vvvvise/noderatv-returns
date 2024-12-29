import * as dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import type { UserConfig } from "vite"

const environment = process.env.BUILD_ENV
const env = dotenv.config({
  path: `.env.${environment}`,
})
dotenvExpand.expand(env)

if (process.env?.BUILD_ENV && Object.keys("import").indexOf("meta.env") === -1) {
  Object.assign("import.meta", { "env": {...process.env} })
}

const defaultConfig: UserConfig = {
  mode: process.env.BUILD_ENV,
  define: {
    "import.meta.env": {...process.env},
    "process.env": {...process.env},
  },
}

export default defaultConfig
