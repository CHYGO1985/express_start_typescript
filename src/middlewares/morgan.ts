import morgan, { StreamOptions } from 'morgan'
import logger from '../configs/winton.js'

// Define a type for the custom logger stream if not already defined in winston
interface LoggerStream {
  write: (message: string) => void
}

const stream: StreamOptions = {
  write: (message: string) => (logger as any).stream.write(message.trim()),
}

const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  'combined',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream },
)

export default morganMiddleware
