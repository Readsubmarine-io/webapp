'use client'

import { Updater, useForm } from '@tanstack/react-form'
import { CheckCircle } from 'lucide-react'
import type React from 'react'
import { useCallback, useState } from 'react'

import { useCreateFileMutation } from '@/api/file/create-file'
import { FileAssignment } from '@/api/file/types'
import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { CreateEbookFormData } from '@/components/create-ebook/create-ebook-content'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FileUploadsProps {
  formData: Partial<CreateEbookFormData>
  updateFormData: (data: Partial<CreateEbookFormData>) => void
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
        setIsSubmissionSuccessful(true)

        updateFormData({
          coverImage: value.coverImage,
          pdf: value.pdf,
          contactEmail: value.contactEmail,
        })

        onNext()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    validators: {
      onMount: ({ value }) => {
        if (
          !value.acceptTerms ||
          !value.contactEmail ||
          !value.coverImage ||
          !value.pdf
        ) {
          return 'You must accept the terms to proceed'
        }
      },
      onChange: ({ value }) => {
        if (
          !value.acceptTerms ||
          !value.contactEmail ||
          !value.coverImage ||
          !value.pdf
        ) {
          return 'You must accept the terms to proceed'
        }
      },
    },
  })

  const handlePrevClick = useCallback(() => {
    updateFormData({
      coverImage: form.state.values.coverImage || undefined,
      pdf: form.state.values.pdf || undefined,
      contactEmail: form.state.values.contactEmail || undefined,
    })

    onPrev()
  }, [
    form.state.values.coverImage,
    form.state.values.pdf,
    form.state.values.contactEmail,
    onPrev,
    updateFormData,
  ])

  const handleMetadataUpload = useCallback(async () => {
    const coverImage = form.state.values.coverImage
    const pdf = form.state.values.pdf

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
    form.state.values.coverImage,
    form.state.values.pdf,
    formData.author,
    formData.longDescription,
    formData.pages,
    formData.title,
    updateFormData,
  ])

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: 'coverImage' | 'pdf',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleChange: (updater: Updater<any>) => void,
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

          handleChange(fileInfo)
        } catch (error) {
          console.error(error)
          e.target.value = ''
        }
      }
    },
    [createFile],
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
            <div className="flex items-center">
              <label
                htmlFor="coverImage"
                className="flex cursor-pointer h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <span className="text-black">Choose File</span>
                <span className="ml-2">
                  {field.state.value?.metadata.srcUrl
                    ? field.state.value?.metadata.srcUrl.split('/').pop()
                    : 'No file chosen'}
                </span>
              </label>
              <Input
                id="coverImage"
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) =>
                  handleFileChange(e, 'coverImage', field.handleChange)
                }
                className="hover:cursor-pointer file:cursor-pointer hidden"
              />
            </div>
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
          onChange: ({ value }) => {
            console.log('onChange', value)
            return !value ? 'eBook PDF is required' : undefined
          },
        }}
      >
        {(field) => {
          return (
            <div>
              <Label htmlFor="pdf">
                Upload eBook PDF <span className="text-red-600">*</span>
              </Label>
              <label
                htmlFor="pdf"
                className="flex cursor-pointer h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <span className="text-black">Choose File</span>
                <span className="ml-2">
                  {field.state.value?.metadata.srcUrl
                    ? field.state.value?.metadata.srcUrl.split('/').pop()
                    : 'No file chosen'}
                </span>
              </label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, 'pdf', field.handleChange)}
                className="hover:cursor-pointer file:cursor-pointer hidden"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
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

      <form.Subscribe selector={(state) => [state.isSubmitting, state.isValid]}>
        {([isSubmitting, isValid]) => (
          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={handlePrevClick}
              variant="outline"
              className="w-[48%]"
            >
              Previous
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
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
