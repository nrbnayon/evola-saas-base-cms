import { useState, useEffect } from "react";
import { Zap, Clock, CheckCircle, Star, TrendingUp, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../lib/api-client";
import Swal from "sweetalert2";

export default function BoostingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get("/site/boosting-plan/list");
        setPlans(response.data.filter(plan => plan.active));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch boosting plans.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      confirmPayment(token);
    }
  }, [location.search]);

  const confirmPayment = async (order_id) => {
    try {
      const response = await apiClient.post("/payment/paypal/boosting/confirm", { order_id });
      if (response.data.success) {
        // Navigate to success page instead of Swal
        navigate('/payment-success', { replace: true });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Payment confirmation failed",
        text: err.response?.data?.message || err.message || 'Unknown error',
      });
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    if (selectedPayment === 'Paypal') {
      try {
        const response = await apiClient.post("/seller/service/boost", {
          plan: selectedPlan.id,
          service: parseInt(id)
        });
        const checkout_url = response.data.checkout_url;
        window.location.href = checkout_url;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to initiate payment",
          text: err.response?.data?.message || err.message || 'Unknown error',
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // For Stripe or others, placeholder
      console.log(`Boosting service ${id} with plan ${selectedPlan.id} using ${selectedPayment}`);
      setIsProcessing(false);
    }
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const getPlanIcon = (duration) => {
    if (duration <= 7) return <Zap className="w-6 h-6" />;
    if (duration <= 30) return <TrendingUp className="w-6 h-6" />;
    if (duration <= 365) return <Star className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const getPlanColor = (index) => {
    const colors = [
      { bg: "bg-gradient-to-br from-purple-500 to-purple-600", text: "text-purple-600", border: "border-purple-200", ring: "ring-purple-100" },
      { bg: "bg-gradient-to-br from-blue-500 to-blue-600", text: "text-blue-600", border: "border-blue-200", ring: "ring-blue-100" },
      { bg: "bg-gradient-to-br from-amber-500 to-amber-600", text: "text-amber-600", border: "border-amber-200", ring: "ring-amber-100" },
    ];
    return colors[index % colors.length];
  };

  const getPlanFeatures = (duration) => {
    const baseFeatures = [
      "Top search ranking",
      "Priority listing",
      "Enhanced visibility",
    ];
    
    if (duration <= 7) {
      return [...baseFeatures ];
    } else if (duration <= 30) {
      return [...baseFeatures, "Email notifications"];
    } else {
      return [...baseFeatures, "Email notifications", "Priority support", "Featured badge"];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading boosting plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Plans</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Plans Available</h3>
          <p className="text-slate-600">There are currently no boosting plans available. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Boost Your Service
          </h1>
          <p className="text-lg text-slate-300 text-center max-w-2xl mx-auto">
            Increase visibility and reach more customers with our premium boosting plans
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, title: "Increased Visibility", desc: "Appear at the top of search results" },
            { icon: <Star className="w-5 h-5" />, title: "More Engagement", desc: "Get more views and inquiries" },
            { icon: <Shield className="w-5 h-5" />, title: "Trusted Platform", desc: "Secure and reliable service" },
          ].map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex items-start space-x-4 hover:shadow-xl transition-shadow">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-700">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans Section */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">
          Choose Your Plan
        </h2>
        <p className="text-slate-600 text-center mb-10">
          Select the perfect boost duration for your needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const colorScheme = getPlanColor(index);
            const isPopular = index === 1 || plan.priority_score > 10;
            const features = getPlanFeatures(plan.duration);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                  isPopular ? 'ring-4 ' + colorScheme.ring + ' scale-105' : ''
                }`}
                onClick={() => handleSelectPlan(plan)}
              >
                {isPopular && (
                  <div className={`absolute top-0 right-0 ${colorScheme.bg} text-white text-xs font-bold px-4 py-2 rounded-bl-2xl`}>
                    POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl ${colorScheme.bg} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {getPlanIcon(plan.duration)}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {plan.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold text-slate-900">
                      ${parseFloat(plan.price).toFixed(2)}
                    </span>
                    <span className="text-slate-600 ml-2">USD</span>
                  </div>

                  {/* Duration */}
                  <div className={`inline-flex items-center space-x-2 ${colorScheme.text} bg-slate-50 px-4 py-2 rounded-full mb-6`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {plan.duration} {plan.duration === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 min-h-[48px]">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className={`w-5 h-5 ${colorScheme.text} flex-shrink-0`} />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    className={`w-full ${colorScheme.bg} text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all transform group-hover:scale-105 flex items-center justify-center space-x-2`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                  >
                    <span>Select Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-t-3xl">
              <h2 className="text-3xl font-bold mb-2">
                Payment Method
              </h2>
              <p className="text-slate-300">
                Complete your {selectedPlan?.title} plan purchase
              </p>
            </div>

            <div className="p-8">
              {/* Selected Plan Summary */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 font-medium">Selected Plan</span>
                  <span className="text-xl font-bold text-slate-900">{selectedPlan?.title}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-600 font-medium">Duration</span>
                  <span className="text-slate-900 font-semibold">{selectedPlan?.duration} days</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Total Amount</span>
                  <span className="text-3xl font-extrabold text-slate-900">${selectedPlan?.price}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4 mb-8">
                {[
                  { name: "Stripe", icon: "S", color: "purple", desc: "Credit/Debit Card" },
                  { name: "Paypal", icon: "P", color: "blue", desc: "PayPal Account" }
                ].map((method) => (
                  <label
                    key={method.name}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-5 transition-all duration-200 ${
                      selectedPayment === method.name
                        ? method.color === "purple"
                          ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-100"
                          : "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedPayment(method.name)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${
                          method.color === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800 text-lg">{method.name}</span>
                        <span className="block text-sm text-slate-500">{method.desc}</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.name
                        ? method.color === "purple" 
                          ? "border-purple-500 bg-purple-500"
                          : "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}>
                      {selectedPayment === method.name && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  className="flex-1 rounded-2xl border-2 border-slate-300 py-4 font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
                  onClick={closePaymentModal}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
                  onClick={handleContinue}
                  disabled={!selectedPayment || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}