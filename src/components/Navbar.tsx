import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from './Button'
import { colors, typography, borderRadius, shadows } from '../styles/theme'

interface NavItem {
  label: string
  href?: string
  scrollTo?: string
  dropdown?: {
    title: string
    description?: string
    cta?: {
      text: string
      scrollTo?: string
    }
    tabs?: {
      label: string
      href?: string
      scrollTo?: string
      content: {
        title: string
        items: Array<{
          icon: string
          title: string
          description?: string
          href?: string
          scrollTo?: string
        }>
      }
    }[]
  }
}

const navItems: NavItem[] = [
  {
    label: 'Features',
    scrollTo: 'features',
    dropdown: {
      title: 'What GoToLinks Does',
      description: 'Everything you need to grow your online presence',
      cta: {
        text: 'See how GoToLinks works',
        scrollTo: 'how-it-works',
      },
      tabs: [
        {
          label: 'Core Features',
          content: {
            title: 'Smart Profile Page',
            items: [
              {
                icon: '🔗',
                title: 'Smart Profile Page',
                description: 'One link for all your content',
              },
              {
                icon: '📎',
                title: 'Unlimited Links',
                description: 'Socials, products, websites',
              },
              {
                icon: '📊',
                title: 'Link Analytics',
                description: 'Clicks, traffic, performance',
              },
              {
                icon: '🎨',
                title: 'Themes & Customization',
                description: 'Match your brand',
              },
            ],
          },
        },
      ],
    },
  },
  {
    label: 'Use Cases',
    scrollTo: 'use-cases',
    dropdown: {
      title: 'Who GoToLinks is for',
      description: 'Built for anyone who wants more from their bio link',
      cta: {
        text: 'Get Started Free',
        scrollTo: 'pricing',
      },
      tabs: [
        {
          label: 'Creators',
          scrollTo: 'use-cases',
          content: {
            title: 'Content Creators & Influencers',
            items: [
              {
                icon: '🎥',
                title: 'Content Creators & Influencers',
                description: 'Share all your links in one place',
                scrollTo: 'use-cases',
              },
              {
                icon: '🧑‍🏫',
                title: 'Coaches & Consultants',
                description: 'Connect with clients easily',
                scrollTo: 'use-cases',
              },
            ],
          },
        },
        {
          label: 'Wellness',
          scrollTo: 'use-cases',
          content: {
            title: 'Wellness & Retreats',
            items: [
              {
                icon: '🧘',
                title: 'Yoga Trainers & Wellness Brands',
                description: 'Showcase your offerings',
                scrollTo: 'use-cases',
              },
              {
                icon: '🏕',
                title: 'Retreat Hosts & Travel Organizers',
                description: 'Book retreats seamlessly',
                scrollTo: 'use-cases',
              },
            ],
          },
        },
        {
          label: 'Business',
          scrollTo: 'use-cases',
          content: {
            title: 'Business & Services',
            items: [
              {
                icon: '🏢',
                title: 'Small Businesses & Freelancers',
                description: 'Professional link in bio',
                scrollTo: 'use-cases',
              },
            ],
          },
        },
      ],
    },
  },
  {
    label: 'Pricing',
    scrollTo: 'pricing',
  },
]

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 991)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close dropdowns when clicking outside (desktop)
  useEffect(() => {
    if (!isDesktop || !activeDropdown) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setActiveTab(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDesktop, activeDropdown])

  // Reset mobile menu state when closing
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setOpenSubmenu(null)
      setActiveTab(null)
    }
  }, [isMobileMenuOpen])

  // Handle scroll to section
  const handleScrollTo = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    if (isDesktop) {
      setActiveDropdown(null)
    } else {
      setIsMobileMenuOpen(false)
      setOpenSubmenu(null)
    }
  }

  // Desktop: Handle hover
  const handleMouseEnter = (itemLabel: string) => {
    if (isDesktop && navItems.find((item) => item.label === itemLabel)?.dropdown) {
      setActiveDropdown(itemLabel)
      const firstTab = navItems.find((item) => item.label === itemLabel)?.dropdown?.tabs?.[0]
      if (firstTab) {
        setActiveTab(firstTab.label)
      }
    }
  }

  const handleMouseLeave = () => {
    if (isDesktop) {
      setActiveDropdown(null)
      setActiveTab(null)
    }
  }

  // Desktop: Handle tab hover
  const handleTabHover = (tabLabel: string) => {
    if (isDesktop && activeDropdown) {
      setActiveTab(tabLabel)
    }
  }

  // Handle nav item click (works for both desktop and mobile)
  const handleNavItemClick = (e: React.MouseEvent<HTMLElement>, href?: string, scrollTo?: string) => {
    if (href) {
      // Allow Ctrl/Cmd + click for new tab
      if (e.ctrlKey || e.metaKey) {
        return // Let browser handle it
      }
      e.preventDefault()
      navigate(href)
      if (isDesktop) {
        setActiveDropdown(null)
        setActiveTab(null)
      } else {
        setIsMobileMenuOpen(false)
        setOpenSubmenu(null)
      }
    } else if (scrollTo) {
      e.preventDefault()
      handleScrollTo(scrollTo)
      if (isDesktop) {
        setActiveDropdown(null)
        setActiveTab(null)
      } else {
        setIsMobileMenuOpen(false)
        setOpenSubmenu(null)
      }
    }
  }

  // Desktop: Handle tab click (for dropdown tabs)
  const handleTabClick = (e: React.MouseEvent<HTMLElement>, href?: string, scrollTo?: string) => {
    if (!isDesktop) return

    if (href) {
      // Allow Ctrl/Cmd + click for new tab
      if (e.ctrlKey || e.metaKey) {
        return // Let browser handle it
      }
      e.preventDefault()
      navigate(href)
      setActiveDropdown(null)
      setActiveTab(null)
    } else if (scrollTo) {
      e.preventDefault()
      handleScrollTo(scrollTo)
      setActiveDropdown(null)
      setActiveTab(null)
    }
  }

  // Desktop: Handle content item click
  const handleContentItemClick = (e: React.MouseEvent<HTMLElement>, href?: string, scrollTo?: string) => {
    if (!isDesktop) return

    if (href) {
      // Allow Ctrl/Cmd + click for new tab
      if (e.ctrlKey || e.metaKey) {
        return // Let browser handle it
      }
      e.preventDefault()
      navigate(href)
      setActiveDropdown(null)
      setActiveTab(null)
    } else if (scrollTo) {
      e.preventDefault()
      handleScrollTo(scrollTo)
      setActiveDropdown(null)
      setActiveTab(null)
    }
  }

  // Mobile: Handle menu item click
  const handleMobileItemClick = (e: React.MouseEvent, item: NavItem) => {
    if (isDesktop) return

    e.preventDefault()

    if (item.dropdown) {
      // Open submenu
      if (openSubmenu !== item.label) {
        setIsAnimating(true)
        setOpenSubmenu(item.label)
        const firstTab = item.dropdown.tabs?.[0]
        if (firstTab) {
          setActiveTab(firstTab.label)
        }
        setTimeout(() => setIsAnimating(false), 300)
      } else {
        // Close submenu
        setIsAnimating(true)
        setOpenSubmenu(null)
        setActiveTab(null)
        setTimeout(() => setIsAnimating(false), 300)
      }
    } else if (item.href) {
      navigate(item.href)
      setIsMobileMenuOpen(false)
    } else if (item.scrollTo) {
      handleScrollTo(item.scrollTo)
    }
  }

  // Mobile: Handle tab click (drill-down)
  const handleMobileTabClick = (e: React.MouseEvent, tabLabel: string) => {
    if (isDesktop) return
    e.preventDefault()
    setIsAnimating(true)
    setActiveTab(tabLabel)
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Mobile: Handle back button
  const handleBackClick = () => {
    setIsAnimating(true)
    if (activeTab) {
      setActiveTab(null)
    } else {
      setOpenSubmenu(null)
    }
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Get active dropdown content
  const getActiveDropdownContent = () => {
    if (!activeDropdown) return null
    const item = navItems.find((item) => item.label === activeDropdown)
    return item?.dropdown
  }

  // Get active tab content
  const getActiveTabContent = () => {
    const dropdown = getActiveDropdownContent()
    if (!activeTab || !dropdown) return null
    return dropdown.tabs?.find((tab) => tab.label === activeTab)?.content
  }

  const activeDropdownContent = getActiveDropdownContent()
  const activeTabContent = getActiveTabContent()

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        boxShadow: shadows.sm,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            zIndex: 1001,
          }}
        >
          <img
            src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png"
            alt="GoToLinks"
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation */}
        {isDesktop && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative' }}>
            {navItems.map((item) => (
              <div
                key={item.label}
                style={{ position: 'relative', paddingBottom: item.dropdown ? '0.5rem' : '0' }}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={(e) => {
                  // Only close if mouse is not moving to dropdown
                  const relatedTarget = e.relatedTarget as HTMLElement
                  if (!relatedTarget || !dropdownRef.current?.contains(relatedTarget)) {
                    handleMouseLeave()
                  }
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text.primary,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    fontFamily: typography.fontFamily.sans,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.accent[500]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.primary
                  }}
                  onClick={(e) => {
                    if (item.href || item.scrollTo) {
                      handleNavItemClick(e, item.href, item.scrollTo)
                    }
                  }}
                >
                  {item.label}
                  {item.dropdown && (
                    <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>▼</span>
                  )}
                </button>

                {/* Desktop Dropdown */}
                {activeDropdown === item.label && item.dropdown && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '0.25rem',
                      paddingTop: '0.75rem',
                      backgroundColor: colors.white,
                      borderRadius: borderRadius.xl,
                      boxShadow: shadows.xl,
                      minWidth: '600px',
                      maxWidth: '800px',
                      padding: '2rem',
                      paddingTop: '2.75rem',
                      zIndex: 1000,
                    }}
                    onMouseEnter={() => {
                      // Keep dropdown open when hovering over it
                      if (activeDropdown !== item.label) {
                        handleMouseEnter(item.label)
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.text.primary }}>
                        {item.dropdown.title}
                      </h3>
                      {item.dropdown.description && (
                        <p style={{ color: colors.text.secondary, fontSize: '0.95rem' }}>
                          {item.dropdown.description}
                        </p>
                      )}
                    </div>

                    {/* Tabs */}
                    {item.dropdown.tabs && item.dropdown.tabs.length > 0 && (
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: `1px solid ${colors.gray[200]}` }}>
                        {item.dropdown.tabs.map((tab) => (
                          <button
                            key={tab.label}
                            onMouseEnter={() => handleTabHover(tab.label)}
                            onClick={(e) => {
                              if (tab.href || tab.scrollTo) {
                                handleTabClick(e, tab.href, tab.scrollTo)
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              borderBottom: `2px solid ${activeTab === tab.label ? colors.accent[500] : 'transparent'}`,
                              padding: '0.75rem 1rem',
                              cursor: tab.href || tab.scrollTo ? 'pointer' : 'default',
                              color: activeTab === tab.label ? colors.accent[500] : colors.text.secondary,
                              fontWeight: activeTab === tab.label ? 600 : 400,
                              fontSize: '0.95rem',
                              transition: 'all 0.2s ease',
                              marginBottom: '-1px',
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tab Content */}
                    {activeTabContent && (
                      <div
                        style={{
                          animation: 'fadeIn 0.3s ease',
                        }}
                      >
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: colors.text.primary }}>
                          {activeTabContent.title}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          {activeTabContent.items.map((contentItem, idx) => (
                            <div
                              key={idx}
                              onClick={(e) => {
                                if (contentItem.href || contentItem.scrollTo) {
                                  handleContentItemClick(e, contentItem.href, contentItem.scrollTo)
                                }
                              }}
                              style={{
                                padding: '1rem',
                                borderRadius: borderRadius.lg,
                                backgroundColor: colors.gray[50],
                                transition: 'all 0.2s ease',
                                cursor: contentItem.href || contentItem.scrollTo ? 'pointer' : 'default',
                              }}
                              onMouseEnter={(e) => {
                                if (contentItem.href || contentItem.scrollTo) {
                                  e.currentTarget.style.backgroundColor = colors.gray[100]
                                  e.currentTarget.style.transform = 'translateY(-2px)'
                                  e.currentTarget.style.boxShadow = shadows.md
                                } else {
                                  e.currentTarget.style.backgroundColor = colors.gray[100]
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.gray[50]
                                e.currentTarget.style.transform = ''
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{contentItem.icon}</div>
                              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: colors.text.primary }}>
                                {contentItem.title}
                              </div>
                              {contentItem.description && (
                                <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                                  {contentItem.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {item.dropdown.cta && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.gray[200]}` }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            if (item.dropdown?.cta?.scrollTo) {
                              handleScrollTo(item.dropdown.cta.scrollTo)
                            }
                          }}
                        >
                          {item.dropdown.cta.text} →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Get Started Button */}
            <Button variant="primary" size="sm" to="/signup">
              Get Started Free
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {!isDesktop && (
          <button
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen)
              setOpenSubmenu(null)
              setActiveTab(null)
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              zIndex: 1001,
            }}
            aria-label="Toggle menu"
          >
            <div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: colors.text.primary,
                margin: '5px 0',
                transition: 'all 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: colors.text.primary,
                margin: '5px 0',
                transition: 'all 0.3s ease',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: colors.text.primary,
                margin: '5px 0',
                transition: 'all 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {!isDesktop && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.white,
            zIndex: 1000,
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease',
            overflow: 'hidden',
            paddingTop: '80px',
          }}
        >
          <div style={{ height: '100%', overflowY: 'auto', padding: '1rem 2rem', position: 'relative' }}>
            {/* Main Menu Items */}
            {!openSubmenu && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={(e) => handleMobileItemClick(e, item)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        color: colors.text.primary,
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: '1rem 0',
                        borderBottom: `1px solid ${colors.gray[200]}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{item.label}</span>
                      {item.dropdown && <span>→</span>}
                    </button>
                  </div>
                ))}

                {/* Get Started Button (Mobile) */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `2px solid ${colors.gray[200]}` }}>
                  <Button
                    variant="primary"
                    size="lg"
                    to="/signup"
                    style={{ width: '100%' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            )}

            {/* Submenu (drill-down) */}
            {openSubmenu && !activeTab && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: colors.white,
                  padding: '1rem 2rem',
                  transform: 'translateX(0)',
                  transition: 'transform 0.3s ease',
                  overflowY: 'auto',
                }}
              >
                {/* Back Button */}
                <button
                  onClick={handleBackClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: colors.text.primary,
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    padding: '0.5rem 0',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>←</span> Back
                </button>
                {(() => {
                  const item = navItems.find((item) => item.label === openSubmenu)
                  if (!item?.dropdown) return null

                  return (
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.text.primary }}>
                        {item.dropdown.title}
                      </h3>
                      {item.dropdown.description && (
                        <p style={{ color: colors.text.secondary, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                          {item.dropdown.description}
                        </p>
                      )}

                      {/* Tabs */}
                      {item.dropdown.tabs && item.dropdown.tabs.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {item.dropdown.tabs.map((tab) => (
                            <button
                              key={tab.label}
                              onClick={(e) => handleMobileTabClick(e, tab.label)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                color: colors.text.primary,
                                fontSize: '1rem',
                                fontWeight: activeTab === tab.label ? 600 : 500,
                                cursor: 'pointer',
                                padding: '1rem',
                                borderRadius: borderRadius.lg,
                                backgroundColor: activeTab === tab.label ? colors.gray[100] : 'transparent',
                                borderBottom: `1px solid ${colors.gray[200]}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <span>{tab.label}</span>
                              <span>→</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      {item.dropdown.cta && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <Button
                            variant="primary"
                            size="lg"
                            style={{ width: '100%' }}
                            onClick={() => {
                              if (item.dropdown?.cta?.scrollTo) {
                                handleScrollTo(item.dropdown.cta.scrollTo)
                              }
                            }}
                          >
                            {item.dropdown.cta.text} →
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Tab Content (drill-down level 2) */}
            {activeTab && openSubmenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: colors.white,
                  padding: '1rem 2rem',
                  transform: activeTab ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 0.3s ease',
                  overflowY: 'auto',
                }}
              >
                <button
                  onClick={handleBackClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: colors.text.primary,
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    padding: '0.5rem 0',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>←</span> Back
                </button>

                {(() => {
                  const item = navItems.find((item) => item.label === openSubmenu)
                  const tab = item?.dropdown?.tabs?.find((tab) => tab.label === activeTab)
                  if (!tab?.content) return null

                  return (
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: colors.text.primary }}>
                        {tab.content.title}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tab.content.items.map((contentItem, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '1.5rem',
                              borderRadius: borderRadius.lg,
                              backgroundColor: colors.gray[50],
                              border: `1px solid ${colors.gray[200]}`,
                            }}
                          >
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{contentItem.icon}</div>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.125rem', color: colors.text.primary }}>
                              {contentItem.title}
                            </div>
                            {contentItem.description && (
                              <div style={{ fontSize: '0.95rem', color: colors.text.secondary, lineHeight: 1.6 }}>
                                {contentItem.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  )
}
