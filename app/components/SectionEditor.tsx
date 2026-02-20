'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, X, Edit2, Star, Image, Play, Calendar, User, MessageCircle, Loader2, GripVertical } from 'lucide-react'
import { 
  Section, 
  SectionType, 
  SectionData,
  AboutSectionData,
  RetreatSectionData,
  GallerySectionData,
  VideoSectionData,
  TestimonialsSectionData,
  Testimonial,
  getAllSectionTypes,
  createSection,
  isAboutSection,
  isRetreatSection,
  isGallerySection,
  isVideoSection,
  isTestimonialsSection,
} from '../../lib/sections'
import { ThemeConfig, getTheme } from '../../lib/themes'

// ============================================
// SECTION TYPE ICONS
// ============================================

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  about: <User className="w-5 h-5" />,
  retreat: <Calendar className="w-5 h-5" />,
  gallery: <Image className="w-5 h-5" />,
  video: <Play className="w-5 h-5" />,
  testimonials: <MessageCircle className="w-5 h-5" />,
}

// ============================================
// SECTION CARD WITH DRAG & DROP
// ============================================

interface SectionCardProps {
  section: Section
  index: number
  total: number
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  onReorder: (direction: 'up' | 'down') => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  dragOverIndex: number | null
}

function SectionCard({ 
  section, 
  index, 
  total, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  onReorder,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex
}: SectionCardProps) {
  const meta = getAllSectionTypes().find(s => s.type === section.type)
  
  const getPreviewText = () => {
    if (isAboutSection(section.data)) {
      return section.data.title
    }
    if (isRetreatSection(section.data)) {
      return section.data.eventTitle
    }
    if (isGallerySection(section.data)) {
      return `${section.data.images.length} images (${section.data.layout})`
    }
    if (isVideoSection(section.data)) {
      return section.data.title || 'YouTube Video'
    }
    if (isTestimonialsSection(section.data)) {
      return `${section.data.testimonials.length} testimonials`
    }
    return meta?.name || 'Section'
  }

  const isDropTarget = dragOverIndex === index

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-4 border rounded-xl transition-all cursor-grab active:cursor-grabbing ${
        section.enabled 
          ? 'border-gray-200 bg-white hover:border-gray-300' 
          : 'border-gray-100 bg-gray-50 opacity-60'
      } ${isDragging ? 'opacity-50' : ''} ${isDropTarget ? 'border-primary-400 bg-primary-50 border-dashed' : ''}`}
      data-testid={`section-${section.id}`}
    >
      {/* Drag Handle */}
      <div className="flex items-center text-gray-300 hover:text-gray-500 cursor-grab">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
        {SECTION_ICONS[section.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{getPreviewText()}</p>
        <p className="text-sm text-gray-500">{meta?.name}</p>
      </div>

      {/* Actions */}
      <button
        onClick={onToggleVisibility}
        className={`p-2 rounded-lg transition-colors ${
          section.enabled 
            ? 'text-green-600 hover:bg-green-50' 
            : 'text-gray-400 hover:bg-gray-100'
        }`}
        title={section.enabled ? 'Visible' : 'Hidden'}
      >
        {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onEdit}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Edit2 className="w-5 h-5" />
      </button>

      <button
        onClick={onDelete}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

// ============================================
// ADD SECTION MODAL
// ============================================

interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (type: SectionType) => void
}

function AddSectionModal({ isOpen, onClose, onAdd }: AddSectionModalProps) {
  if (!isOpen) return null

  const sectionTypes = getAllSectionTypes()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Add Section</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {sectionTypes.map((section) => (
            <button
              key={section.type}
              onClick={() => onAdd(section.type)}
              className="w-full p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                {SECTION_ICONS[section.type]}
              </div>
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {section.icon} {section.name}
                </div>
                <div className="text-sm text-gray-500">{section.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// EDIT SECTION MODALS
// ============================================

interface EditSectionModalProps {
  section: Section | null
  onClose: () => void
  onSave: (data: SectionData) => void
}

function EditSectionModal({ section, onClose, onSave }: EditSectionModalProps) {
  const [data, setData] = useState<SectionData | null>(null)

  useEffect(() => {
    if (section) {
      setData({ ...section.data })
    }
  }, [section])

  if (!section || !data) return null

  const handleSave = () => {
    if (data) {
      onSave(data)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Edit {getAllSectionTypes().find(s => s.type === section.type)?.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* About Section Form */}
        {section.type === 'about' && isAboutSection(data) && (
          <AboutSectionForm 
            data={data} 
            onChange={(newData) => setData(newData)} 
          />
        )}

        {/* Retreat Section Form */}
        {section.type === 'retreat' && isRetreatSection(data) && (
          <RetreatSectionForm 
            data={data} 
            onChange={(newData) => setData(newData)} 
          />
        )}

        {/* Gallery Section Form */}
        {section.type === 'gallery' && isGallerySection(data) && (
          <GallerySectionForm 
            data={data} 
            onChange={(newData) => setData(newData)} 
          />
        )}

        {/* Video Section Form */}
        {section.type === 'video' && isVideoSection(data) && (
          <VideoSectionForm 
            data={data} 
            onChange={(newData) => setData(newData)} 
          />
        )}

        {/* Testimonials Section Form */}
        {section.type === 'testimonials' && isTestimonialsSection(data) && (
          <TestimonialsSectionForm 
            data={data} 
            onChange={(newData) => setData(newData)} 
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-accent-500 text-white py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SECTION EDIT FORMS
// ============================================

function AboutSectionForm({ data, onChange }: { data: AboutSectionData; onChange: (data: AboutSectionData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          placeholder="About Me"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          placeholder="Tell your story..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Quote (optional)</label>
        <input
          type="text"
          value={data.highlightQuote || ''}
          onChange={(e) => onChange({ ...data, highlightQuote: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          placeholder="Your favorite quote..."
        />
      </div>
    </div>
  )
}

function RetreatSectionForm({ data, onChange }: { data: RetreatSectionData; onChange: (data: RetreatSectionData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
        <input
          type="text"
          value={data.eventTitle}
          onChange={(e) => onChange({ ...data, eventTitle: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          placeholder="Sacred Soul Retreat"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            placeholder="Ubud, Bali"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          placeholder="A transformative journey..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
          <input
            type="text"
            value={data.ctaText}
            onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            placeholder="Reserve Your Spot"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
          <input
            type="url"
            value={data.ctaUrl}
            onChange={(e) => onChange({ ...data, ctaUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            placeholder="https://"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showCountdown"
          checked={data.showCountdown}
          onChange={(e) => onChange({ ...data, showCountdown: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="showCountdown" className="text-sm text-gray-700">Show countdown timer</label>
      </div>
    </div>
  )
}

function GallerySectionForm({ data, onChange }: { data: GallerySectionData; onChange: (data: GallerySectionData) => void }) {
  const [newImageUrl, setNewImageUrl] = useState('')

  const addImage = () => {
    if (newImageUrl.trim()) {
      onChange({
        ...data,
        images: [...data.images, { url: newImageUrl.trim(), caption: '' }]
      })
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    onChange({
      ...data,
      images: data.images.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
        <div className="flex gap-3">
          {['slider', 'grid'].map((layout) => (
            <button
              key={layout}
              onClick={() => onChange({ ...data, layout: layout as 'slider' | 'grid' })}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all capitalize ${
                data.layout === layout
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Add Image URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            placeholder="https://example.com/image.jpg"
          />
          <button
            onClick={addImage}
            disabled={!newImageUrl.trim()}
            className="px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {data.images.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Images ({data.images.length})</label>
          <div className="grid grid-cols-3 gap-2">
            {data.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.url}
                  alt={img.caption || `Image ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function VideoSectionForm({ data, onChange }: { data: VideoSectionData; onChange: (data: VideoSectionData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
        <input
          type="url"
          value={data.youtubeUrl}
          onChange={(e) => onChange({ ...data, youtubeUrl: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          placeholder="My Featured Video"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          placeholder="A brief description..."
        />
      </div>
    </div>
  )
}

function TestimonialsSectionForm({ data, onChange }: { data: TestimonialsSectionData; onChange: (data: TestimonialsSectionData) => void }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    id: '',
    name: '',
    quote: '',
    rating: 5,
  })

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.quote) {
      onChange({
        ...data,
        testimonials: [...data.testimonials, { ...newTestimonial, id: `t_${Date.now()}` }]
      })
      setNewTestimonial({ id: '', name: '', quote: '', rating: 5 })
    }
  }

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const updated = [...data.testimonials]
    updated[index] = { ...updated[index], ...updates }
    onChange({ ...data, testimonials: updated })
  }

  const removeTestimonial = (index: number) => {
    onChange({
      ...data,
      testimonials: data.testimonials.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoSlide"
          checked={data.autoSlide}
          onChange={(e) => onChange({ ...data, autoSlide: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="autoSlide" className="text-sm text-gray-700">Auto-slide testimonials</label>
      </div>

      {/* Existing testimonials */}
      {data.testimonials.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Testimonials ({data.testimonials.length})</label>
          {data.testimonials.map((t, index) => (
            <div key={t.id} className="p-3 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{t.name}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3"
                        style={{
                          fill: star <= (t.rating || 0) ? '#FFC107' : 'transparent',
                          color: star <= (t.rating || 0) ? '#FFC107' : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeTestimonial(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">"{t.quote}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Add new testimonial */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Add New Testimonial</label>
        <div className="space-y-3">
          <input
            type="text"
            value={newTestimonial.name}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
            placeholder="Name"
          />
          <textarea
            value={newTestimonial.quote}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none text-sm"
            placeholder="Their testimonial..."
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                    className="p-0.5"
                  >
                    <Star
                      className="w-5 h-5 transition-colors"
                      style={{
                        fill: star <= (newTestimonial.rating || 0) ? '#FFC107' : 'transparent',
                        color: star <= (newTestimonial.rating || 0) ? '#FFC107' : '#E5E7EB',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addTestimonial}
              disabled={!newTestimonial.name || !newTestimonial.quote}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN SECTION EDITOR COMPONENT
// ============================================

interface SectionEditorProps {
  profileTheme: string
}

export default function SectionEditor({ profileTheme }: SectionEditorProps) {
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const theme = getTheme(profileTheme)

  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/sections', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setSections(data.data.sections || [])
        }
      } catch (error) {
        console.error('Failed to fetch sections:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSections()
  }, [])

  // Add section
  const handleAddSection = async (type: SectionType) => {
    setShowAddModal(false)
    setIsSaving(true)
    
    try {
      const newSection = createSection(type, sections.length)
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, data: newSection.data }),
      })
      
      const data = await res.json()
      if (data.success) {
        setSections([...sections, data.data.section])
        setEditingSection(data.data.section)
      }
    } catch (error) {
      console.error('Failed to add section:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Update section
  const handleUpdateSection = async (sectionData: SectionData) => {
    if (!editingSection) return
    setIsSaving(true)
    
    try {
      const res = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sectionId: editingSection.id, data: sectionData }),
      })
      
      const data = await res.json()
      if (data.success) {
        setSections(sections.map(s => s.id === editingSection.id ? data.data.section : s))
      }
    } catch (error) {
      console.error('Failed to update section:', error)
    } finally {
      setIsSaving(false)
      setEditingSection(null)
    }
  }

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return
    
    try {
      const res = await fetch(`/api/sections?sectionId=${sectionId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      const data = await res.json()
      if (data.success) {
        setSections(sections.filter(s => s.id !== sectionId))
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
  }

  // Toggle visibility
  const handleToggleVisibility = async (section: Section) => {
    try {
      const res = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sectionId: section.id, enabled: !section.enabled }),
      })
      
      const data = await res.json()
      if (data.success) {
        setSections(sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s))
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  // Reorder
  const handleReorder = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    
    const newSections = [...sections]
    const [moved] = newSections.splice(currentIndex, 1)
    newSections.splice(newIndex, 0, moved)
    
    // Update order property
    const reordered = newSections.map((s, i) => ({ ...s, order: i }))
    setSections(reordered)
    
    try {
      await fetch('/api/sections/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sectionIds: reordered.map(s => s.id) }),
      })
    } catch (error) {
      console.error('Failed to reorder sections:', error)
      // Revert on error
      setSections(sections)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sections</h2>
          <p className="text-sm text-gray-500">Build your mini website with rich content sections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          data-testid="add-section-btn"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-500 mb-4">No sections yet. Add your first section to build your mini website!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              total={sections.length}
              onEdit={() => setEditingSection(section)}
              onDelete={() => handleDeleteSection(section.id)}
              onToggleVisibility={() => handleToggleVisibility(section)}
              onReorder={(dir) => handleReorder(section.id, dir)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSection}
      />

      <EditSectionModal
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleUpdateSection}
      />

      {/* Saving overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-gray-700">Saving...</span>
          </div>
        </div>
      )}
    </div>
  )
}
