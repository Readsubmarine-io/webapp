"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const genres = ["Non-fiction", "Fiction", "Science Fiction", "Fantasy", "Crime", "Romance", "Mystery", "Other"]

interface AdditionalDetailsProps {
  formData: {
    longDescription: string
    genres: string[]
    pages: string
  }
  updateFormData: (data: Partial<AdditionalDetailsProps["formData"]>) => void
  onNext: () => void
  onPrev: () => void
}

export function AdditionalDetails({ formData, updateFormData, onNext, onPrev }: AdditionalDetailsProps) {
  const [errors, setErrors] = useState({
    longDescription: "",
    genres: "",
    pages: "",
  })

  const validate = () => {
    let isValid = true
    const newErrors = {
      longDescription: "",
      genres: "",
      pages: "",
    }

    if (!formData.longDescription.trim()) {
      newErrors.longDescription = "Long Description is required"
      isValid = false
    } else if (formData.longDescription.length > 1500) {
      newErrors.longDescription = "Long Description must be 1500 characters or less"
      isValid = false
    }

    if (formData.genres.length === 0) {
      newErrors.genres = "Please select at least one genre"
      isValid = false
    }

    if (!formData.pages.trim()) {
      newErrors.pages = "Number of pages is required"
      isValid = false
    } else if (isNaN(Number(formData.pages)) || Number(formData.pages) <= 0) {
      newErrors.pages = "Please enter a valid number of pages"
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

  const handleGenreChange = (genre: string) => {
    const updatedGenres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre]
    updateFormData({ genres: updatedGenres })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          value={formData.longDescription}
          onChange={(e) => updateFormData({ longDescription: e.target.value })}
          placeholder="Enter a detailed description (max 1500 characters)"
          maxLength={1500}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.longDescription.length}/1500 characters</p>
        {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription}</p>}
      </div>
      <div>
        <Label>Genres</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={formData.genres.includes(genre)}
                onCheckedChange={() => handleGenreChange(genre)}
                className={cn(
                  "border-gray-300 focus:ring-power-pump-button",
                  formData.genres.includes(genre) && "bg-power-pump-button border-power-pump-button text-white",
                )}
              />
              <label
                htmlFor={genre}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {genre}
              </label>
            </div>
          ))}
        </div>
        {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
      </div>
      <div>
        <Label htmlFor="pages">Number of Pages</Label>
        <Input
          id="pages"
          type="number"
          value={formData.pages}
          onChange={(e) => updateFormData({ pages: e.target.value })}
          placeholder="Enter the number of pages"
        />
        {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages}</p>}
      </div>
      <div className="flex justify-between items-center mt-6 space-x-2 sm:space-x-4">
        <Button
          type="button"
          onClick={onPrev}
          variant="outline"
          className="w-[48%] sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="w-[48%] sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm bg-power-pump-button text-white hover:bg-power-pump-button/90"
        >
          Next
        </Button>
      </div>
    </form>
  )
}

