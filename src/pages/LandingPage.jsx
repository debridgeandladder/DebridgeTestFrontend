import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { CheckCircle, Users, Zap, Shield, ArrowRight, Phone, Mail, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/Logo.jsx'
import './LandingPage.css'

function LandingPage() {
  const [formData, setFormData] = useState({
    contact: '',
    userType: '',
    isSubmitted: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Auto-rotate cards every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!formData.contact) return
    setShowUserTypeModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.contact || !formData.userType) return
    
    setIsLoading(true)
    
    try {
      // Import API dynamically to avoid circular dependencies
      const { api } = await import('@/lib/api-layer.js')
      
      const response = await api.joinWaitlist({
        contact: formData.contact,
        userType: formData.userType,
        timestamp: new Date().toISOString(),
        source: 'BridgeX Waitlist'
      })
      
      if (response.success) {
        setFormData(prev => ({ ...prev, isSubmitted: true }))
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)

      // TODO: Show error message
      setFormData(prev => ({ ...prev, isSubmitted: true }))
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, contact: e.target.value }))
  }

  const selectUserType = (type) => {
    setFormData(prev => ({ ...prev, userType: type }))
    setShowUserTypeModal(false)
    handleSubmit()
  }

  if (formData.isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-green-200 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">You're In!</CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for joining the BridgeX waitlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                🎉 Welcome to the future of service connections in Nigeria!
              </p>
            </div>
            <div className="space-y-3 text-left">
              <p className="text-sm text-gray-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll be among the first to access BridgeX when we launch
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  We'll send you exclusive updates about our progress
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Get special early-bird benefits and features
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Keep an eye on your {formData.contact.includes('@') ? 'email' : 'phone'} for updates from the BridgeX team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-lg font-semibold px-6 py-3 animate-pulse hover:animate-bounce transition-all duration-300 shadow-lg">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-green-50 to-white py-20 flex items-center">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-[98%] lg:leading-[95%]"
            >
              Bridging Users and Providers 
              <span className="bg-primary-gradient bg-clip-text text-transparent"> Across Nigeria</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              The revolutionary digital marketplace where service users get free lifetime access 
              to trusted providers, and service providers connect with new customers.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                onClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-32 lg:px-40 bg-primary-gradient text-white hover:opacity-90 font-bold text-lg hover:animate-bounce transition-all duration-300"
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Dual Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Dual Value Proposition
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  BridgeX creates a win-win ecosystem where service users get free, 
                  lifetime access to trusted providers, while service providers gain 
                  access to a stream of new customers and increased revenue opportunities.
                </p>
                <Button
                  onClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-12 px-28 lg:px-32 bg-primary-gradient text-white hover:opacity-90 font-bold hover:animate-bounce transition-all duration-300"
                >
                  Join the Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              
              <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-green-200 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl text-center">For Service Users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>Free, lifetime access to trusted service providers</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>Get matched in real-time with service providers</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>No hidden fees or charges ever</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-green-200 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Zap className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl text-center">For Service Providers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>Get access to a stream of new customers</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>Increase your revenue and income</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>Verified and trusted platform</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist-section" className="py-40 bg-primary-gradient flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-[98%] lg:leading-[95%]">Join the Waitlist</h2>
            <p className="text-lg lg:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Connect with trusted service providers or find new customers. 
              Be among the first to experience Nigeria's most innovative service marketplace.
            </p>
            
            {/* Newslette-style Waitlist Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleEmailSubmit} className="flex">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="h-16 px-6 text-2xl! border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-white/20 rounded-l-xl rounded-r-none"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {formData.contact.includes('@') ? (
                      <Mail className="w-5 h-5 text-white/60" />
                    ) : (
                      <Phone className="w-5 h-5 text-white/60" />
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!formData.contact}
                  className="h-16 px-12 bg-white text-green-600 hover:bg-white/90 font-bold text-xl rounded-l-none rounded-r-xl disabled:opacity-50"
                >
                  Join
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose BridgeX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted & Verified</h3>
              <p className="text-gray-600">All service providers are carefully vetted and verified for quality and reliability.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Matching</h3>
              <p className="text-gray-600">Get instantly connected with available service providers in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free for Users</h3>
              <p className="text-gray-600">Lifetime free access for service users - no hidden fees or charges ever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-green-200">
        <div className="text-center text-gray-600">
          <p className="mb-2">© 2025 BridgeX. All rights reserved.</p>
          <p className="text-sm">Bridge and Ladder Synergy Solution LLC</p>
        </div>
      </footer>

      {/* User Type Selection Modal */}
      <Dialog open={showUserTypeModal} onOpenChange={setShowUserTypeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Who are you?</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Help us understand how you'll use BridgeX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={() => selectUserType('user')}
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Users className="w-6 h-6 mr-3" />
              Service User
            </Button>
            <Button
              onClick={() => selectUserType('provider')}
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Zap className="w-6 h-6 mr-3" />
              Service Provider
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LandingPage
