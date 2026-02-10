import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { ProfileView } from '@/components/ProfileView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const profile = await prisma.profile.findUnique({
    where: { handle },
  })

  if (!profile || !profile.published) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: profile.displayName || profile.handle,
    description: profile.bio || `Check out ${profile.displayName || profile.handle}'s profile`,
    openGraph: {
      title: profile.displayName || profile.handle,
      description: profile.bio || '',
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.displayName || profile.handle,
      description: profile.bio || '',
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: {
      sections: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  if (!profile || !profile.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <ProfileView profile={profile} />
      </div>
    </div>
  )
}
