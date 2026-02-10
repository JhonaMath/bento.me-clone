'use client'

import { useState } from 'react'

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

export function BlockEditor({
  section,
  onUpdate,
}: {
  section: Section
  onUpdate: (section: Section) => void
}) {
  const [blockType, setBlockType] = useState<string>('LINK')

  const addBlock = async () => {
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: section.id,
          type: blockType,
          order: section.blocks.length,
        }),
      })

      if (response.ok) {
        const newBlock = await response.json()
        onUpdate({
          ...section,
          blocks: [...section.blocks, newBlock],
        })
      }
    } catch (error) {
      console.error('Error adding block:', error)
    }
  }

  const updateBlock = async (blockId: string, updates: Partial<Block>) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedBlocks = section.blocks.map((b) =>
          b.id === blockId ? { ...b, ...updates } : b
        )
        onUpdate({ ...section, blocks: updatedBlocks })
      }
    } catch (error) {
      console.error('Error updating block:', error)
    }
  }

  const deleteBlock = async (blockId: string) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate({
          ...section,
          blocks: section.blocks.filter((b) => b.id !== blockId),
        })
      }
    } catch (error) {
      console.error('Error deleting block:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={blockType}
          onChange={(e) => setBlockType(e.target.value)}
        >
          <option value="LINK">Link</option>
          <option value="SOCIAL">Social</option>
          <option value="EMBED">Embed</option>
          <option value="LIST">List</option>
          <option value="TEXT">Text</option>
        </select>
        <button
          onClick={addBlock}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
        >
          Add Block
        </button>
      </div>

      <div className="space-y-3">
        {section.blocks.map((block) => (
          <div
            key={block.id}
            className="border border-gray-200 rounded p-3 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                {block.type}
              </span>
              <button
                onClick={() => deleteBlock(block.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2">
              {(block.type === 'LINK' ||
                block.type === 'SOCIAL' ||
                block.type === 'LIST') && (
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title"
                  value={block.title || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { title: e.target.value })
                  }
                />
              )}

              {(block.type === 'LINK' || block.type === 'SOCIAL') && (
                <input
                  type="url"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL"
                  value={block.url || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { url: e.target.value })
                  }
                />
              )}

              {block.type === 'TEXT' && (
                <textarea
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Text content"
                  rows={3}
                  value={block.content || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { content: e.target.value })
                  }
                />
              )}

              {block.type === 'EMBED' && (
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube, Spotify, or Twitch URL"
                  value={block.content || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { content: e.target.value })
                  }
                />
              )}

              {block.type === 'LIST' && (
                <textarea
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List items (one per line)"
                  rows={3}
                  value={block.content || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { content: e.target.value })
                  }
                />
              )}

              {block.type === 'SOCIAL' && (
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Platform (e.g., twitter, github, linkedin)"
                  value={block.content || ''}
                  onChange={(e) =>
                    updateBlock(block.id, { content: e.target.value })
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
