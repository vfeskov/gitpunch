import * as mongoose from 'mongoose'

mongoose.connect(process.env.WAB_MONGODB_URL, { useNewUrlParser: true })
