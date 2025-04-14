'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import {
  CreateBookCallParams,
  useCreateBookMutation,
} from '@/api/book/create-book'
import { AdditionalDetails } from '@/components/create-ebook/additional-details'
import { ContractsDeploy } from '@/components/create-ebook/contracts-deploy'
import { FileUploads } from '@/components/create-ebook/file-uploads'
import { InitialInformation } from '@/components/create-ebook/initial-information'
import { MintingDetails } from '@/components/create-ebook/minting-details'

const steps = [
  'Initial Information',
  'Additional Details',
  'Minting Details',
  'File Uploads',
  'Blockchain Deployment',
]

export function CreateEbookContent() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateBookCallParams>>({
    title: '',
    author: '',
    shortDescription: '',
    longDescription: '',
    genres: [],
    pages: 0,
    mintPrice: 0,
    totalCopies: 0,
    mintStartDate: new Date(),
    mintEndDate: undefined,
    coverImage: undefined,
    pdf: undefined,
    metadata: undefined,
    collectionAddress: '',
    mintAddress: '',
    contactEmail: '',
  })

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }))
  }

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const { mutateAsync: createBook } = useCreateBookMutation()
  const router = useRouter()

  const completeBookCreation = useCallback(async () => {
    await createBook(formData as CreateBookCallParams)
    router.push(`/create-ebook/confirmation`)
  }, [createBook, formData, router])

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <InitialInformation
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <AdditionalDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 2:
        return (
          <MintingDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <FileUploads
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <ContractsDeploy
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onComplete={completeBookCreation}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6">
        Create Your NFT eBook
      </h1>
      <div className="mb-8">
        <ol className="flex flex-wrap items-center w-full p-2 space-x-1 lg:space-x-2 text-xs lg:text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`flex items-center ${index < steps.length - 1 ? 'w-full lg:w-auto flex-1' : ''} mb-2 lg:mb-0`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 mr-2 text-xs rounded-full shrink-0 transition-all ${
                  index <= currentStep
                    ? 'bg-power-pump-button text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </span>
              <span className="hidden lg:inline mr-2">{step}</span>
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div
                    className={`w-full h-1 rounded ${index < currentStep ? 'bg-power-pump-button' : 'bg-gray-200'}`}
                  ></div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      {renderStep()}
    </div>
  )
}
