'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MintingDetailsProps {
  formData: {
    mintPrice: string
    totalCopies: string
    mintDate: string
    mintTime: string
  }
  updateFormData: (data: Partial<MintingDetailsProps['formData']>) => void
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
    mintDate: '',
    mintTime: '',
  })

  const validate = () => {
    let isValid = true
    const newErrors = {
      mintPrice: '',
      totalCopies: '',
      mintDate: '',
      mintTime: '',
    }

    if (!formData.mintPrice.trim()) {
      newErrors.mintPrice = 'Mint Price is required'
      isValid = false
    } else if (
      isNaN(Number(formData.mintPrice)) ||
      Number(formData.mintPrice) < 0
    ) {
      newErrors.mintPrice = 'Please enter a valid mint price'
      isValid = false
    }

    if (!formData.totalCopies.trim()) {
      newErrors.totalCopies = 'Total Copies is required'
      isValid = false
    } else if (
      isNaN(Number(formData.totalCopies)) ||
      Number(formData.totalCopies) <= 0
    ) {
      newErrors.totalCopies = 'Please enter a valid number of copies'
      isValid = false
    }

    if (!formData.mintDate.trim()) {
      newErrors.mintDate = 'Mint Date is required'
      isValid = false
    }

    if (!formData.mintTime.trim()) {
      newErrors.mintTime = 'Mint Time is required'
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
        <Label htmlFor="mintPrice">Mint Price (SOL)</Label>
        <Input
          id="mintPrice"
          type="number"
          step="0.01"
          value={formData.mintPrice}
          onChange={(e) => updateFormData({ mintPrice: e.target.value })}
          placeholder="Enter the mint price in SOL"
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
        <Label htmlFor="totalCopies">Total Copies for Sale</Label>
        <Input
          id="totalCopies"
          type="number"
          value={formData.totalCopies}
          onChange={(e) => updateFormData({ totalCopies: e.target.value })}
          placeholder="Enter the total number of copies"
        />
        {errors.totalCopies && (
          <p className="text-red-500 text-sm mt-1">{errors.totalCopies}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mintDate">Mint Start Date</Label>
        <Input
          id="mintDate"
          type="date"
          value={formData.mintDate}
          onChange={(e) => updateFormData({ mintDate: e.target.value })}
        />
        {errors.mintDate && (
          <p className="text-red-500 text-sm mt-1">{errors.mintDate}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mintTime">Mint Start Time (UTC)</Label>
        <Input
          id="mintTime"
          type="time"
          value={formData.mintTime}
          onChange={(e) => updateFormData({ mintTime: e.target.value })}
        />
        {errors.mintTime && (
          <p className="text-red-500 text-sm mt-1">{errors.mintTime}</p>
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
