'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlockEditor } from './BlockEditor'
import { ProfilePreview } from './ProfilePreview'

type Block = {
  id: string
  type: 'LINK' | 'SOCIAL' | 'EMBED' | 'LIST' | 'TEXT'
  title: string | null
  content: string
  url: string | null
  order: number
  sectionId: string
}

type Section = {
  id: string
  title: string | null
  order: number
  blocks: Block[]
}

type Profile = {
  id: string
  handle: string
  displayName: string | null
  tagline1: string | null
  tagline2: string | null
  bio: string | null
  avatarUrl: string | null
  published: boolean
  sections: Section[]
}

export function ProfileEditor({ profile: initialProfile }: { profile: Profile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)

  const addSection = async () => {
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          order: profile.sections.length,
        }),
      })

      if (response.ok) {
        const newSection = await response.json()
        setProfile({
          ...profile,
          sections: [...profile.sections, newSection],
        })
      }
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const deleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProfile({
          ...profile,
          sections: profile.sections.filter((s) => s.id !== sectionId),
        })
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setProfile({ ...profile, ...updated })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = () => {
    updateProfile({ published: !profile.published })
  }

  return (
    <div className="flex h-screen">
      {/* Editor Panel */}
      <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={togglePublish}
              className={`px-4 py-2 rounded transition ${
                profile.published
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {profile.published ? 'Published' : 'Publish'}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.displayName || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, displayName: e.target.value })
                  }
                  onBlur={(e) => updateProfile({ displayName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Handle
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  value={profile.handle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline 1
                </label>
                <input
                  type="text"
                  placeholder="e.g., 👨‍💻 Full-Stack Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.tagline1 || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, tagline1: e.target.value })
                  }
                  onBlur={(e) => updateProfile({ tagline1: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline 2
                </label>
                <input
                  type="text"
                  placeholder="e.g., 🎮 Game Developer & Content Creator"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.tagline2 || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, tagline2: e.target.value })
                  }
                  onBlur={(e) => updateProfile({ tagline2: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.avatarUrl || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, avatarUrl: e.target.value })
                  }
                  onBlur={(e) => updateProfile({ avatarUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={profile.bio || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  onBlur={(e) => updateProfile({ bio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Sections</h2>
              <button
                onClick={addSection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Section
              </button>
            </div>

            <div className="space-y-6">
              {profile.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      className="text-lg font-semibold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                      placeholder="Section Title"
                      value={section.title || ''}
                      onChange={(e) => {
                        const updated = profile.sections.map((s) =>
                          s.id === section.id
                            ? { ...s, title: e.target.value }
                            : s
                        )
                        setProfile({ ...profile, sections: updated })
                      }}
                      onBlur={async (e) => {
                        await fetch(`/api/sections/${section.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ title: e.target.value }),
                        })
                      }}
                    />
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <BlockEditor
                    section={section}
                    onUpdate={(updatedSection) => {
                      const updated = profile.sections.map((s) =>
                        s.id === section.id ? updatedSection : s
                      )
                      setProfile({ ...profile, sections: updated })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <h3 className="text-lg font-semibold">Live Preview</h3>
        </div>
        <div className="p-6">
          <ProfilePreview profile={profile} />
        </div>
      </div>
    </div>
  )
}
