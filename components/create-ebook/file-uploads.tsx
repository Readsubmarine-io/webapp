'use client'

import { useForm } from '@tanstack/react-form'
import { CheckCircle } from 'lucide-react'
import type React from 'react'
import { useCallback, useState } from 'react'

import { CreateBookCallParams } from '@/api/book/create-book'
import { useCreateFileMutation } from '@/api/file/create-file'
import { FileAssignment } from '@/api/file/types'
import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FileUploadsProps {
  formData: Partial<CreateBookCallParams>
  updateFormData: (data: Partial<CreateBookCallParams>) => void
  onPrev: () => void
  onNext: () => void
}

export function FileUploads({
  formData,
  updateFormData,
  onPrev,
  onNext,
}: FileUploadsProps) {
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false)
  const { mutateAsync: createFile } = useCreateFileMutation()
  const { data: settings } = useGetSettingsQuery()

  const form = useForm({
    defaultValues: {
      coverImage: formData.coverImage,
      pdf: formData.pdf,
      contactEmail: formData.contactEmail || '',
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      try {
        await handleMetadataUpload()
        console.log('Form submitted:', { ...formData, ...value })
        setIsSubmissionSuccessful(true)
        onNext()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
  })

  const handleMetadataUpload = useCallback(async () => {
    const coverImage = formData.coverImage
    const pdf = formData.pdf

    if (!coverImage || !pdf) {
      throw new Error('Cover image and PDF are required')
    }

    // Generate metadata file
    const metadata = {
      title: formData.title,
      author: formData.author,
      description: formData.longDescription,
      pages: formData.pages,
      image: coverImage?.metadata.srcUrl,
      pdf: pdf?.metadata.srcUrl,
    }

    const metadataFile = new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'application/json',
    })

    // Create metadata file (upload)
    const fileInfo = await createFile({
      file: metadataFile,
      assignment: FileAssignment.BookMetadata,
    })

    updateFormData({ metadata: fileInfo })
  }, [
    createFile,
    formData.author,
    formData.coverImage,
    formData.longDescription,
    formData.pages,
    formData.pdf,
    formData.title,
    updateFormData,
  ])

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: 'coverImage' | 'pdf',
    ) => {
      if (e.target.files && e.target.files[0]) {
        try {
          const fileInfo = await createFile({
            file: e.target.files[0],
            assignment:
              field === 'coverImage'
                ? FileAssignment.BookCover
                : FileAssignment.BookPdf,
          })

          updateFormData({ [field]: fileInfo })
          form.setFieldValue(field, fileInfo)
        } catch (error) {
          console.error(error)
          e.target.value = ''
        }
      }
    },
    [createFile, updateFormData, form],
  )

  const mintFee = settings?.[SettingKey.PlatformFee]

  if (!mintFee) {
    return <div>Loading...</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      {isSubmissionSuccessful && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="block sm:inline">Submission Successful!</span>
          </div>
          <p className="text-sm mt-2">
            Thank you for submitting your eBook. Your application will be
            reviewed within 3 business days.
          </p>
        </div>
      )}

      <form.Field
        name="coverImage"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Cover image is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="coverImage">
              Upload eBook Cover (JPEG) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFileChange(e, 'coverImage')}
              className="hover:cursor-pointer file:cursor-pointer"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="pdf"
        validators={{
          onChange: ({ value }) =>
            !value ? 'eBook PDF is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="pdf">
              Upload eBook PDF <span className="text-red-600">*</span>
            </Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, 'pdf')}
              className="hover:cursor-pointer file:cursor-pointer"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="contactEmail"
        validators={{
          onChange: ({ value }) => {
            if (!value?.trim()) return 'Email is required'
            if (!/\S+@\S+\.\S+/.test(value)) {
              return 'Please enter a valid email address'
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value)
                updateFormData({ contactEmail: e.target.value })
              }}
              placeholder="Enter your email address"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="acceptTerms"
        validators={{
          onChange: ({ value }) =>
            !value ? 'You must accept the terms to proceed' : undefined,
        }}
      >
        {(field) => (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the platform's terms and confirm a {mintFee}% mint fee
              </label>
            </div>
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={onPrev}
              variant="outline"
              className="w-[48%]"
            >
              Previous
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90"
            >
              {isSubmitting ? 'Submitting...' : 'Deploy Contracts'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
