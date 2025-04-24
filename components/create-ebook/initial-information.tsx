'use client'

import { useCallback, useEffect, useState } from 'react'

import { CreateBookCallParams } from '@/api/book/create-book'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
interface InitialInformationProps {
  formData: Partial<CreateBookCallParams>
  updateFormData: (data: Partial<CreateBookCallParams>) => void
  onNext: () => void
}

export function InitialInformation({
  formData,
  updateFormData,
  onNext,
}: InitialInformationProps) {
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    shortDescription: '',
  })

  const validate = useCallback(() => {
    let isValid = true
    const newErrors = {
      title: '',
      author: '',
      shortDescription: '',
    }

    const trimmedTitle = formData.title?.trim()

    if (!trimmedTitle) {
      newErrors.title = 'eBook Title is required'
      isValid = false
    } else if (trimmedTitle.length > 21) {
      newErrors.title = 'eBook Title must be 21 characters or less'
      isValid = false
    }

    const trimmedAuthor = formData.author?.trim()

    if (!trimmedAuthor) {
      newErrors.author = 'Author Name is required'
      isValid = false
    } else if (trimmedAuthor.length > 40) {
      newErrors.author = 'Author Name must be 40 characters or less'
      isValid = false
    } else if (trimmedAuthor.length < 5) {
      newErrors.author = 'Author Name must be 5 characters or more'
      isValid = false
    }

    const trimmedShortDescription = formData.shortDescription?.trim()

    if (!trimmedShortDescription) {
      newErrors.shortDescription = 'Short Description is required'
      isValid = false
    } else if (trimmedShortDescription.length > 150) {
      newErrors.shortDescription =
        'Short Description must be 150 characters or less'
      isValid = false
    } else if (trimmedShortDescription.length < 5) {
      newErrors.shortDescription =
        'Short Description must be 5 characters or more'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [formData])

  useEffect(() => {
    validate()
  }, [formData, validate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">
          eBook Title <span className="text-red-600">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Enter the title of your eBook"
          maxLength={21}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <Label htmlFor="author">
          Author Name <span className="text-red-600">*</span>
        </Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => updateFormData({ author: e.target.value })}
          placeholder="Enter your name"
          maxLength={40}
        />
        {errors.author && (
          <p className="text-red-500 text-sm mt-1">{errors.author}</p>
        )}
      </div>
      <div>
        <Label htmlFor="shortDescription">
          Short Description <span className="text-red-600">*</span>
        </Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => updateFormData({ shortDescription: e.target.value })}
          placeholder="Enter a short description (max 150 characters)"
          maxLength={150}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.shortDescription?.length ?? 0}/150 characters
        </p>
        {errors.shortDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-power-pump-button text-white hover:bg-power-pump-button/90"
      >
        Next
      </Button>
    </form>
  )
}
