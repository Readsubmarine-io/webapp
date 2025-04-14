import Link from 'next/link'

import StatefullLayout from '@/app/statefull-layout'
import { Button } from '@/components/ui/button'

export default async function SubmissionConfirmationPage() {
  return (
    <StatefullLayout>
      <div className="flex flex-col items-center justify-center mx-auto px-4 py-8 text-center h-[50vh]">
        <h1 className="text-3xl font-bold text-power-pump-heading mb-6">
          Submission Received
        </h1>
        <p className="text-lg text-power-pump-text mb-8">
          Thank you for submitting your eBook. Your application will be reviewed
          within 3 business days.
        </p>
        <Button
          asChild
          className="bg-power-pump-button text-white hover:bg-power-pump-button/90 rounded-[100px] px-6 py-3 text-base font-bold transition-colors"
        >
          <Link href="/profile">Go to My Profile</Link>
        </Button>
      </div>
    </StatefullLayout>
  )
}
