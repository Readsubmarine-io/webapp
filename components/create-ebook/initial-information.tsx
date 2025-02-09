"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InitialInformationProps {
  formData: {
    title: string
    authorName: string
    shortDescription: string
  }
  updateFormData: (data: Partial<InitialInformationProps["formData"]>) => void
  onNext: () => void
}

export function InitialInformation({ formData, updateFormData, onNext }: InitialInformationProps) {
  const [errors, setErrors] = useState({
    title: "",
    authorName: "",
    shortDescription: "",
  })

  const validate = () => {
    let isValid = true
    const newErrors = {
      title: "",
      authorName: "",
      shortDescription: "",
    }

    if (!formData.title.trim()) {
      newErrors.title = "eBook Title is required"
      isValid = false
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author Name is required"
      isValid = false
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short Description is required"
      isValid = false
    } else if (formData.shortDescription.length > 150) {
      newErrors.shortDescription = "Short Description must be 150 characters or less"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">eBook Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Enter the title of your eBook"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <Label htmlFor="authorName">Author Name</Label>
        <Input
          id="authorName"
          value={formData.authorName}
          onChange={(e) => updateFormData({ authorName: e.target.value })}
          placeholder="Enter your name"
        />
        {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
      </div>
      <div>
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => updateFormData({ shortDescription: e.target.value })}
          placeholder="Enter a short description (max 150 characters)"
          maxLength={150}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/150 characters</p>
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
      </div>
      <Button type="submit" className="w-full bg-power-pump-button text-white hover:bg-power-pump-button/90">
        Next
      </Button>
    </form>
  )
}

