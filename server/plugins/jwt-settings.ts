export const key = process.env.WAB_JWT_SECRET
export const validateFunc = ({ email }, req, cb) => cb(null, !!email)
export const verifyOptions = { ignoreExpiration: true, algorithms: ['HS256'] }
