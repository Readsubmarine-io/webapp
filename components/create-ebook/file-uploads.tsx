'use client'

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
  const [errors, setErrors] = useState({
    coverImage: '',
    pdf: '',
    contactEmail: '',
    acceptTerms: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { mutateAsync: createFile } = useCreateFileMutation()
  const { data: settings } = useGetSettingsQuery()

  const validate = () => {
    let isValid = true
    const newErrors = {
      coverImage: '',
      pdf: '',
      contactEmail: '',
      acceptTerms: '',
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required'
      isValid = false
    }

    if (!formData.pdf) {
      newErrors.pdf = 'eBook PDF is required'
      isValid = false
    }

    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
      isValid = false
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms to proceed'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Create metadata file
      await handleMetadataUpload()
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData)
      // Set submission as successful
      setIsSubmissionSuccessful(true)
      // Reset the form or perform any other necessary actions
      onNext()
    }
  }

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
        } catch (error) {
          console.error(error)
          e.target.value = ''
        }
      }
    },
    [createFile, updateFormData],
  )

  const mintFee = settings?.[SettingKey.PlatformFee]

  if (!mintFee) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <div>
        <Label htmlFor="coverImage">Upload eBook Cover (JPEG)</Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => handleFileChange(e, 'coverImage')}
        />
        {errors.coverImage && (
          <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
        )}
      </div>
      <div>
        <Label htmlFor="pdf">Upload eBook PDF</Label>
        <Input
          id="pdf"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, 'pdf')}
        />
        {errors.pdf && (
          <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => updateFormData({ contactEmail: e.target.value })}
          placeholder="Enter your email address"
        />
        {errors.contactEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I accept the platform's terms and confirm a {mintFee}% mint fee
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
      )}
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
          disabled={!acceptTerms}
          className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90"
        >
          Deploy Contracts
        </Button>
      </div>
    </form>
  )
}
