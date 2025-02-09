import { notFound } from "next/navigation"
import { LaunchpadProjectContent } from "@/components/launchpad/launchpad-project-content"

interface Project {
  id: string
  title: string
  author: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  coverImage: string
  description: string
  price: {
    amount: number
    currency: string
  }
  totalSupply: number
  mintedSupply: number
  backers: number
  raisedAmount: number
  mintStart: string
  mintEnd: string
  details: {
    pages: number
    categories: string[]
    publishedDate: string
  }
}

async function getProject(id: string): Promise<Project | null> {
  // In a real application, you would fetch this data from an API
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API delay

  // Simulate a not found scenario for certain IDs
  if (id === "999") {
    return null
  }

  return {
    id,
    title: "The Quantum Nexus",
    author: {
      name: "Dr. Amelia Quantum",
      title: "Physicist and Philosopher",
      bio: "Dr. Amelia Quantum is a world-renowned physicist and philosopher, known for her groundbreaking work in quantum mechanics and its philosophical implications. She has authored numerous books and papers, bridging the gap between science and philosophy.",
      avatar: "/placeholder.svg",
    },
    coverImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "The Quantum Nexus is a groundbreaking exploration of the intersection between quantum physics and consciousness. Dr. Amelia Quantum takes readers on a mind-bending journey through the fabric of reality, challenging our perceptions of time, space, and the nature of existence itself.",
    price: {
      amount: 1.5,
      currency: "SOL",
    },
    totalSupply: 1000,
    mintedSupply: 750,
    backers: 450,
    raisedAmount: 1125,
    mintStart: "2025-02-10T15:00:00Z",
    mintEnd: "2025-02-17T15:00:00Z",
    details: {
      pages: 342,
      categories: ["Science", "Philosophy", "Quantum Physics"],
      publishedDate: "May 15, 2025",
    },
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }
  return {
    title: `${project.title} | Power Pump Launchpad`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return <LaunchpadProjectContent project={project} />
}

