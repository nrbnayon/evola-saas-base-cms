import { CheckCircle } from "lucide-react";

// Payment Success Page Component
export function BoostPaymentSuccessPage() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-lg">
              Your service has been boosted successfully
            </p>
          </div>

          
        </div>
        {/* Footer Note */}
        <p className="text-center text-slate-600 mt-6 text-sm">
          Questions about your purchase? <a href="#" className="text-green-600 font-semibold hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
