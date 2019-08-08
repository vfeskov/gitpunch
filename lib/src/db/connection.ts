import * as mongoose from 'mongoose'

export const connection = mongoose.connect(process.env.WAB_MONGODB_URL, { useNewUrlParser: true })
