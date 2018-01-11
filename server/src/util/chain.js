export default function chain (middlewares) {
  return (req, res) => {
    [...middlewares] // need to copy array because #reverse mutates it
      .reverse()
      .reduce(
        (next, middleware) => {
          return err => {
            // if next was called with an err, skip all middlewares and call the final one, whose next is null
            if (err && next) { return next(err) }
            middleware(req, res, next, err)
          }
        },
        null
      )()
  }
}
