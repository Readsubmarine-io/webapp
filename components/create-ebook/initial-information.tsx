'use client'

import { useForm } from '@tanstack/react-form'

import { CreateEbookFormData } from '@/components/create-ebook/create-ebook-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface InitialInformationProps {
  formData: Partial<CreateEbookFormData>
  updateFormData: (data: Partial<CreateEbookFormData>) => void
  onNext: () => void
}

export function InitialInformation({
  formData,
  updateFormData,
  onNext,
}: InitialInformationProps) {
  const form = useForm({
    defaultValues: {
      title: formData.title || '',
      collectionName: formData.collectionName || '',
      author: formData.author || '',
      shortDescription: formData.shortDescription || '',
    },
    onSubmit: async ({ value }) => {
      updateFormData(value)
      onNext()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title">
          eBook Title <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim()
              if (!trimmed) return 'eBook Title is required'
              if (trimmed.length > 50)
                return 'eBook Title must be 50 characters or less'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Input
                id="title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                placeholder="Enter the title of your eBook"
                maxLength={50}
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
        <Label htmlFor="collectionName">
          Collection Name <span className="text-red-600">*</span>
        </Label>

        <form.Field
          name="collectionName"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim()
              if (!trimmed) return 'Collection Name is required'
              if (trimmed.length > 20)
                return 'Collection Name must be 20 characters or less'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Input
                id="collectionName"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                placeholder="Enter the collection name"
                maxLength={20}
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
        <p className="text-sm text-gray-500 mt-1">
          Short name for the NFT collection
        </p>
      </div>
      <div>
        <Label htmlFor="author">
          Author Name <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="author"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim()
              if (!trimmed) return 'Author Name is required'
              if (trimmed.length > 40)
                return 'Author Name must be 40 characters or less'
              if (trimmed.length < 5)
                return 'Author Name must be 5 characters or more'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Input
                id="author"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                placeholder="Enter your name"
                maxLength={40}
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
        <Label htmlFor="shortDescription">
          Short Description <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="shortDescription"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim()
              if (!trimmed) return 'Short Description is required'
              if (trimmed.length > 150)
                return 'Short Description must be 150 characters or less'
              if (trimmed.length < 5)
                return 'Short Description must be 5 characters or more'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Textarea
                id="shortDescription"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                placeholder="Enter a short description (max 150 characters)"
                maxLength={150}
              />
              <p className="text-sm text-gray-500 mt-1">
                {field.state.value.length}/150 characters
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
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full bg-power-pump-button text-white hover:bg-power-pump-button/90"
          >
            {isSubmitting ? 'Submitting...' : 'Next'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
