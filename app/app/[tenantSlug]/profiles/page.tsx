import { redirect } from 'next/navigation'
import { requireTenantMembership } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TenantRole } from '@prisma/client'
import { CreateProfileButton } from '@/components/CreateProfileButton'

export default async function ProfilesPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const { tenantSlug } = await params
  
  try {
    const { tenant, membership } = await requireTenantMembership(
      tenantSlug,
      TenantRole.EDITOR
    )

    const profiles = await prisma.profile.findMany({
      where: { tenantId: tenant.id },
      include: {
        _count: {
          select: {
            sections: true,
            clicks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href={`/app/${tenant.slug}`} className="text-gray-600 hover:text-gray-900">
                  ← Back
                </Link>
                <h1 className="text-xl font-bold">Profiles - {tenant.name}</h1>
              </div>
              <Link
                href="/api/auth/signout"
                className="text-red-600 hover:text-red-700"
              >
                Sign out
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Manage Profiles</h2>
              <p className="text-gray-600 mt-1">Create and edit your public profiles</p>
            </div>
            <CreateProfileButton tenantId={tenant.id} />
          </div>

          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {profile.avatarUrl && (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName || profile.handle}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {profile.displayName || profile.handle}
                      </h3>
                      <p className="text-sm text-gray-500">/{profile.handle}</p>
                    </div>
                    {profile.published ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {profile.published && (
                      <Link
                        href={`/${profile.handle}`}
                        target="_blank"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        View
                      </Link>
                    )}
                    <Link
                      href={`/editor/${profile.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-gray-600 mt-4">{profile.bio}</p>
                )}

                <div className="flex gap-6 text-sm text-gray-600 mt-4">
                  <span>{profile._count.sections} sections</span>
                  <span>{profile._count.clicks} total clicks</span>
                  <span>Created {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {profiles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">No profiles yet</p>
                <p className="text-sm text-gray-400">Create your first profile to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Profile access error:', error)
    redirect('/dashboard')
  }
}
