import StatefullLayout from '@/app/statefull-layout'
import { CreateEbookContent } from '@/components/create-ebook/create-ebook-content'

export default function CreateEbook() {
  return (
    <StatefullLayout homeRedirect={true}>
      <CreateEbookContent />
    </StatefullLayout>
  )
}
