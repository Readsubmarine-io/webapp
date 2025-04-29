'use client'

import { useForm } from '@tanstack/react-form'

import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { CreateEbookFormData } from '@/components/create-ebook/create-ebook-content'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface AdditionalDetailsProps {
  formData: Partial<CreateEbookFormData>
  updateFormData: (data: Partial<CreateEbookFormData>) => void
  onNext: () => void
  onPrev: () => void
}

export function AdditionalDetails({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: AdditionalDetailsProps) {
  const { data: settings } = useGetSettingsQuery()

  const form = useForm({
    defaultValues: {
      longDescription: formData.longDescription || '',
      genres: formData.genres || [],
      pages: formData.pages || 0,
    },
    onSubmit: async ({ value }) => {
      updateFormData(value)
      onNext()
    },
  })

  const genres = settings?.[SettingKey.Genres] ?? []
  if (!genres) {
    return <div>Loading...</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="longDescription">
          Long Description <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="longDescription"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim()
              if (!trimmed) return 'Long Description is required'
              if (trimmed.length > 1500)
                return 'Long Description must be 1500 characters or less'
              if (trimmed.length < 100)
                return 'Long Description must be 100 characters or more'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Textarea
                id="longDescription"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                placeholder="Enter a detailed description (max 1500 characters)"
                maxLength={1500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {field.state.value.length}/1500 characters
              </p>
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
        <Label>
          Genres <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="genres"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length === 0)
                return 'Please select at least one genre'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={field.state.value.includes(genre)}
                      onCheckedChange={() => {
                        const updatedGenres = field.state.value.includes(genre)
                          ? field.state.value.filter((g) => g !== genre)
                          : [...field.state.value, genre]
                        field.handleChange(updatedGenres)
                        field.handleBlur()
                      }}
                      className={cn(
                        'border-gray-300 focus:ring-power-pump-button',
                        field.state.value.includes(genre) &&
                          'bg-power-pump-button border-power-pump-button text-white',
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
        <Label htmlFor="pages">
          Number of Pages <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="pages"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Number of pages is required'
              if (isNaN(Number(value)) || Number(value) <= 0)
                return 'Please enter a valid number of pages'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <NumberInput
                id="pages"
                initialValue={Number(field.state.value)}
                onChange={(value) => {
                  field.handleChange(value)
                  field.handleBlur()
                }}
                allowDecimal={false}
                placeholder="Enter the number of pages"
                min={1}
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
      <div className="flex justify-between items-center mt-6 space-x-2 sm:space-x-4">
        <Button
          type="button"
          onClick={onPrev}
          variant="outline"
          className="w-[48%] sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          Previous
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-[48%] sm:w-auto h-9 sm:h-10 px-3 sm:px-4 text-sm bg-power-pump-button text-white hover:bg-power-pump-button/90"
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
