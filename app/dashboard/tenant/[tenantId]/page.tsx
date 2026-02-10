import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CreateProfileButton } from '@/components/CreateProfileButton'

export default async function TenantPage({
  params,
}: {
  params: { tenantId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id

  const tenant = await prisma.tenant.findFirst({
    where: {
      id: params.tenantId,
      ownerId: userId,
    },
    include: {
      profiles: {
        include: {
          sections: {
            include: {
              blocks: true,
            },
          },
        },
      },
    },
  })

  if (!tenant) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold">{tenant.name}</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Profiles</h2>
          <CreateProfileButton tenantId={tenant.id} />
        </div>

        {tenant.profiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No profiles yet</p>
            <CreateProfileButton tenantId={tenant.id} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenant.profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">
                    {profile.displayName || profile.handle}
                  </h3>
                  <p className="text-sm text-gray-600">@{profile.handle}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Sections: {profile.sections.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Blocks:{' '}
                    {profile.sections.reduce(
                      (acc, s) => acc + s.blocks.length,
                      0
                    )}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/editor/${profile.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/${profile.handle}`}
                      target="_blank"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
