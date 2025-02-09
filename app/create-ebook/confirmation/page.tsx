import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SubmissionConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6">Submission Received</h1>
      <p className="text-lg text-power-pump-text mb-8">
        Thank you for submitting your eBook. Your application will be reviewed within 3 business days.
      </p>
      <Button
        asChild
        className="bg-power-pump-button text-white hover:bg-power-pump-button/90 rounded-[100px] px-6 py-3 text-base font-bold transition-colors"
      >
        <Link href="/profile">Go to My Profile</Link>
      </Button>
    </div>
  )
}

