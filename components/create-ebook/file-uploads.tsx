"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type React from "react"
import { CheckCircle } from "lucide-react"

interface FileUploadsProps {
  formData: {
    coverImage: File | null
    ebookPdf: File | null
    email: string
    acceptTerms: boolean
  }
  updateFormData: (data: Partial<FileUploadsProps["formData"]>) => void
  onPrev: () => void
}

export function FileUploads({ formData, updateFormData, onPrev }: FileUploadsProps) {
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false)
  const [errors, setErrors] = useState({
    coverImage: "",
    ebookPdf: "",
    email: "",
    acceptTerms: "",
  })

  const validate = () => {
    let isValid = true
    const newErrors = {
      coverImage: "",
      ebookPdf: "",
      email: "",
      acceptTerms: "",
    }

    if (!formData.coverImage) {
      newErrors.coverImage = "Cover image is required"
      isValid = false
    }

    if (!formData.ebookPdf) {
      newErrors.ebookPdf = "eBook PDF is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms to proceed"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData)
      // Set submission as successful
      setIsSubmissionSuccessful(true)
      // Reset the form or perform any other necessary actions
      // ...
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "ebookPdf") => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ [field]: e.target.files[0] })
    }
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
            Thank you for submitting your eBook. Your application will be reviewed within 3 business days.
          </p>
        </div>
      )}
      <div>
        <Label htmlFor="coverImage">Upload eBook Cover (JPEG)</Label>
        <Input id="coverImage" type="file" accept="image/jpeg" onChange={(e) => handleFileChange(e, "coverImage")} />
        {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
      </div>
      <div>
        <Label htmlFor="ebookPdf">Upload eBook PDF</Label>
        <Input id="ebookPdf" type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, "ebookPdf")} />
        {errors.ebookPdf && <p className="text-red-500 text-sm mt-1">{errors.ebookPdf}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => updateFormData({ acceptTerms: checked as boolean })}
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I accept the platform's terms and confirm a 20% mint fee
        </label>
      </div>
      {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
      <div className="flex justify-between items-center mt-6">
        <Button type="button" onClick={onPrev} variant="outline" className="w-[48%]">
          Previous
        </Button>
        <Button type="submit" className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90">
          Submit for Review
        </Button>
      </div>
    </form>
  )
}

