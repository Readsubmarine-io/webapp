'use client'

import { useForm } from '@tanstack/react-form'
import { Facebook, Globe, Instagram, Twitter } from 'lucide-react'
import { useCallback } from 'react'

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

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { mutateAsync: updateUser } = useUpdateUserMutation()
  const { mutateAsync: uploadFile } = useCreateFileMutation()

  const form = useForm({
    defaultValues: {
      avatar: user.avatar ?? (null as FileInfo | null),
      displayName: user.displayName,
      bio: user.bio ?? '',
      website: user.website ?? '',
      facebook: user.facebook ?? '',
      instagram: user.instagram ?? '',
      twitter: user.twitter ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateUser(value)
      onOpenChange(false)
    },
  })

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

      form.setFieldValue('avatar', uploadedFile)
    },
    [uploadFile, form],
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state: boolean) => {
        onOpenChange(state)
        if (state) {
          form.reset({
            avatar: user.avatar ?? (null as FileInfo | null),
            displayName: user.displayName,
            bio: user.bio ?? '',
            website: user.website ?? '',
            facebook: user.facebook ?? '',
            instagram: user.instagram ?? '',
            twitter: user.twitter ?? '',
          })
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto font-sans p-4 sm:p-6 bg-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-power-pump-heading">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-3 sm:space-y-4 mt-4"
        >
          <div>
            <Label htmlFor="avatar">Upload Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <form.Field
              name="displayName"
              validators={{
                onChange: ({ value }) => {
                  const trimmed = value.trim()
                  if (!trimmed) return 'Display Name is required'
                  if (trimmed.length < 5)
                    return 'Display Name must be at least 5 characters'
                  if (trimmed.length > 30)
                    return 'Display Name must be less than 30 characters'
                  return undefined
                },
              }}
            >
              {(field) => (
                <>
                  <Input
                    id="displayName"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                    className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Display Name"
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </>
              )}
            </form.Field>
          </div>
          <div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <form.Field
                name="bio"
                validators={{
                  onChange: ({ value }) => {
                    if (value && value.length > 500)
                      return 'Bio must be less than 500 characters'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <>
                    <Textarea
                      id="bio"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={() => field.handleBlur()}
                      className="w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button resize-none text-sm sm:text-base h-20 sm:h-24"
                      placeholder="Tell us about yourself"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <form.Field
            name="website"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                try {
                  const urlObj = new URL(value)
                  if (
                    urlObj.protocol !== 'https:' &&
                    urlObj.protocol !== 'http:'
                  ) {
                    return 'Please enter a valid URL with protocol specified'
                  }
                  return undefined
                } catch {
                  return 'Please enter a valid URL with protocol specified'
                }
              },
            }}
          >
            {(field) => (
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                    className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Enter your website url"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="facebook"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                try {
                  const urlObj = new URL(value)
                  if (
                    urlObj.protocol !== 'https:' &&
                    urlObj.protocol !== 'http:'
                  ) {
                    return 'Please enter a valid URL with protocol specified'
                  }
                  if (urlObj.hostname !== 'facebook.com') {
                    return 'Please enter a valid facebook.com URL'
                  }
                  return undefined
                } catch {
                  return 'Please enter a valid URL with protocol specified'
                }
              },
            }}
          >
            {(field) => (
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                    className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Enter your facebook url"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="instagram"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                try {
                  const urlObj = new URL(value)
                  if (
                    urlObj.protocol !== 'https:' &&
                    urlObj.protocol !== 'http:'
                  ) {
                    return 'Please enter a valid URL with protocol specified'
                  }
                  if (urlObj.hostname !== 'instagram.com') {
                    return 'Please enter a valid instagram.com URL'
                  }
                  return undefined
                } catch {
                  return 'Please enter a valid URL with protocol specified'
                }
              },
            }}
          >
            {(field) => (
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                    className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Enter your instagram url"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="twitter"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                try {
                  const urlObj = new URL(value)
                  if (
                    urlObj.protocol !== 'https:' &&
                    urlObj.protocol !== 'http:'
                  ) {
                    return 'Please enter a valid URL with protocol specified'
                  }
                  if (
                    urlObj.hostname !== 'twitter.com' &&
                    !value.includes('x.com')
                  ) {
                    return 'Please enter a valid twitter.com or x.com URL'
                  }
                  return undefined
                } catch {
                  return 'Please enter a valid URL with protocol specified'
                }
              },
            }}
          >
            {(field) => (
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                    className="pl-8 w-full bg-white border-gray-300 focus:border-power-pump-button focus:ring-power-pump-button text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Enter your twitter url"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <div className="flex justify-end pt-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="bg-power-pump-button text-white hover:bg-power-pump-button/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
