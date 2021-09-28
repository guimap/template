import * as sqWinston from 'sq-winston'
if (process.env.NODE_ENV === 'production') {
  sqWinston.setupAPM()
}
import "reflect-metadata"

import * as dotenv from 'dotenv'
dotenv.config()
import { init } from './app'
import { ppid } from "process"

init()