'use client'

import { Facebook, Globe, Instagram, Twitter } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useCreateFileMutation } from '@/api/file/create-file'
import { FileAssignment, FileInfo } from '@/api/file/types'
import { User } from '@/api/user/types'
import { useUpdateUserMutation } from '@/api/user/update-user'
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

interface EditProfileDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormData = {
  avatar: FileInfo | null
  displayName: string
  bio?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    avatar: user.avatar ?? null,
    displayName: user.displayName,
    bio: user.bio,
    website: user.website,
    facebook: user.facebook,
    instagram: user.instagram,
    twitter: user.twitter,
  })

  const [errors, setErrors] = useState({
    displayName: '',
    bio: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })

  const { mutateAsync: updateUser } = useUpdateUserMutation()

  const validate = useCallback(
    (value?: FormData) => {
      const data = value ?? formData

      let isValid = true
      const newErrors = {
        displayName: '',
        bio: '',
        website: '',
        facebook: '',
        instagram: '',
        twitter: '',
      }

      // Validate display name
      if (
        !data.displayName?.trim().length ||
        data.displayName.length < 5 ||
        data.displayName.length > 30
      ) {
        newErrors.displayName =
          'Display Name is required and must be between 5 and 30 characters'
        isValid = false
      }

      if (data.bio && data.bio.length > 500) {
        newErrors.bio = 'Bio must be less than 500 characters'
        isValid = false
      }

      // URL validation helper function
      const isValidUrl = (url: string) => {
        if (!url) return true // Empty URLs are valid
        try {
          const urlObj = new URL(url)
          return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
        } catch {
          return false
        }
      }

      const checkUrlDomain = (url: string, domain: string) => {
        try {
          const urlObj = new URL(url)
          return urlObj.hostname === domain
        } catch {
          return false
        }
      }

      // Validate URLs
      if (data.website && !isValidUrl(data.website)) {
        newErrors.website = 'Please enter a valid URL with protocol specified'
        isValid = false
      }

      if (data.facebook && !isValidUrl(data.facebook)) {
        newErrors.facebook = 'Please enter a valid URL with protocol specified'
        isValid = false
      }

      if (data.facebook && !checkUrlDomain(data.facebook, 'facebook.com')) {
        newErrors.facebook = 'Please enter a valid facebook URL'
        isValid = false
      }

      if (data.instagram && !isValidUrl(data.instagram)) {
        newErrors.instagram = 'Please enter a valid URL with protocol specified'
        isValid = false
      }

      if (data.instagram && !checkUrlDomain(data.instagram, 'instagram.com')) {
        newErrors.instagram = 'Please enter a valid instagram URL'
        isValid = false
      }

      if (data.twitter && !isValidUrl(data.twitter)) {
        newErrors.twitter = 'Please enter a valid URL with protocol specified'
        isValid = false
      }

      if (
        data.twitter &&
        !checkUrlDomain(data.twitter, 'twitter.com') &&
        !data.twitter.includes('x.com')
      ) {
        newErrors.twitter = 'Please enter a valid twitter URL'
        isValid = false
      }

      setErrors(newErrors)
      return isValid
    },
    [formData, setErrors],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target
      setFormData((prevData) => {
        const newData = { ...prevData, [id]: value }
        validate(newData)
        return newData
      })
    },
    [validate],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (validate()) {
        await updateUser(formData)
        onOpenChange(false)
      }
    },
    [formData, updateUser, onOpenChange, validate],
  )

  const { mutateAsync: uploadFile } = useCreateFileMutation()
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        return
      }

      const uploadedFile = await uploadFile({
        file,
        assignment: FileAssignment.UserAvatar,
      })

      setFormData((prevData) => ({
        ...prevData,
        avatar: uploadedFile,
      }))
    },
    [uploadFile],
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state: boolean) => {
        onOpenChange(state)
        setFormData({
          avatar: user.avatar ?? null,
          displayName: user.displayName,
          bio: user.bio,
          website: user.website,
        })
        setErrors({
          displayName: '',
          bio: '',
          website: '',
          facebook: '',
          instagram: '',
          twitter: '',
        })
      }}
    >
      <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto font-sans p-4 sm:p-6 bg-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-power-pump-heading">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-4">
          <div>
            <Label htmlFor="avatar">Upload Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
              placeholder="Display Name"
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
            )}
          </div>
          <div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button resize-none text-sm sm:text-base h-20 sm:h-24"
                placeholder="Tell us about yourself"
              />
            </div>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>
          <div>
            <div className="space-y-2 flex items-center relative">
              <Label
                htmlFor="website"
                className="absolute left-2 bottom-0 h-9 sm:h-10 flex items-center"
              >
                <Globe className="w-4 h-4 mr-2" />
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={handleChange}
                className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                placeholder="Enter your website url"
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website}</p>
            )}
          </div>
          <div>
            <div className="space-y-2 flex items-center relative">
              <Label
                htmlFor="facebook"
                className="absolute left-2 bottom-0 h-9 sm:h-10 flex items-center"
              >
                <Facebook className="w-4 h-4 mr-2" />
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                placeholder="Enter your facebook url"
              />
            </div>
            {errors.facebook && (
              <p className="text-red-500 text-sm mt-1">{errors.facebook}</p>
            )}
          </div>
          <div>
            <div className="space-y-2 flex items-center relative">
              <Label
                htmlFor="instagram"
                className="absolute left-2 bottom-0 h-9 sm:h-10 flex items-center"
              >
                <Instagram className="w-4 h-4 mr-2" />
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                placeholder="Enter your instagram url"
              />
            </div>
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
            )}
          </div>
          <div>
            <div className="space-y-2 flex items-center relative">
              <Label
                htmlFor="twitter"
                className="absolute left-2 bottom-0 h-9 sm:h-10 flex items-center"
              >
                <Twitter className="w-4 h-4 mr-2" />
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                placeholder="Enter your twitter url"
              />
            </div>
            {errors.twitter && (
              <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>
            )}
          </div>
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
