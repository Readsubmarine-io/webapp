import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const assertError = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    console.error(error, error.stack)
    toast.error(message ?? error.message)

    return error
  }

  if (typeof error === 'string') {
    console.error(error)
    toast.error(message ?? error)

    return new Error(error)
  }

  if (error instanceof AxiosError) {
    console.error(error, error.response?.data)
    toast.error(message ?? error.response?.data.message)

    return error
  }

  console.error(error)
  toast.error(message ?? 'Unknown error')

  return new Error(message ?? 'Unknown error')
}
