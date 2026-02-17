'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, Loader2, Upload, X, Check } from 'lucide-react'
import { getThemeList, getTheme, ThemeConfig } from '@/lib/themes'

interface Block {
  id: string
  type: string
  order: number
  isVisible: boolean
  title: string | null
  url: string | null
  description: string | null
  dateRange: string | null
  location: string | null
  price: number | null
  authorName: string | null
  quote: string | null
  phone: string | null
}

interface Profile {
  id: string
  name: string
  headline: string | null
  bio: string | null
  photoUrl: string | null
  videoUrl: string | null
  location: string | null
  theme: string
  blocks: Block[]
}

interface User {
  id: string
  handle: string
  plan: string
}

// Memoized theme list to prevent re-renders from resetting scroll
const THEMES_LIST = getThemeList()

const BLOCK_TYPES = [
  { id: 'LINK', name: 'Link', icon: '🔗' },
  { id: 'RETREAT', name: 'Retreat', icon: '🏕️' },
  { id: 'TESTIMONIAL', name: 'Testimonial', icon: '💬' },
  { id: 'BOOK_CALL', name: 'Book a Call', icon: '📞' },
  { id: 'WHATSAPP', name: 'WhatsApp', icon: '💚' },
  { id: 'TELEGRAM', name: 'Telegram', icon: '✈️' },
]

export default function ProfileEditorPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        const data = await res.json()

        if (!data.success) {
          router.push('/login')
          return
        }

        setProfile(data.data.profile)
        setUser(data.data.user)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSaveProfile = async () => {
    if (!profile) return
    setIsSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          photoUrl: profile.photoUrl,
          location: profile.location,
          theme: profile.theme,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setProfile(data.data.profile)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddBlock = async (type: string) => {
    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, title: 'New ' + type.toLowerCase().replace('_', ' ') }),
      })

      const data = await res.json()
      if (data.success && profile) {
        setProfile({
          ...profile,
          blocks: [...profile.blocks, data.data.block],
        })
        setEditingBlock(data.data.block)
      }
      setShowAddBlock(false)
    } catch (error) {
      console.error('Failed to add block:', error)
    }
  }

  const handleUpdateBlock = async (block: Block) => {
    try {
      const res = await fetch(`/api/blocks/${block.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(block),
      })

      const data = await res.json()
      if (data.success && profile) {
        setProfile({
          ...profile,
          blocks: profile.blocks.map(b => b.id === block.id ? data.data.block : b),
        })
      }
      setEditingBlock(null)
    } catch (error) {
      console.error('Failed to update block:', error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return

    try {
      const res = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()
      if (data.success && profile) {
        setProfile({
          ...profile,
          blocks: profile.blocks.filter(b => b.id !== blockId),
        })
      }
    } catch (error) {
      console.error('Failed to delete block:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-white">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!profile || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href={`/profile/${user.handle}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              target="_blank"
            >
              <Eye className="w-5 h-5" />
              <span className="hidden sm:inline">Preview</span>
            </Link>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-accent-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              data-testid="save-profile-btn"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                data-testid="profile-name-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="Bali, Indonesia"
                data-testid="profile-location-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                type="text"
                value={profile.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="Retreat Leader & Sacred Space Holder"
                data-testid="profile-headline-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                placeholder="Tell your story..."
                data-testid="profile-bio-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setProfile({ ...profile, theme: theme.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      profile.theme === theme.id
                        ? 'border-accent-500 ring-2 ring-accent-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg ${theme.bg} mb-2`} />
                    <span className="text-xs text-gray-600">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blocks */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Blocks</h2>
            <button
              onClick={() => setShowAddBlock(true)}
              className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              data-testid="add-block-btn"
            >
              <Plus className="w-4 h-4" />
              Add Block
            </button>
          </div>

          {profile.blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No blocks yet. Add your first block to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  data-testid={`block-${block.id}`}
                >
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                  <div className="text-2xl">{BLOCK_TYPES.find(t => t.id === block.type)?.icon || '📎'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{block.title || 'Untitled'}</p>
                    <p className="text-sm text-gray-500">{block.type.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={() => setEditingBlock(block)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Block Modal */}
      {showAddBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add Block</h3>
              <button onClick={() => setShowAddBlock(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleAddBlock(type.id)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-gray-800">{type.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Block Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Block</h3>
              <button onClick={() => setEditingBlock(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBlock.title || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>

              {(editingBlock.type === 'LINK' || editingBlock.type === 'RETREAT' || editingBlock.type === 'BOOK_CALL') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={editingBlock.url || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    placeholder="https://"
                  />
                </div>
              )}

              {editingBlock.type === 'RETREAT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <input
                      type="text"
                      value={editingBlock.dateRange || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, dateRange: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      placeholder="March 15-20, 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingBlock.location || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                      placeholder="Ubud, Bali"
                    />
                  </div>
                </>
              )}

              {editingBlock.type === 'TESTIMONIAL' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={editingBlock.authorName || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, authorName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                    <textarea
                      value={editingBlock.quote || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, quote: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {(editingBlock.type === 'WHATSAPP' || editingBlock.type === 'TELEGRAM') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingBlock.phone || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    placeholder="+1234567890"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={editingBlock.isVisible}
                  onChange={(e) => setEditingBlock({ ...editingBlock, isVisible: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isVisible" className="text-sm text-gray-700">Visible on profile</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingBlock(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBlock(editingBlock)}
                className="flex-1 bg-accent-500 text-white py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
