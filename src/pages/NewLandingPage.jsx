
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Shield, Zap, CheckCircle, Sparkles, Globe, TrendingUp, User, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { api } from '@/lib/api-layer';
import { Gift, Mail } from 'lucide-react';
import { JoinWaitlistButton } from '@/components/JoinWaitlistButton';
import Nigeria3DModel from '@/components/Nigeria3DModel';
import { cn } from '@/lib/utils';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Reusable Section Component
const Section = ({ children, id, className = '' }) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// Badge Component
const Badge = ({ text, dark = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6 ${
      dark ? 'bg-white/10 text-white backdrop-blur-sm' : 'bg-[#22C55E]/10 text-[#22C55E]'
    }`}
  >
    {text}
  </motion.div>
);

export default function NewLandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ contact: '', userType: '', location: 'Select location' });
  const [isLoading, setIsLoading] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLocationInvalid, setIsLocationInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollYProgress } = useScroll();
  const [serviceType, setServiceType] = useState();
  
  const nigerianStates = [
    'Select location', 'Lagos', 'Abuja', 'Port Harcourt', 'Other',
  ];
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Waitlist section scroll-driven animations
  const waitlistRef = useRef(null);
  const { scrollYProgress: waitlistProgress } = useScroll({
    target: waitlistRef,
    offset: ['start end', 'center center']
  });
  // Input/form width transitions from full width to target width as we scroll
  const formWidth = useTransform(waitlistProgress, [0, 1], ['100%', '42rem']);
  // Subtle background opacity increases as waitlist comes into view
  const waitlistBgOpacity = useTransform(waitlistProgress, [0, 1], [0, 0.25]);
  const waitlistCirclesOpacity = useTransform(waitlistProgress, [0, 1], [0.02, 0.08]);

  const validateInput = (input) => {
    const isValid = input.trim() && (
      input.includes('@') 
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
        : input.replace(/\D/g, '').length >= 8 && input.replace(/\D/g, '').length <= 15
    );
    
    if (!isValid) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 1000); // Reset after animation
      toast.error('Please enter a valid email or phone number');
    }
    
    return isValid;
  };

  const validateForm = () => {
    const isContactValid = validateInput(formData.contact);
    const isLocationValid = formData.location && formData.location !== 'Select location';
    
    if (!isLocationValid) {
      setIsLocationInvalid(true);
      setTimeout(() => setIsLocationInvalid(false), 1000);
      toast.error('Please select a location');
      return false;
    }
    
    if (!isContactValid) return false;
    
    return true;
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (serviceType) {
      handleSubmit(serviceType);
    } else {
      setShowUserTypeModal(true);
    }
  };

  const handleSubmit = async (userType) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      const response = await api.joinWaitlist({
        contact: formData.contact,
        userType,
        timestamp: new Date().toISOString(),
        location: formData.location,
      });
      
      toast.success('Successfully joined the waitlist!');
      navigate('/success', { state: { contact: formData.contact } });
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to join waitlist. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  const handleShowWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#waitlist');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-green-50 to-white"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #008000 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #15791575 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #008000 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-600/70 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between max-sm:flex-col items-center">
            <Logo className="h-10 text-gray-600" textClassName='!text-[#22C55E] font-bold text-3xl' />
            <Button variant="ghost" className="text-gray-600 text-lg hover:bg-green-600 hover:text-white backdrop-blur-sm  sm:border border-gray-300">
              Coming Soon!
            </Button>
          </div>
        </header>

        <div className="relative z-10 max-sm:mt-32  max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="relative translate-x-[-30px] h-20 mb-8" onClick={handleShowWaitlist}>
              {[{ Icon: Users, x: -60 }, { Icon: Shield, x: 0 }, { Icon: Zap, x: 60 }].map(({ Icon, x }, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-0"
                  style={{ marginLeft: x }}
                  initial={{ opacity: 0, y: 20 , rotate: 5*Math.sign(x)}}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{ opacity: { delay: i * 0.2 }, y: { duration: 2, repeat: Infinity, delay: i * 0.2 } }}
                >
                  <div className="w-16 h-16 bg-green-500/25 backdrop-blur-md rounded-2xl flex shadow-xl items-center justify-center border-r-2 border-b-2 border-green-600">
                    <Icon className="w-8 h-8 text-green-600/60" />
                  </div>
                </motion.div>
              ))}
            </div>

            <h1 className="text-4xl px-2 md:text-6xl lg:text-8xl font-bold text-gray-600 leading-[1.1] mb-6">
              Connecting 
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"> Users </span>
              and
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"> Providers </span>
              <br />Across Nigeria
            </h1>

            <p className="text-lg px-2 md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-light mb-8">
The revolutionary digital marketplace where service users get free lifetime access to trusted providers, and service providers connect with new customers.
              {/* Where users meet verified professionals<br /> */}
              {/* <span className="text-[#FACC15] font-medium">Join 10,000+ Nigerians building the future.</span> */}
            </p>

            <JoinWaitlistButton>
              Join Waitlist
            </JoinWaitlistButton>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-12 max-md:hidden left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-600 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

 <motion.div
           className='absolute right-1/2 top-0 -translate-y-1/2 translate-x-1/2 w-[75%] aspect-square -2xl bg-gradient-to-r border-white bg-green-800 my-auto shadow-2xl shadow-black border-[120px] rounded-full opacity-5'
           / >
      {/* Vision Section */}
      <Section>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge text="Our Vision" />
            <h2 className="text-4xl md:text-6xl font-bold text-gray-600 mb-6 leading-tight">
              Connecting Every Corner of Nigeria
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              From Lagos to Kano, Abuja to Port Harcourt — BridgeX is building 
              Nigeria's largest verified network of service providers and users.
            </p>
            <JoinWaitlistButton className="">
              Join the Network
            </JoinWaitlistButton>
            {/* <div className="space-y-4">
              {[
                { number: '50,000+', label: 'Service Providers' },
                { number: '1M+', label: 'Happy Users' },
                { number: '36', label: 'States Covered' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#0C3B2E]">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div> */}
          </motion.div>

          <motion.div
            className="relative h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Nigeria3DModel />
          </motion.div>
        </div>
      </Section>

    

      {/* Dual Value Proposition */}
      <Section className="bg-gradient-to-b from-[#FAFAF9] to-white">
        <div className="text-center mb-16">
          <Badge text="For Everyone" />
          <h2 className="text-4xl md:text-6xl font-bold text-gray-600 mb-6">
            Built for Users & Providers
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
type:'user',
              title: 'For Service Users',
              icon: Users,
              color: '#22C55E',
              benefits: ['Free lifetime access', 'Verified professionals only', 'Real-time matching', 'Secure payments'],
            },
            {
type:'provider',
              title: 'For Service Providers',
              icon: TrendingUp,
              color: '#FACC15',
              benefits: ['New customer stream', 'Grow your revenue', 'Build your reputation', 'Flexible scheduling'],
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
onClick={()=>{
 setServiceType(card.type);
 handleShowWaitlist();
}}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className= {` border-2 hover:border-[#22C55E]/30 transition-all h-full ${serviceType===card.type&&'border-green-600'}`}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${card.color}20` }}>
                    <card.icon className="w-8 h-8" style={{ color: card.color }} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-600 mb-6">{card.title}</h3>
                  <ul className="space-y-4">
                    {card.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-3 text-lg">
                        <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Join Waitlist */}
      <Section id="waitlist" className=" z-50 bg-white relative">
        {/* Hero-like animated radial background for waitlist, opacity increases on scroll */}

<img src="bridgge.png" alt="Deck Arch Bridge" className='absolute w-[150%] bottom-0 left-0 object-cover h-auto opacity-5'/>
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ opacity: waitlistBgOpacity }}
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #008000 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #15791575 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #008000 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        {/* Subtle animated background circles */}
        <div className="absolute flex-1 -z-10 w-full h-full">
          <motion.div
            className='absolute right-0  bottom-1/2 translate-y-1/2  w-[500px] h-[500px] -2xl bg-gradient-to-r border-white bg-green-800 my-auto shadow-2xl shadow-black border-[120px] rounded-full '
            style={{ opacity: waitlistCirclesOpacity }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className='absolute left-0 -translate-x-1/2 bottom-1/2 translate-y-1/2 w-[500px] h-[500px] ur-2xl bg-transparent rounded-full border-[120px] shadow-2xl shadow-black border-green-800 '
            style={{ opacity: waitlistCirclesOpacity }}
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </div>
        <div ref={waitlistRef} className=" relative max-w-4xl mx-auto text-center">
            
          {/* <Badge text="Join Today" className="bg-green-100 text-green-800 border-green-200" /> */}
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-600">
            Ready to Join the<br />
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Future of Services?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Be among the first to experience Nigeria's most innovative service marketplace
          </p>
 {serviceType&& <Badge text={`Service ${serviceType.at(0).toUpperCase()+serviceType.slice(1)}`} />}
          {/* Width scales from edge-to-edge to target width as the section enters viewport */}
          <motion.div className="mx-auto w-[42rem] max-w-[95%]" >
          <motion.form 
            onSubmit={handleWaitlistSubmit} 
            className="w-full"
            animate={isInvalid ? { 
              x: [0, -5, 5, -5, 0],
              transition: { duration: 0.4 }
            } : {}}
          >
            <div className= " my-4  w-full">
            <motion.div
              className="relative group"
              animate={isLocationInvalid ? { 
                x: [0, -5, 5, -5, 0],
                transition: { duration: 0.4 }
              } : {}}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl opacity-20 blur transition-all duration-300 ${
                isLocationInvalid ? '!from-red-400 !to-red-600' : ''
              }`} />
              <div className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-sm ${
                isLocationInvalid 
                  ? 'border-red-400/50' 
                  : 'border-green-200 hover:border-green-500'
              }`}>
                <Select
                  value={formData.location}
                  onValueChange={(value) => {
                    setFormData({...formData, location: value});
                    if (isLocationInvalid) setIsLocationInvalid(false);
                  }}
                >
                  <SelectTrigger className="w-full min-h-[50px] rounded-xl border-0 text-left pl-6 pr-10 text-base text-gray-600">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200">
                    {nigerianStates.map((state) => (
                      <SelectItem 
                        key={state} 
                        value={state} 
                        className={`cursor-pointer hover:bg-gray-100 ${
                          state === 'Select location' ? 'text-gray-400' : ''
                        }`}
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* {isLocationInvalid && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-sm font-medium"
                >
                  Please select a location
                </motion.div>
              )} */}
            </motion.div>
</div>
            <div className="relative group mt-4">
              <div className={`absolute -inset-1 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl opacity-20 blur transition-all duration-300 ${
                isInvalid ? '!from-red-400 !to-red-600' : ''
              }`} />
              <div className={`relative flex bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-sm ${
                isInvalid 
                  ? 'border-red-400/50' 
                  : 'border-green-200 hover:border-green-500'
              }`}>
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  {formData.contact.includes('@') ? (
                    <Mail className={`w-5 h-5 transition-colors ${
                      isInvalid ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  ) : (
                    <Phone className={`w-5 h-5 transition-colors ${
                      isInvalid ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Enter email or phone number"
                  value={formData.contact}
                  onChange={(e) => {
                    setFormData({ ...formData, contact: e.target.value });
                    if (isInvalid) setIsInvalid(false);
                  }}
                  className={`flex-1 bg-transparent border-0 text-gray-600 placeholder:text-gray-500 text-base pl-14 py-7 focus-visible:ring-0 ${
                    isInvalid ? 'placeholder:text-red-300/70' : ''
                  }`}
                  required
                />
                <Button
                  type="submit"
                  disabled={!formData.contact || isSubmitting}
                  className={`m-1.5 px-8 py-5 rounded-xl font-bold transition-all ${
                    isInvalid 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-green-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
              {isInvalid && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-sm font-medium"
                >
                  Please enter a valid email or phone number
                </motion.div>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              We'll notify you when we launch. No spam, we promise.
            </p>
          </motion.form>
          </motion.div>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-white">
        <div className="text-center mb-20">
          {/* <Badge text="Simple Process" className="bg-green-100 text-green-800 border-green-200" /> */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-600 mb-6">Why choose BridgeX</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { step: '01', title: 'Trusted & Verified', description: 'All service providers are carefully vetted and verified for quality and reliability.', icon: Shield },
            { step: '02', title: 'Real-Time Matching', description: 'Get instantly connected with available service providers in your area.', icon: Zap },
            { step: '03', title: 'Free for Users', description: 'Lifetime free access for service users - no hidden fees or charges ever.', icon: Gift },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex-1  flex"   
            >
              <div className="relative flex-1 bg-white rounded-2xl p-8 hover:translate-y-[-5px] shadow-lg hover:shadow-xl transition-all border border-green-200 group">
                {/* <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  {step.step}
                </div> */}
                <div className="relative pt-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 opacity-20">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

   

      {/* Testimonials */}
      {/* <Section>
        <div className="text-center mb-16">
          <Badge text="Trusted By Many" />
          <h2 className="text-5xl font-bold text-[#0C3B2E] mb-6">Why People Love BridgeX</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Adebayo Johnson', role: 'Service User', text: 'Found a verified plumber in minutes!', avatar: '🧑🏾' },
            { name: 'Blessing Okafor', role: 'Service Provider', text: 'My business has grown 3x since joining!', avatar: '👩🏾' },
            { name: 'Chidi Nwankwo', role: 'Service User', text: 'Finally, a platform I can trust.', avatar: '🧑🏿' },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="border border-[#22C55E]/20 h-full">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />)}
                  </div>
                  <p className="text-gray-700 text-lg mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{t.avatar}</div>
                    <div>
                      <div className="font-bold text-[#0C3B2E]">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section> */}

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0C3B2E] to-[#121212] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <Link to='/admin'>
                <Logo className="h-10 " />
              </Link>
              <p className="text-white/70 mt-6">Connecting Nigeria, one service at a time.</p>
            </div>
            <div>
              <h3 className="font-bold mb-6">Join Us</h3>
              <JoinWaitlistButton className="px-6 py-3 text-base">
                Join Waitlist
              </JoinWaitlistButton>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/50">
            © 2025 BridgeX. All rights reserved.
          </div>
        </div>
      </footer>

      {/* User Type Modal */}
      <Dialog open={showUserTypeModal} onOpenChange={!isLoading ? setShowUserTypeModal : undefined}>
        <DialogContent className="sm:max-w-[425px] bg-white border-0 shadow-xl">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-600">
              Join Our Waitlist
            </DialogTitle>
            <p className="text-sm text-center text-gray-500">
              Help us serve you better by selecting your role
            </p>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-green-600 font-medium">Processing your request...</p>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              <div className="space-y-4">

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <button
                    onClick={() => handleSubmit('provider')}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-green-600 hover:bg-green-600 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 group-hover:bg-white/20 group-hover:text-white mb-3">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium text-gray-600 group-hover:text-white">I'm a Service Provider</span>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 text-center mt-1">
                      List and offer your services
                    </p>
                  </button>

                  <button
                    onClick={() => handleSubmit('user')}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-green-600 hover:bg-green-600 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 group-hover:bg-white/20 group-hover:text-white mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium text-gray-600 group-hover:text-white">I Need a Service</span>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 text-center mt-1">
                      Find trusted service providers
                    </p>
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
     
    </div>
  );
}
