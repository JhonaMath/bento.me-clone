import { redirect } from 'next/navigation'
import { requireTenantMembership } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const { tenantSlug } = await params
  
  try {
    const { tenant, membership } = await requireTenantMembership(tenantSlug)

    // Get date ranges
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get click statistics
    const [
      totalClicks,
      clicks7Days,
      clicks30Days,
      clicksByProfile,
      recentClicks,
    ] = await Promise.all([
      // Total clicks all time
      prisma.click.count({
        where: { tenantId: tenant.id },
      }),
      
      // Clicks in last 7 days
      prisma.click.count({
        where: {
          tenantId: tenant.id,
          createdAt: { gte: last7Days },
        },
      }),
      
      // Clicks in last 30 days
      prisma.click.count({
        where: {
          tenantId: tenant.id,
          createdAt: { gte: last30Days },
        },
      }),
      
      // Clicks by profile
      prisma.click.groupBy({
        by: ['profileId'],
        where: { tenantId: tenant.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      
      // Recent clicks
      prisma.click.findMany({
        where: { tenantId: tenant.id },
        include: {
          profile: { select: { handle: true, displayName: true } },
          block: { select: { title: true, type: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    // Get profile details for click stats
    const profileIds = clicksByProfile.map((c) => c.profileId)
    const profiles = await prisma.profile.findMany({
      where: { id: { in: profileIds } },
      select: { id: true, handle: true, displayName: true },
    })

    const profileMap = new Map(profiles.map((p) => [p.id, p]))
    const topProfiles = clicksByProfile.map((c) => ({
      profile: profileMap.get(c.profileId),
      clicks: c._count.id,
    }))

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href={`/app/${tenant.slug}`} className="text-gray-600 hover:text-gray-900">
                  ← Back
                </Link>
                <h1 className="text-xl font-bold">Analytics - {tenant.name}</h1>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Click Analytics</h2>
            <p className="text-gray-600 mt-1">Track performance of your links and profiles</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Last 7 Days</h3>
              <p className="text-3xl font-bold text-gray-900">{clicks7Days.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">clicks</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Last 30 Days</h3>
              <p className="text-3xl font-bold text-gray-900">{clicks30Days.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">clicks</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">All Time</h3>
              <p className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">total clicks</p>
            </div>
          </div>

          {/* Top Profiles */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Top Profiles by Clicks</h3>
            </div>
            <div className="p-6">
              {topProfiles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No click data yet</p>
              ) : (
                <div className="space-y-4">
                  {topProfiles.map((item) => {
                    if (!item.profile?.id) return null; // Skip items with missing profile data
                    
                    return (
                      <div key={item.profile.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500 w-6">
                            #{topProfiles.indexOf(item) + 1}
                          </span>
                          <div>
                            <p className="font-medium">{item.profile.displayName || item.profile.handle}</p>
                            <p className="text-sm text-gray-500">/{item.profile.handle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{item.clicks.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">clicks</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Clicks */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Clicks</h3>
            </div>
            <div className="overflow-x-auto">
              {recentClicks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No clicks yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentClicks.map((click) => (
                      <tr key={click.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>
                            <p className="font-medium">{click.profile.displayName || click.profile.handle}</p>
                            <p className="text-gray-500">/{click.profile.handle}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {click.block ? (
                            <div>
                              <p className="font-medium">{click.block.title || 'Untitled'}</p>
                              <p className="text-gray-500">{click.block.type}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={click.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                          >
                            {click.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(click.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Analytics access error:', error)
    redirect('/dashboard')
  }
}
