'use client'

type Block = {
  id: string
  type: 'LINK' | 'SOCIAL' | 'EMBED' | 'LIST' | 'TEXT'
  title: string | null
  content: string
  url: string | null
  order: number
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
  bio: string | null
  avatarUrl: string | null
  sections: Section[]
}

export function ProfileView({ profile }: { profile: Profile }) {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'LINK':
        return (
          <a
            href={`/go/${profile.handle}/${block.id}`}
            className="block w-full px-6 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <span className="font-medium text-gray-900">{block.title}</span>
          </a>
        )

      case 'SOCIAL':
        return (
          <a
            href={`/go/${profile.handle}/${block.id}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <span className="font-medium text-gray-900">{block.title}</span>
          </a>
        )

      case 'TEXT':
        return (
          <div className="px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">{block.content}</p>
          </div>
        )

      case 'LIST':
        return (
          <div className="px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            {block.title && (
              <h4 className="font-medium text-gray-900 mb-2">{block.title}</h4>
            )}
            <ul className="space-y-1">
              {block.content.split('\n').filter(Boolean).map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'EMBED':
        return <EmbedBlock url={block.content} />

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName || profile.handle}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {profile.displayName || profile.handle}
        </h1>
        {profile.bio && (
          <p className="text-gray-600 text-lg">{profile.bio}</p>
        )}
      </div>

      <div className="space-y-8">
        {profile.sections.map((section) => (
          <div key={section.id}>
            {section.title && (
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="space-y-3">
              {section.blocks.map((block) => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmbedBlock({ url }: { url: string }) {
  const getEmbedHtml = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    )
    if (youtubeMatch) {
      return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    // Spotify
    const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
    if (spotifyMatch) {
      return (
        <iframe
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="shadow-md"
        />
      )
    }

    // Twitch
    const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/)
    if (twitchMatch) {
      return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            src={`https://player.twitch.tv/?channel=${twitchMatch[1]}&parent=${typeof window !== 'undefined' ? window.location.hostname : ''}`}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        </div>
      )
    }

    return (
      <div className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-lg">
        <p className="text-gray-600 text-sm">Embed: {url}</p>
      </div>
    )
  }

  return <div>{getEmbedHtml(url)}</div>
}
