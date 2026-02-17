import Link from 'next/link'
import { ArrowRight, Link2, Video, Mountain, MessageSquare, BarChart3, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
                alt="GoToLinks" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary-500 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-500 transition-colors">Pricing</a>
              <Link href="/login" className="text-gray-600 hover:text-primary-500 transition-colors">Login</Link>
              <Link 
                href="/signup" 
                className="bg-accent-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
                data-testid="nav-signup-btn"
              >
                Get Started Free
              </Link>
            </div>
            <Link 
              href="/signup" 
              className="md:hidden bg-accent-500 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-white opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-800">Your Wellness-Branded</span>
                <span className="gradient-text block">Link in Bio</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Designed for retreat leaders, healers, coaches and venues. A soulful alternative to generic link tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/signup" 
                  className="bg-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-600 transition-all hover:-translate-y-1 hover:shadow-lg inline-flex items-center gap-2"
                  data-testid="hero-cta-btn"
                >
                  Create your free profile
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/profile/demo-creator" 
                  className="border-2 border-accent-500 text-accent-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-500 hover:text-white transition-all inline-flex items-center gap-2"
                  data-testid="hero-demo-btn"
                >
                  See example profile
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-4 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full" />
                  <h3 className="text-xl font-bold text-gray-800">Sarah Moon</h3>
                  <p className="text-gray-600">Retreat Leader & Sacred Space Holder</p>
                  <div className="space-y-2">
                    {['Sacred Silence Retreat', 'My Wellness Blog', 'Book a Call'].map((item, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg py-2 px-4 text-sm text-gray-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
            Why wellness creators love GoToLinks
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Built specifically for the wellness industry with features that matter
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Video, title: 'Video Hero', desc: 'Showcase retreats with stunning video backgrounds', color: 'bg-primary-100 text-primary-600' },
              { icon: Mountain, title: 'Retreat Blocks', desc: 'Dedicated blocks for retreats with dates and booking', color: 'bg-secondary-100 text-secondary-600' },
              { icon: MessageSquare, title: 'Testimonials', desc: 'Elegant testimonial cards that build trust', color: 'bg-accent-100 text-accent-600' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track which links resonate with your audience', color: 'bg-primary-100 text-primary-600' },
              { icon: Link2, title: 'Social Links', desc: 'Connect all platforms in one branded link', color: 'bg-secondary-100 text-secondary-600' },
              { icon: Calendar, title: 'Booking Calendar', desc: 'Integrate booking and accept reservations', color: 'bg-accent-100 text-accent-600' },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100"
                data-testid={`feature-card-${i}`}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            How it works
          </h2>
          <div className="space-y-8">
            {[
              { num: '1', title: 'Create profile', desc: 'Sign up in seconds and set up your wellness-branded profile.' },
              { num: '2', title: 'Add links & retreats', desc: 'Add booking calendars, retreats, testimonials.' },
              { num: '3', title: 'Share everywhere', desc: 'Instagram bio, email signature, everywhere.' },
            ].map((step, i) => (
              <div 
                key={i} 
                className="flex items-start gap-6 bg-white rounded-2xl p-6 shadow-lg"
                data-testid={`step-${i}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
            Free forever, upgrade when ready
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Start free, upgrade to unlock advanced features
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200" data-testid="pricing-free">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-500">$0</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited links', 'Retreat blocks', 'Basic themes', 'Profile analytics'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-primary-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup" 
                className="block w-full text-center border-2 border-accent-500 text-accent-500 py-3 rounded-xl font-semibold hover:bg-accent-500 hover:text-white transition-colors"
              >
                Get started free
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-accent-500 relative" data-testid="pricing-pro">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-500">$19</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Free', 'Video hero backgrounds', 'All premium themes', 'Advanced analytics', 'Custom domain', 'Priority support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-primary-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?plan=pro" 
                className="block w-full text-center bg-accent-500 text-white py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Ready to create your wellness profile?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of wellness creators sharing their offerings
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-accent-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-accent-600 transition-all hover:-translate-y-1 hover:shadow-lg"
            data-testid="cta-signup-btn"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img 
                src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
                alt="GoToLinks" 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 GoToLinks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
