'use client'

import { useState } from 'react'

import { CreateBookCallParams } from '@/api/book/create-book'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { NumberInput } from '../ui/number-input'

interface MintingDetailsProps {
  formData: Partial<CreateBookCallParams>
  updateFormData: (data: Partial<CreateBookCallParams>) => void
  onNext: () => void
  onPrev: () => void
}

export function MintingDetails({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: MintingDetailsProps) {
  const [errors, setErrors] = useState({
    mintPrice: '',
    totalCopies: '',
    mintStartDate: '',
    mintEndDate: '',
  })

  const validate = () => {
    let isValid = true
    const newErrors = {
      mintPrice: '',
      totalCopies: '',
      mintStartDate: '',
      mintEndDate: '',
    }

    if (!formData.mintPrice && formData.mintPrice !== 0) {
      newErrors.mintPrice = 'Mint Price is required'
      isValid = false
    } else if (
      isNaN(Number(formData.mintPrice)) ||
      Number(formData.mintPrice) < 0
    ) {
      newErrors.mintPrice = 'Please enter a valid mint price'
      isValid = false
    }

    if (!formData.totalCopies) {
      newErrors.totalCopies = 'Total Copies is required'
      isValid = false
    } else if (
      isNaN(Number(formData.totalCopies)) ||
      Number(formData.totalCopies) <= 0
    ) {
      newErrors.totalCopies = 'Please enter a valid number of copies'
      isValid = false
    }

    if (!formData.mintStartDate) {
      newErrors.mintStartDate = 'Mint Date is required'
      isValid = false
    }

    if (
      formData.mintEndDate &&
      formData.mintStartDate &&
      formData.mintEndDate < formData.mintStartDate
    ) {
      newErrors.mintEndDate =
        'Mint End Date must be after Mint Start Date or empty'
      isValid = false
    }

    // if mint end date is today or in the past, show error
    if (formData.mintEndDate && formData.mintEndDate < new Date()) {
      newErrors.mintEndDate = 'Mint End Date must be in the future'
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
        <Label htmlFor="mintPrice">
          Mint Price (SOL) <span className="text-red-600">*</span>
        </Label>
        <NumberInput
          id="mintPrice"
          initialValue={formData.mintPrice ?? 0}
          onChange={(value) => updateFormData({ mintPrice: value })}
          allowDecimal={true}
          maxDecimals={5}
        />
        {errors.mintPrice && (
          <p className="text-red-500 text-sm mt-1">{errors.mintPrice}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Set to 0 if you want to offer the eBook for free. Royalties are fixed
          at 5% (4% to the writer, 1% to the platform).
        </p>
      </div>
      <div>
        <Label htmlFor="totalCopies">
          Total Copies for Sale <span className="text-red-600">*</span>
        </Label>
        <NumberInput
          id="totalCopies"
          initialValue={formData.totalCopies ?? 0}
          onChange={(value) => updateFormData({ totalCopies: value })}
          allowDecimal={false}
        />
        {errors.totalCopies && (
          <p className="text-red-500 text-sm mt-1">{errors.totalCopies}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mintDate">
          Mint Start Date <span className="text-red-600">*</span>
        </Label>
        <Input
          id="mintStartDate"
          type="date"
          value={formData.mintStartDate?.toISOString().split('T')[0]}
          onChange={(e) =>
            updateFormData({ mintStartDate: new Date(e.target.value) })
          }
        />
        {errors.mintStartDate && (
          <p className="text-red-500 text-sm mt-1">{errors.mintStartDate}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mintEndDate">Mint End Date</Label>
        <Input
          id="mintEndDate"
          type="date"
          value={formData.mintEndDate?.toISOString().split('T')[0]}
          onChange={(e) =>
            updateFormData({
              mintEndDate: e.target.value ? new Date(e.target.value) : null,
            })
          }
        />
        {errors.mintEndDate && (
          <p className="text-red-500 text-sm mt-1">{errors.mintEndDate}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Mints remain open for seven days or until all NFTs are minted.
        </p>
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
        <Button
          type="submit"
          className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90"
        >
          Next
        </Button>
      </div>
    </form>
  )
}
