import  { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import { baseUrl } from '../../api/baseUrl'

type MessagePayload = { message: string }
type ServerError  = { message?: string; errors?: Record<string,string[]> }

export default function CustomMessage() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const [text, setText]           = useState('')
  const [fieldError, setFieldError] = useState<string|null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth/signin')
    }
  }, [navigate])

  // Fetch existing message
// Fetch existing message
const {
  data: message,
  isPending,
  isError,
  error,
  isFetching,
} = useQuery<MessagePayload, AxiosError>({
  queryKey: ['customMessage'],
  queryFn: async () => {
    const res = await axios.get<MessagePayload>(
      `${baseUrl}/api/custom-message`
    )
    return res.data
  },
 
})

useEffect(() => {
  if (message?.message) {
    setText(message.message)
  }
}, [message])

  // Mutation to update
  const mutation = useMutation<
    MessagePayload,
    AxiosError<ServerError>,
    string
  >({
    mutationFn: async (newMsg) => {
      const res = await axios.put<MessagePayload>(
        `${baseUrl}/api/custom-message`,
        { message: newMsg },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return res.data
    },
    onError: (err) => {
      const srv = err.response?.data
      const msg =
        srv?.message ||
        Object.values(srv?.errors || {})[0]?.[0] ||
        'Failed to save.'
      setFieldError(msg)
    },
    onSuccess: () => {
      toast.success('Saved successfully!')
      setFieldError(null)
      queryClient.invalidateQueries({ queryKey:['customMessage']})
    },
  })

  const handleSave = () => {
    setFieldError(null)
    if (text.trim().length < 10) {
      setFieldError('Message must be at least 10 characters.')
      return
    }
    mutation.mutate(text)
  }

  return (
    <>
      <Breadcrumb pageName="Custom Message" />

      <div className="p-4 space-y-4">
        {(isPending || isFetching) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading…
          </div>
        )}

        {!isPending && isError && (
          <div className="text-red-600 dark:text-red-400">
            Error loading: {error?.message}
          </div>
        )}

        {!isPending && !isError && (
          <>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>

            <textarea
              rows={6}
              className="
                w-full
                rounded
                border-[1.5px] border-stroke dark:border-form-strokedark
                bg-transparent dark:bg-form-input
                py-3 px-5
                text-black dark:text-white
                outline-none
                transition focus:border-primary active:border-primary
                disabled:cursor-not-allowed disabled:opacity-50
              "
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={mutation.isPending}
            />

            {fieldError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {fieldError}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className={`
                px-4 py-2 rounded font-medium text-white
                ${
                  mutation.isPending
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                }
              `}
            >
              {mutation.isPending ? 'Saving…' : 'Save'}
            </button>
          </>
        )}
      </div>
    </>
  )
}
