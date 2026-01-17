import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery, breakpoints } from '../utils/responsive'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { Card } from '../components/Card'
import { colors, typography, borderRadius, themes } from '../styles/theme'
import { mockApi, mockProfile } from '../utils/mockData'
import { Profile, ProfileBlock, BlockType } from '../types'

export const ProfileEditorPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(mockProfile)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [profileLink, setProfileLink] = useState('')
  const navigate = useNavigate()
  const isMobile = useMediaQuery(breakpoints.mobile)
  const isTablet = useMediaQuery(breakpoints.tablet)

  useEffect(() => {
    const loadProfile = async () => {
      const data = await mockApi.getProfile('demo-creator')
      if (data) {
        setProfile(data)
        setProfileLink(`https://gotolinks.me/${data.userId}`)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await mockApi.updateProfile(profile)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    // Auto-save after 2 seconds of inactivity
    const timeoutId = setTimeout(() => {
      handleSave()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }

  const addBlock = (type: BlockType) => {
    const newBlock: ProfileBlock = {
      id: Date.now().toString(),
      type,
      order: profile.blocks.length,
      data: {},
    }
    setProfile((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
    handleSave()
  }

  const updateBlock = (blockId: string, data: Partial<ProfileBlock['data']>) => {
    setProfile((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, data: { ...block.data, ...data } } : block
      ),
    }))
    handleSave()
  }

  const deleteBlock = (blockId: string) => {
    setProfile((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
    }))
    handleSave()
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setProfile((prev) => {
      const blocks = [...prev.blocks]
      const index = blocks.findIndex((b) => b.id === blockId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= blocks.length) return prev

      ;[blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]]
      blocks[index].order = index
      blocks[newIndex].order = newIndex

      return { ...prev, blocks }
    })
    handleSave()
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileLink)
    alert('Profile link copied to clipboard!')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.gray[50] }}>
      {/* Navigation */}
      <nav
        style={{
          padding: '1rem 2rem',
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
            alt="GoToLinks" 
            style={{ height: '35px', width: 'auto' }}
          />
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            {saving ? 'Saving...' : lastSaved ? `Saved • ${Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s ago` : 'Not saved'}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : isTablet
              ? '1fr 1fr'
              : '1fr 1fr 400px',
            gap: '2rem',
          }}
        >
          {/* Left: Profile Settings */}
          <div>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                fontFamily: typography.fontFamily.sans,
              }}
            >
              Profile Settings
            </h2>
            <Card style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Input
                  label="Name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
                <Input
                  label="Headline"
                  value={profile.headline}
                  onChange={(e) => handleProfileChange('headline', e.target.value)}
                  placeholder="Retreat Leader & Sacred Space Holder"
                />
                <Textarea
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                />
                <Input
                  label="Location"
                  value={profile.location || ''}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="Bali, Indonesia"
                />
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: colors.gray[700],
                    }}
                  >
                    Profile Photo
                  </label>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: borderRadius.full,
                      backgroundColor: colors.gray[200],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      overflow: 'hidden',
                    }}
                  >
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>👤</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Photo
                  </Button>
                </div>
              </div>
            </Card>

            {/* Theme Selector */}
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Theme
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.entries(themes).map(([key, theme]) => (
                  <div
                    key={key}
                    onClick={() => handleProfileChange('theme', key)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${profile.theme === key ? colors.primary[500] : colors.gray[300]}`,
                      borderRadius: borderRadius.lg,
                      cursor: 'pointer',
                      backgroundColor: profile.theme === key ? colors.primary[50] : colors.white,
                    }}
                  >
                    <div
                      style={{
                        height: '60px',
                        borderRadius: borderRadius.md,
                        background: Array.isArray(theme.background)
                          ? theme.background[0]
                          : theme.background,
                        marginBottom: '0.5rem',
                      }}
                    />
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{theme.name}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Middle: Blocks Manager */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                Blocks
              </h2>
              <Button size="sm" variant="primary" onClick={() => {
                // Show block type selector
                const type = prompt('Block type: link, retreat, book-call, whatsapp, telegram, testimonial')
                if (type && ['link', 'retreat', 'book-call', 'whatsapp', 'telegram', 'testimonial'].includes(type)) {
                  addBlock(type as BlockType)
                }
              }}>
                + Add Block
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.blocks
                .sort((a, b) => a.order - b.order)
                .map((block, index) => (
                  <Card key={block.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray[700] }}>
                        {block.type.charAt(0).toUpperCase() + block.type.slice(1).replace('-', ' ')}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => moveBlock(block.id, 'up')}
                          disabled={index === 0}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: 'none',
                            backgroundColor: colors.gray[200],
                            borderRadius: borderRadius.md,
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            opacity: index === 0 ? 0.5 : 1,
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveBlock(block.id, 'down')}
                          disabled={index === profile.blocks.length - 1}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: 'none',
                            backgroundColor: colors.gray[200],
                            borderRadius: borderRadius.md,
                            cursor: index === profile.blocks.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: index === profile.blocks.length - 1 ? 0.5 : 1,
                          }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: 'none',
                            backgroundColor: colors.error + '20',
                            color: colors.error,
                            borderRadius: borderRadius.md,
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {block.type === 'link' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Input
                          placeholder="Link Title"
                          value={block.data.title || ''}
                          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        />
                        <Input
                          placeholder="URL"
                          type="url"
                          value={block.data.url || ''}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        />
                      </div>
                    )}

                    {block.type === 'retreat' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Input
                          placeholder="Retreat Title"
                          value={block.data.title || ''}
                          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        />
                        <Input
                          placeholder="Date Range"
                          value={block.data.dateRange || ''}
                          onChange={(e) => updateBlock(block.id, { dateRange: e.target.value })}
                        />
                        <Input
                          placeholder="Location"
                          value={block.data.location || ''}
                          onChange={(e) => updateBlock(block.id, { location: e.target.value })}
                        />
                        <Input
                          placeholder="Booking URL"
                          type="url"
                          value={block.data.url || ''}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        />
                      </div>
                    )}

                    {block.type === 'testimonial' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Input
                          placeholder="Name"
                          value={block.data.name || ''}
                          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                        />
                        <Textarea
                          placeholder="Quote"
                          value={block.data.quote || ''}
                          onChange={(e) => updateBlock(block.id, { quote: e.target.value })}
                          rows={3}
                        />
                      </div>
                    )}

                    {(block.type === 'book-call' || block.type === 'whatsapp' || block.type === 'telegram') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Input
                          placeholder="Title"
                          value={block.data.title || ''}
                          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        />
                        <Input
                          placeholder="URL or Phone"
                          value={block.data.url || block.data.phone || ''}
                          onChange={(e) => {
                            if (block.type === 'whatsapp' || block.type === 'telegram') {
                              updateBlock(block.id, { phone: e.target.value })
                            } else {
                              updateBlock(block.id, { url: e.target.value })
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div>
            <div style={{ position: 'sticky', top: '2rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Preview</h3>
                <Button size="sm" variant="outline" onClick={copyProfileLink}>
                  Copy Link
                </Button>
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: '375px',
                  margin: '0 auto',
                  backgroundColor: colors.white,
                  borderRadius: borderRadius['2xl'],
                  padding: '1.5rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  border: '8px solid #000',
                  borderTopWidth: '40px',
                }}
              >
                {/* Mock phone preview - simplified for now */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: borderRadius.full,
                      backgroundColor: colors.gray[200],
                      margin: '0 auto 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                    }}
                  >
                    {profile.photoUrl ? '👤' : '👤'}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {profile.name}
                  </h4>
                  <p style={{ color: colors.text.secondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {profile.headline}
                  </p>
                  <p style={{ color: colors.text.secondary, fontSize: '0.75rem' }}>{profile.bio}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {profile.blocks
                    .sort((a, b) => a.order - b.order)
                    .slice(0, 3)
                    .map((block) => (
                      <div
                        key={block.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: colors.gray[100],
                          borderRadius: borderRadius.lg,
                          fontSize: '0.875rem',
                        }}
                      >
                        {block.data.title || block.type}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

