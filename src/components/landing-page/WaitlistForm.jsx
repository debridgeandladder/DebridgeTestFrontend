import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import "../../App.css";

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    userType: "",
    isSubmitted: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    contact: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (formData, setErrorMessages) => {
    if (!formData.userType) {
      setErrorMessages((prev) => ({
        ...prev,
        userType:
          "Please select whether you are a Service User or Service Provider.",
      }));
      return false;
    }

    if (!formData.email) {
      if (!formData.phoneNumber) {
        setErrorMessages((prev) => ({
          ...prev,
          contact: "Please enter your phone number or email.",
        }));
        return false;
      } else {
        if (formData.phoneNumber.length < 11) {
          setErrorMessages((prev) => ({
            ...prev,
            contact:
              "Please enter a valid phone number with at least 11 digits.",
          }));
          return false;
        }
      }
    } else {
      //Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessages((prev) => ({
          ...prev,
          contact: "Please enter a valid email address.",
        }));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm(formData, setErrorMessages);
    if (!isValid) return;

    setIsLoading(true);

    try {
      // Submit to Formspree (replace YOUR_FORM_ID with actual Formspree form ID)
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: formData.email || formData.phoneNumber,
          userType: formData.userType,
          timestamp: new Date().toISOString(),
          source: "BridgeX Waitlist",
        }),
      });

      if (response.ok) {
        setFormData((prev) => ({ ...prev, isSubmitted: true }));
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // For now, still show success page even if there's an error
      // In production, you'd want to show an error message
      setFormData((prev) => ({ ...prev, isSubmitted: true }));
    }

    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "phoneNumber")
      value = value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessages((prev) => ({ ...prev, contact: "" }));
  };
  const selectUserType = (type) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    setErrorMessages((prev) => ({ ...prev, userType: "" }));
  };

  if (formData.isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4 fixed top-0 w-full">
        <Card className="w-full max-w-md text-center border-green-200 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              You're In!
            </CardTitle>
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
                Keep an eye on your phone for updates from the BridgeX team.
              </p>
            </div>
            <Button
              type="button"
              className="cursor-pointer px-4 w-full"
              onClick={() =>
                setFormData((prev) => ({ ...prev, isSubmitted: false }))
              }
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section
      className="container mx-auto px-4 py-12 lg:py-20"
      id="get-early-acces"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Waitlist Form */}
        <Card className="max-w-md mx-auto border-green-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Get Early Access
            </CardTitle>
            <CardDescription className="text-gray-600">
              Be among the first to experience BridgeX when we launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-base font-medium text-gray-700">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <Button
                    type="button"
                    variant={
                      formData.userType === "user" ? "default" : "outline"
                    }
                    className={`h-12 ${
                      formData.userType === "user"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                    onClick={() => selectUserType("user")}
                  >
                    Service User
                  </Button>
                  <Button
                    type="button"
                    variant={
                      formData.userType === "provider" ? "default" : "outline"
                    }
                    className={`h-12 ${
                      formData.userType === "provider"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                    onClick={() => selectUserType("provider")}
                  >
                    Service Provider
                  </Button>
                </div>
                {errorMessages.userType && (
                  <p className="text-xs text-red-600 -mt-2">
                    {errorMessages.userType}
                  </p>
                )}
              </div>
              <>
                {/* Contact Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      name="phoneNumber"
                      inputMode="numeric"
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                {errorMessages.contact && (
                  <p className="text-xs text-red-600 -mt-3">
                    {errorMessages.contact}
                  </p>
                )}
              </>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining Waitlist...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Get Early Access
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
