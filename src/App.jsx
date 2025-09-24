import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { CheckCircle, Users, Zap, Shield } from "lucide-react";
import debridgeLogo from "/logo.png";
import "./App.css";
import { WaitlistForm } from "./components/landing-page/WaitlistForm";

function App() {

  const handleScrollToWaitlist = () => {
    const waitlistSection = document.getElementById("get-early-acces");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={debridgeLogo}
              alt="BridgeX Logo"
              className="h-24 w-auto"
            />
            <div className="text-3xl font-bold text-gray-900">BridgeX</div>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200 text-lg font-semibold px-6 py-3 animate-pulse hover:animate-bounce transition-all duration-300 shadow-lg"
          >
            Coming Soon
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 lg:pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connecting Service Providers with Service Users
            <span className="text-green-600"> Across Nigeria</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
            The revolutionary digital marketplace where service users get free
            lifetime access to trusted providers, and service providers connect
            with new customers.
          </p>
          <Button
            type="button"
            onClick={handleScrollToWaitlist}
            className="h-12 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 mb-10 px-6"
          >
            Get Early Access
          </Button>
          {/* Dual Value Proposition */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">For Service Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Free, lifetime access to trusted service providers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Get matched in real-time with service providers
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">For Service Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Get access to a stream of new customers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Increase your revenue and income
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Form */}
        </div>
      </section>
      <WaitlistForm />

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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted & Verified
              </h3>
              <p className="text-gray-600">
                All service providers are carefully vetted and verified for
                quality and reliability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-Time Matching
              </h3>
              <p className="text-gray-600">
                Get instantly connected with available service providers in your
                area.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Free for Users
              </h3>
              <p className="text-gray-600">
                Lifetime free access for service users - no hidden fees or
                charges ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-green-200">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            © {new Date().getFullYear()} BridgeX. All rights reserved.
          </p>
          <p className="text-sm">Bridge and Ladder Synergy Solution LLC</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
