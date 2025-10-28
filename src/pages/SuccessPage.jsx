import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import Confetti from 'react-confetti';

export default function SuccessPage() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get contact info from location state or use a default
  const contactInfo = location.state?.contact || 'your contact method';
  const isEmail = contactInfo.includes('@');

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    handleResize();
    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    navigate("#");
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-6 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          zIndex={9999}
        />
      )}

      <div className="relative w-full max-w-2xl">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-12 px-8 text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to BridgeX! 🎉
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              You're now on the waitlist for Nigeria's next-gen service platform
            </p>
          </div>

          <CardContent className="p-8 text-center">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  What Happens Next?
                </h3>
                <p className="text-gray-600 mb-6">
                  We'll be in touch at <span className="font-semibold">{contactInfo}</span> when we launch in your area.
                  Get ready to experience seamless service connections like never before!
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  {[
                    {
                      icon: <Zap className="w-6 h-6 text-green-600 mx-auto" />,
                      text: 'Early access to new features'
                    },
                    {
                      icon: <Shield className="w-6 h-6 text-green-600 mx-auto" />,
                      text: 'Exclusive launch offers'
                    },
                    {
                      icon: <Users className="w-6 h-6 text-green-600 mx-auto" />,
                      text: 'Connect with top professionals'
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        {item.icon}
                      </div>
                      <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-gray-500 text-sm mb-6">
                  Invite friends and get priority access when they join!
                </p>
                <Button
                  onClick={() => {
                    const message = `Join me on BridgeX - Nigeria's next-gen service platform! I just joined the waitlist and you should too!`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join BridgeX Waitlist',
                        text: message,
                        url: window.location.origin
                      }).catch(console.error);
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(`${message}\n\n${window.location.origin}`);
                      alert('Invite link copied to clipboard!');
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Invite Friends
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? <a href={`mailto:${import.meta.VITE_PUBLIC_CONTACT_EMAIL}`} className="text-green-600 hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  );
}
