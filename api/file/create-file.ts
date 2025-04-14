import { useMutation } from '@tanstack/react-query'

import { FileAssignment, FileInfo } from '@/api/file/types'
import http from '@/lib/http'

export type CrateFileParams = {
  file: File
  assignment: FileAssignment
}

export const createFileCall = async ({
  file,
  assignment,
}: CrateFileParams): Promise<FileInfo> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('assignment', assignment)

  const response = await http.put('/v1/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  if (response.status !== 201) {
    throw new Error('Failed to create file')
  }

  return response.data
}
export const useCreateFileMutation = () => {
  return useMutation<FileInfo, Error, CrateFileParams>({
    mutationFn: createFileCall,
  })
}
