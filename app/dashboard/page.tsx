import { redirect } from 'next/navigation'
import { getUserTenants } from '@/lib/auth-helpers'
import Link from 'next/link'

export default async function Dashboard() {
  try {
    const tenants = await getUserTenants()

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold">Profile Builder</h1>
              <div className="flex items-center gap-4">
                <Link
                  href="/api/auth/signout"
                  className="text-red-600 hover:text-red-700"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Workspaces</h2>
            <p className="text-gray-600 mt-2">Manage your workspaces and profiles</p>
          </div>

          {tenants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No workspaces found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-gray-500">/{tenant.slug}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {tenant.role}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Profiles: {tenant.profileCount}
                    </p>
                    <Link
                      href={`/app/${tenant.slug}`}
                      className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full text-center"
                    >
                      Open Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    redirect('/auth/signin')
  }
}
