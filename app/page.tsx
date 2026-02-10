import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to Profile Builder
        </h1>
        <p className="text-xl mb-8">
          Create your personalized profile page and share it with the world
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
