export class PageError extends Error {
  name = 'PageError'
  validPage

  constructor(message, validPage) {
    super(message)
    this.validPage = validPage
    this.date = new Date()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageError)
    }
  }
}
