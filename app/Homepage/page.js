"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';

const defaultEventConfig = {
  eventName: "2025 GRVC Ambassadors congress",
  registrationFee: "KES 1,000",
  deadline: new Date("2025-05-14T23:59:59"),
  churches: [
    { id: "nairobi", name: "Nairobi Central SDA Church" },
    { id: "mombasa", name: "Mombasa Central SDA Church" },
    { id: "kisumu", name: "Kisumu Central SDA Church" },
    { id: "eldoret", name: "Eldoret Central SDA Church" }
  ],
  instructions: [
    "Under title, select Mr for male and Ms/Mrs for female.",
    "Ensure your registration is completed before the deadline.",
    "If you have any issues, please contact the event organizers.",
    "Make sure to provide accurate information.",
    "After registration, you will receive a confirmation email and sms.",
    "Payment details will be sent to your registered phone number.",
    "Keep your registration details safe.",
    <>Ensure you have at least <strong>Kshs 1,000</strong> in your <strong>M-Pesa</strong> account before starting the registration.</>
  ],
  isRegistrationOpen: true
};

export default function Homepage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    church: "",
    attendee: {
      name: "",
      title: "",
      email: "",
      phone: ""
    },
    paymentMethod: "mpesa",
    phoneNumber: ""
  });
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = defaultEventConfig.deadline - now;

      if (difference <= 0) {
        setIsRegistrationClosed(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    if (isRegistrationClosed) return;
    
    const { name, value } = e.target;
    if (name in formData.attendee) {
      setFormData(prev => ({
        ...prev,
        attendee: {
          ...prev.attendee,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    if (isRegistrationClosed) return;
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (isRegistrationClosed) return;
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (isRegistrationClosed) return;
    console.log("Form submitted:", formData);
    router.push('/confirmation');
  };

  const isDeadlinePassed = isRegistrationClosed;

  return (
    <>
      <Head>
        <title>{defaultEventConfig.eventName} | Registration</title>
      </Head>

      <nav className="bg-[#1c1c3c] py-4 px-6 border-b border-[#2d2d5d]">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Greater Rift Valley Conference Events Management System</h1>
        </div>
      </nav>
      
      <main className="min-h-screen bg-[#1c1c3c] text-white flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-3xl bg-[#2d2d5d] rounded-xl shadow-lg p-6 space-y-6">
          
          {/* Banner */}
          <div className="rounded overflow-hidden">
            <Image
              src="/amb.jpeg"
              width={500}
              height={300}
              alt="Congress Poster"
              className="rounded-md w-full h-100 object-fit"
              priority
            />
          </div>

          {isRegistrationClosed ? (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-red-500 mb-4">Registration Closed</h2>
              <p className="text-gray-300">The registration deadline has passed. We are no longer accepting new registrations.</p>
            </div>
          ) : (
            <>
              {/* Title & Fee */}
              <div>
                <h1 className="text-2xl font-bold mb-2">{defaultEventConfig.eventName}</h1>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm">
                  <p>📦 <span className="font-semibold">Registration Fee:</span> {defaultEventConfig.registrationFee}</p>
                  <p className="text-red-400 font-semibold">
                    ⏰ Deadline: <span className="text-sm">{timeLeft.days} days, {timeLeft.hours} hrs, {timeLeft.minutes} mins, {timeLeft.seconds}s</span>
                  </p>
                </div>
              </div>

              {/* Current Step Content */}
              {currentStep === 1 && (
                <div>
                  <div className="bg-cyan-600 text-white rounded p-2 font-semibold">Step 1: Instructions</div>
                  <div className="mt-3 space-y-3 text-sm text-gray-200">
                    <ol className="list-decimal pl-5 space-y-2">
                      {defaultEventConfig.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                    <button 
                      onClick={handleNextStep}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded mt-3"
                      disabled={isDeadlinePassed}
                    >
                      Start Registration →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="bg-cyan-600 text-white rounded p-2 font-semibold">Step 2: Select Church</div>
                  <div className="mt-3 space-y-4 text-sm text-gray-200">
                    <select
                      name="church"
                      value={formData.church}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                      required
                    >
                      <option value="">Select your church</option>
                      {defaultEventConfig.churches.map(church => (
                        <option key={church.id} value={church.id}>{church.name}</option>
                      ))}
                    </select>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handlePrevStep}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={!formData.church}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="bg-cyan-600 text-white rounded p-2 font-semibold">Step 3: Attendee Information</div>
                  <div className="mt-3 space-y-4 text-sm text-gray-200">
                    <div>
                      <label className="block mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.attendee.name}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Title</label>
                      <select
                        name="title"
                        value={formData.attendee.title}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      >
                        <option value="">Select title</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.attendee.email}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.attendee.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handlePrevStep}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={!formData.attendee.name || !formData.attendee.title || !formData.attendee.email || !formData.attendee.phone}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div className="bg-cyan-600 text-white rounded p-2 font-semibold">Step 4: Confirm Details</div>
                  <div className="mt-3 space-y-3 text-sm text-gray-200 bg-[#3d3d6d] p-4 rounded">
                    <h4 className="font-bold text-cyan-400">Registration Summary</h4>
                    <p><span className="font-semibold">Church:</span> {formData.church ? defaultEventConfig.churches.find(c => c.id === formData.church)?.name : 'Not selected'}</p>
                    <p><span className="font-semibold">Name:</span> {formData.attendee.title} {formData.attendee.name}</p>
                    <p><span className="font-semibold">Email:</span> {formData.attendee.email}</p>
                    <p><span className="font-semibold">Phone:</span> {formData.attendee.phone}</p>
                    <div className="pt-2 mt-2 border-t border-gray-600">
                      <p className="font-bold">Total Amount: {defaultEventConfig.registrationFee}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handlePrevStep}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <div className="bg-cyan-600 text-white rounded p-2 font-semibold">Step 5: Billing</div>
                  <div className="mt-3 space-y-4 text-sm text-gray-200">
                    <div>
                      <label className="block mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      >
                        <option value="mpesa">M-Pesa</option>
                        <option value="card" disabled>Credit Card (Coming Soon)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">M-Pesa Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#2d2d5d] border border-gray-600 rounded text-white"
                        required
                      />
                    </div>
                    <div className="bg-yellow-900/20 p-3 rounded text-yellow-200 text-xs">
                      You will receive an M-Pesa payment request on this number
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handlePrevStep}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!formData.phoneNumber}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                      >
                        Complete Registration
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps Indicator */}
              <div className="space-y-2 text-sm text-gray-400">
                {[1, 2, 3, 4, 5].map((step) => (
                  <p 
                    key={step} 
                    className={currentStep >= step ? "text-white font-medium" : "opacity-50"}
                  >
                    Step {step}: {getStepName(step)}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function getStepName(step) {
  switch(step) {
    case 1: return "Instructions";
    case 2: return "Select Church";
    case 3: return "Attendee Information";
    case 4: return "Confirm Details";
    case 5: return "Billing";
    default: return "";
  }
}