'use client'

import { useForm } from '@tanstack/react-form'
import { DateTime } from 'luxon'

import { CreateEbookFormData } from '@/components/create-ebook/create-ebook-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'

interface MintingDetailsProps {
  formData: Partial<CreateEbookFormData>
  updateFormData: (data: Partial<CreateEbookFormData>) => void
  onNext: () => void
  onPrev: () => void
}

export function MintingDetails({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: MintingDetailsProps) {
  const form = useForm({
    defaultValues: {
      mintPrice: formData.mintPrice ?? 0,
      totalCopies: formData.totalCopies ?? 0,
      mintStartDate: formData.mintStartDate || DateTime.utc().toJSDate(),
      mintEndDate: formData.mintEndDate || null,
    },
    onSubmit: async ({ value }) => {
      updateFormData({
        ...value,
        mintEndDate:
          value.mintEndDate ||
          DateTime.fromJSDate(value.mintStartDate).plus({ days: 7 }).toJSDate(),
      })
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
        <Label htmlFor="mintPrice">
          Mint Price (SOL) <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="mintPrice"
          validators={{
            onChange: ({ value }) => {
              if (value === undefined || value === null)
                return 'Mint Price is required'
              if (isNaN(Number(value)) || Number(value) < 0)
                return 'Please enter a valid mint price'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <NumberInput
                id="mintPrice"
                initialValue={Number(field.state.value)}
                onChange={(value) => {
                  field.handleChange(value)
                  field.handleBlur()
                }}
                allowDecimal={true}
                maxDecimals={5}
                min={0}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              <p className="text-sm text-gray-500 mt-1">
                Set to 0 if you want to offer the eBook for free. Royalties are
                fixed at 5% (4% to the writer, 1% to the platform).
              </p>
            </>
          )}
        </form.Field>
      </div>
      <div>
        <Label htmlFor="totalCopies">
          Total Copies for Sale <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="totalCopies"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Total Copies is required'
              if (isNaN(Number(value)) || Number(value) <= 0)
                return 'Please enter a valid number of copies'
              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <NumberInput
                id="totalCopies"
                initialValue={Number(field.state.value)}
                onChange={(value) => {
                  field.handleChange(value)
                  field.handleBlur()
                }}
                allowDecimal={false}
                min={0}
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
        <Label htmlFor="mintStartDate">
          Mint Start Date & Time (UTC) <span className="text-red-600">*</span>
        </Label>
        <form.Field
          name="mintStartDate"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Mint Date is required'

              const now = DateTime.utc()
              const selectedDate = DateTime.fromJSDate(value, {
                zone: 'utc',
              })

              const diffHours =
                (selectedDate.valueOf() - now.valueOf()) / 3600 / 1000

              if (diffHours < -1) {
                return 'Mint start date could not be in the past more than 1 hour. (UTC)'
              }

              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Input
                id="mintStartDate"
                type="datetime-local"
                value={field.state.value?.toISOString().slice(0, 16)}
                onChange={(e) => {
                  field.handleChange(
                    DateTime.fromISO(e.target.value, {
                      zone: 'utc',
                    }).toJSDate(),
                  )
                }}
                onBlur={() => field.handleBlur()}
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
        <Label htmlFor="mintEndDate">Mint End Date & Time (UTC)</Label>
        <form.Field
          name="mintEndDate"
          validators={{
            onChange: ({ value }) => {
              // Access mintStartDate from form state
              const startDate = form.getFieldValue('mintStartDate')

              if (
                value &&
                DateTime.fromJSDate(value) <= DateTime.fromJSDate(startDate)
              ) {
                return 'Mint End Date must be after Mint Start Date & Time (UTC)'
              }

              return undefined
            },
          }}
        >
          {(field) => (
            <>
              <Input
                id="mintEndDate"
                type="datetime-local"
                value={field.state.value?.toISOString().slice(0, 16) || ''}
                onChange={(e) => {
                  field.handleChange(
                    e.target.value
                      ? DateTime.fromISO(e.target.value, {
                          zone: 'utc',
                        }).toJSDate()
                      : null,
                  )
                }}
                onBlur={() => field.handleBlur()}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              <p className="text-sm text-gray-500 mt-1">
                Mint remains open until end date & time or until all NFTs are
                minted. Default is 7 days after the start date & time.
              </p>
            </>
          )}
        </form.Field>
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          onClick={onPrev}
          variant="outline"
          className="w-[48%]"
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
              className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90"
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
