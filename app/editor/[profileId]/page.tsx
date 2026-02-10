import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileEditor } from '@/components/ProfileEditor'

export default async function EditorPage({
  params,
}: {
  params: { profileId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id

  const profile = await prisma.profile.findFirst({
    where: {
      id: params.profileId,
      tenant: {
        ownerId: userId,
      },
    },
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

  if (!profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileEditor profile={profile} />
    </div>
  )
}
