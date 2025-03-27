'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface User {
  username: string
  bio: string
  website: string
}

interface EditProfileDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    website: user.website,
    facebook: '',
    instagram: '',
    twitter: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto font-sans p-4 sm:p-6 bg-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-power-pump-heading">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label
                htmlFor={key}
                className="text-power-pump-text text-sm sm:text-base font-medium"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              {key === 'bio' ? (
                <Textarea
                  id={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button resize-none text-sm sm:text-base h-20 sm:h-24"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <Input
                  id={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                  placeholder={`Enter your ${key}`}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-power-pump-button text-white hover:bg-power-pump-button/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
