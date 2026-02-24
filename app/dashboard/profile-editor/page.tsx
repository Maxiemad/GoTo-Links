'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Plus, Trash2, Eye, Loader2, X, Check, ChevronUp, ChevronDown, Layers, AlertCircle, CheckCircle, Camera, Upload } from 'lucide-react'
import { getThemeList, getTheme } from '../../../lib/themes'
import SectionEditor from '../../components/SectionEditor'
import { 
  LinkIcon3D, 
  RetreatIcon3D, 
  QuoteIcon3D, 
  PhoneIcon3D,
  HeartIcon3D,
  SparkleIcon3D
} from '../../components/Icons3D'

// Toast notification component
interface Toast {
  id: string
  type: 'success' | 'error'
  message: string
}

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[], onDismiss: (id: string) => void }) => (
  <div className="fixed bottom-4 right-4 z-[100] space-y-2">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}
        data-testid={`toast-${toast.type}`}
      >
        {toast.type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
        <button 
          onClick={() => onDismiss(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
)

// Helper to render block type icons
const BlockTypeIcon = ({ type, size = 20 }: { type: string; size?: number }) => {
  switch (type) {
    case 'LINK':
      return <LinkIcon3D size={size} />
    case 'RETREAT':
      return <RetreatIcon3D size={size} />
    case 'TESTIMONIAL':
      return <QuoteIcon3D size={size} />
    case 'BOOK_CALL':
      return <PhoneIcon3D size={size} />
    case 'WHATSAPP':
      return <HeartIcon3D size={size} />
    case 'TELEGRAM':
      return <SparkleIcon3D size={size} />
    default:
      return <LinkIcon3D size={size} />
  }
}

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

// Tab type for dashboard navigation
type EditorTab = 'profile' | 'blocks' | 'sections'

const BLOCK_TYPES = [
  { id: 'LINK', name: 'Link' },
  { id: 'RETREAT', name: 'Retreat' },
  { id: 'TESTIMONIAL', name: 'Testimonial' },
  { id: 'BOOK_CALL', name: 'Book a Call' },
  { id: 'WHATSAPP', name: 'WhatsApp' },
  { id: 'TELEGRAM', name: 'Telegram' },
]

export default function ProfileEditorPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingTheme, setIsSavingTheme] = useState(false)
  const [isSavingBlock, setIsSavingBlock] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [activeTab, setActiveTab] = useState<EditorTab>('profile')
  const [toasts, setToasts] = useState<Toast[]>([])
  const themeScrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Toast helper functions
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Please upload a JPG, PNG, or WEBP image')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      showToast('error', 'Image must be less than 5MB')
      return
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)
    setIsUploadingPhoto(true)

    try {
      // Get upload signature from backend
      const signatureRes = await fetch('/api/upload/signature?folder=profiles&resource_type=image', {
        credentials: 'include',
      })
      const signatureData = await signatureRes.json()

      if (!signatureData.success) {
        throw new Error(signatureData.error || 'Failed to get upload signature')
      }

      const { timestamp, signature, cloudName, apiKey, folder } = signatureData.data

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', apiKey)
      formData.append('timestamp', timestamp.toString())
      formData.append('signature', signature)
      formData.append('folder', folder)
      formData.append('transformation', 'c_fill,w_400,h_400,q_auto,f_auto')

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const uploadData = await uploadRes.json()

      if (uploadData.error) {
        throw new Error(uploadData.error.message || 'Upload failed')
      }

      // Update profile with new photo URL
      const photoUrl = uploadData.secure_url

      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photoUrl }),
      })

      const updateData = await updateRes.json()

      if (updateData.success) {
        setProfile(prev => prev ? { ...prev, photoUrl } : null)
        showToast('success', 'Profile picture updated')
      } else {
        throw new Error(updateData.error || 'Failed to save profile picture')
      }
    } catch (error) {
      console.error('Photo upload error:', error)
      showToast('error', error instanceof Error ? error.message : 'Failed to upload photo')
      // Revert preview
      setPhotoPreview(null)
    } finally {
      setIsUploadingPhoto(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle remove profile photo
  const handleRemovePhoto = async () => {
    if (!profile?.photoUrl) return

    if (!confirm('Are you sure you want to remove your profile picture?')) return

    setIsUploadingPhoto(true)

    try {
      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: null }),
      })

      const updateData = await updateRes.json()

      if (updateData.success) {
        setProfile(prev => prev ? { ...prev, photoUrl: null } : null)
        setPhotoPreview(null)
        showToast('success', 'Profile picture removed')
      } else {
        throw new Error(updateData.error || 'Failed to remove profile picture')
      }
    } catch (error) {
      console.error('Remove photo error:', error)
      showToast('error', 'Failed to remove profile picture')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

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

  // Separate theme update function that persists to DB immediately
  const handleThemeChange = useCallback(async (themeId: string) => {
    if (!profile || profile.theme === themeId) return
    
    // Update local state immediately for instant UI feedback
    setProfile(prev => prev ? { ...prev, theme: themeId } : null)
    setIsSavingTheme(true)
    
    try {
      const res = await fetch('/api/profile/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ theme: themeId }),
      })
      
      const data = await res.json()
      if (!data.success) {
        // Revert on error
        setProfile(prev => prev ? { ...prev, theme: profile.theme } : null)
        console.error('Failed to update theme:', data.error)
      }
    } catch (error) {
      // Revert on error
      setProfile(prev => prev ? { ...prev, theme: profile.theme } : null)
      console.error('Failed to update theme:', error)
    } finally {
      setIsSavingTheme(false)
    }
  }, [profile])

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
    if (isSavingBlock) return
    setIsSavingBlock(true)
    
    try {
      console.log('[Frontend] Adding block of type:', type)
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, title: 'New ' + type.toLowerCase().replace('_', ' ') }),
      })

      const data = await res.json()
      console.log('[Frontend] Add block response:', data)
      
      if (data.success && profile) {
        setProfile({
          ...profile,
          blocks: [...profile.blocks, data.data.block],
        })
        setEditingBlock(data.data.block)
        showToast('success', 'Block added successfully')
      } else {
        showToast('error', data.error || 'Failed to add block')
      }
      setShowAddBlock(false)
    } catch (error) {
      console.error('[Frontend] Failed to add block:', error)
      showToast('error', 'Failed to add block. Please try again.')
    } finally {
      setIsSavingBlock(false)
    }
  }

  const handleUpdateBlock = async (block: Block) => {
    if (isSavingBlock || !profile) return
    setIsSavingBlock(true)
    
    // Store original blocks for potential rollback
    const originalBlocks = [...profile.blocks]
    
    try {
      console.log('[Frontend] Updating block:', block.id, block)
      
      const res = await fetch(`/api/blocks/${block.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: block.title,
          url: block.url,
          description: block.description,
          dateRange: block.dateRange,
          location: block.location,
          price: block.price,
          authorName: block.authorName,
          quote: block.quote,
          phone: block.phone,
          isVisible: block.isVisible,
          order: block.order,
        }),
      })

      const data = await res.json()
      console.log('[Frontend] Update block response:', data)
      
      if (data.success) {
        // Use server response to update state (ensures consistency)
        setProfile({
          ...profile,
          blocks: profile.blocks.map(b => b.id === block.id ? data.data.block : b),
        })
        setEditingBlock(null)
        showToast('success', 'Block saved successfully')
      } else {
        // Don't close modal on error - let user retry
        console.error('[Frontend] Update failed:', data.error)
        showToast('error', data.error || 'Failed to save block')
      }
    } catch (error) {
      console.error('[Frontend] Failed to update block:', error)
      showToast('error', 'Network error. Please try again.')
    } finally {
      setIsSavingBlock(false)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return
    if (!profile) return

    // Store original for rollback
    const originalBlocks = [...profile.blocks]
    
    // Optimistic update
    setProfile({
      ...profile,
      blocks: profile.blocks.filter(b => b.id !== blockId),
    })

    try {
      console.log('[Frontend] Deleting block:', blockId)
      const res = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()
      console.log('[Frontend] Delete block response:', data)
      
      if (data.success) {
        showToast('success', 'Block deleted')
      } else {
        // Rollback on error
        setProfile({
          ...profile,
          blocks: originalBlocks,
        })
        showToast('error', data.error || 'Failed to delete block')
      }
    } catch (error) {
      console.error('[Frontend] Failed to delete block:', error)
      // Rollback on error
      setProfile({
        ...profile,
        blocks: originalBlocks,
      })
      showToast('error', 'Network error. Please try again.')
    }
  }

  const handleReorderBlock = async (blockId: string, direction: 'up' | 'down') => {
    if (!profile || isReordering) return
    
    const currentIndex = profile.blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= profile.blocks.length) return
    
    // Store original for rollback
    const originalBlocks = [...profile.blocks]
    
    // Create new order
    const newBlocks = [...profile.blocks]
    const [movedBlock] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    
    // Update order property for optimistic UI
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }))
    
    // Optimistic update
    setProfile({
      ...profile,
      blocks: reorderedBlocks,
    })
    
    setIsReordering(true)
    
    // Persist to backend
    try {
      console.log('[Frontend] Reordering blocks:', reorderedBlocks.map(b => b.id))
      
      const res = await fetch('/api/blocks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          blockIds: reorderedBlocks.map(b => b.id),
        }),
      })
      
      const data = await res.json()
      console.log('[Frontend] Reorder response:', data)
      
      if (data.success) {
        // Use server response to ensure consistency
        setProfile({
          ...profile,
          blocks: data.data.blocks,
        })
        // No toast for reorder to avoid spam
      } else {
        // Rollback on error
        setProfile({
          ...profile,
          blocks: originalBlocks,
        })
        console.error('[Frontend] Reorder failed:', data.error)
        showToast('error', data.error || 'Failed to reorder blocks')
      }
    } catch (error) {
      // Rollback on error
      setProfile({
        ...profile,
        blocks: originalBlocks,
      })
      console.error('[Frontend] Failed to reorder blocks:', error)
      showToast('error', 'Network error. Please try again.')
    } finally {
      setIsReordering(false)
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
        
        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4 border-t border-gray-100">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              data-testid="tab-profile"
            >
              Profile Info
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'blocks'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              data-testid="tab-blocks"
            >
              Link Blocks
              {activeTab === 'blocks' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'sections'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              data-testid="tab-sections"
            >
              <Layers className="w-4 h-4" />
              Mini Website
              {activeTab === 'sections' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <>
            {/* Profile Picture Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Picture</h2>
              
              <div className="flex items-center gap-6">
                {/* Current Photo / Preview */}
                <div className="relative group">
                  <div 
                    className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center ring-4 ring-white shadow-lg"
                    data-testid="profile-picture-preview"
                  >
                    {(photoPreview || profile.photoUrl) ? (
                      <img
                        src={photoPreview || profile.photoUrl || ''}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary-400">
                        {profile.name?.charAt(0) || 'U'}
                      </span>
                    )}
                    
                    {/* Upload overlay */}
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Camera icon overlay on hover */}
                  {!isUploadingPhoto && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/0 hover:bg-black/40 rounded-full flex items-center justify-center transition-all group-hover:opacity-100 opacity-0"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a photo to personalize your profile. Recommended: Square image, at least 400x400px.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      data-testid="upload-photo-btn"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </>
                      )}
                    </button>
                    
                    {(profile.photoUrl || photoPreview) && (
                      <button
                        onClick={handleRemovePhoto}
                        disabled={isUploadingPhoto}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        data-testid="remove-photo-btn"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG, or WEBP • Max 5MB
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  data-testid="photo-file-input"
                />
              </div>
            </div>

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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                {isSavingTheme && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </div>
              {/* Horizontal scrollable theme carousel */}
              <div 
                ref={themeScrollRef}
                className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                style={{ scrollBehavior: 'smooth' }}
                data-testid="theme-carousel"
              >
                {THEMES_LIST.map((theme) => {
                  const isSelected = profile.theme === theme.id
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`flex-shrink-0 w-28 p-3 rounded-xl border-2 transition-all relative ${
                        isSelected
                          ? 'border-accent-500 ring-2 ring-accent-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={`theme-${theme.id}`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div 
                        className="w-full h-12 rounded-lg mb-2 border border-gray-100"
                        style={{ 
                          background: theme.backgroundGradient || theme.background,
                        }}
                      >
                        {/* Mini preview with accent color */}
                        <div className="flex flex-col items-center justify-center h-full gap-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.buttonPrimary }}
                          />
                          <div 
                            className="w-8 h-1 rounded"
                            style={{ backgroundColor: theme.textPrimary, opacity: 0.3 }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 block truncate">{theme.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Live Theme Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h2>
          <div 
            className="rounded-2xl overflow-hidden border border-gray-200"
            style={{ 
              background: getTheme(profile.theme).backgroundGradient || getTheme(profile.theme).background 
            }}
            data-testid="theme-preview"
          >
            <div className="p-6 text-center">
              {/* Avatar preview */}
              <div 
                className="w-16 h-16 mx-auto mb-3 rounded-full p-0.5"
                style={{ 
                  background: getTheme(profile.theme).headerGradient || 
                    `linear-gradient(135deg, ${getTheme(profile.theme).buttonPrimary} 0%, ${getTheme(profile.theme).accent} 100%)` 
                }}
              >
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ 
                    backgroundColor: getTheme(profile.theme).cardBackground,
                    color: getTheme(profile.theme).textPrimary
                  }}
                >
                  {profile.name?.charAt(0) || 'U'}
                </div>
              </div>
              {/* Name */}
              <h3 
                className="font-bold mb-1"
                style={{ color: getTheme(profile.theme).textPrimary }}
              >
                {profile.name || 'Your Name'}
              </h3>
              {/* Headline */}
              <p 
                className="text-sm mb-3"
                style={{ color: getTheme(profile.theme).textSecondary }}
              >
                {profile.headline || 'Your headline'}
              </p>
              {/* Sample link card */}
              <div 
                className="rounded-xl p-3 flex items-center gap-3 max-w-xs mx-auto"
                style={{ 
                  backgroundColor: getTheme(profile.theme).cardBackground,
                  border: `1px solid ${getTheme(profile.theme).cardBorder}`,
                  boxShadow: getTheme(profile.theme).cardShadow
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ 
                    backgroundColor: getTheme(profile.theme).buttonPrimary,
                    color: getTheme(profile.theme).buttonPrimaryText
                  }}
                >
                  <LinkIcon3D size={18} />
                </div>
                <span 
                  className="font-medium text-sm"
                  style={{ color: getTheme(profile.theme).textPrimary }}
                >
                  Sample Link
                </span>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Blocks Tab */}
        {activeTab === 'blocks' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Link Blocks</h2>
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
              <div className="space-y-3">
                {profile.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-white"
                    data-testid={`block-${block.id}`}
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReorderBlock(block.id, 'up')}
                        disabled={index === 0 || isReordering}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                        data-testid={`block-${block.id}-up`}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorderBlock(block.id, 'down')}
                        disabled={index === profile.blocks.length - 1 || isReordering}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                        data-testid={`block-${block.id}-down`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-2xl"><BlockTypeIcon type={block.type} size={24} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{block.title || 'Untitled'}</p>
                      <p className="text-sm text-gray-500">{block.type.replace('_', ' ')}</p>
                    </div>
                    <button
                      onClick={() => setEditingBlock(block)}
                      className="text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      data-testid={`block-${block.id}-edit`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      data-testid={`block-${block.id}-delete`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sections Tab - Mini Website Builder */}
        {activeTab === 'sections' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <SectionEditor profileTheme={profile.theme} />
          </div>
        )}
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
                  <div className="text-2xl mb-2"><BlockTypeIcon type={type.id} size={32} /></div>
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
                disabled={isSavingBlock}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBlock(editingBlock)}
                disabled={isSavingBlock}
                className="flex-1 bg-accent-500 text-white py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="save-block-btn"
              >
                {isSavingBlock ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
