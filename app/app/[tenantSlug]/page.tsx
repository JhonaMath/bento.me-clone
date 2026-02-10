import { redirect } from 'next/navigation'
import { requireTenantMembership } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TenantRole } from '@prisma/client'

export default async function TenantOverview({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const { tenantSlug } = await params
  
  try {
    const { tenant, membership } = await requireTenantMembership(tenantSlug)

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

    const canEdit = ([TenantRole.OWNER, TenantRole.ADMIN, TenantRole.EDITOR] as string[]).includes(membership.role)

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  ← Back
                </Link>
                <h1 className="text-xl font-bold">{tenant.name}</h1>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {membership.role}
                </span>
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
              <h2 className="text-3xl font-bold text-gray-900">Profiles</h2>
              <p className="text-gray-600 mt-1">Manage your public profiles</p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/app/${tenant.slug}/analytics`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Analytics
              </Link>
              {canEdit && (
                <Link
                  href={`/app/${tenant.slug}/profiles`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Manage Profiles
                </Link>
              )}
            </div>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No profiles yet</p>
              {canEdit && (
                <Link
                  href={`/app/${tenant.slug}/profiles`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Create Your First Profile
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {profile.avatarUrl && (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName || profile.handle}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {profile.displayName || profile.handle}
                      </h3>
                      <p className="text-sm text-gray-500">/{profile.handle}</p>
                      {profile.published ? (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <span>{profile._count.sections} sections</span>
                    <span>{profile._count.clicks} clicks</span>
                  </div>

                  <div className="flex gap-2">
                    {profile.published && (
                      <Link
                        href={`/${profile.handle}`}
                        target="_blank"
                        className="flex-1 px-3 py-2 text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                      >
                        View
                      </Link>
                    )}
                    {canEdit && (
                      <Link
                        href={`/editor/${profile.id}`}
                        className="flex-1 px-3 py-2 text-center bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Tenant access error:', error)
    redirect('/dashboard')
  }
}
