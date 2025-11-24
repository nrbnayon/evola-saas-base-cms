import { XCircle } from "lucide-react";

// Payment Cancel Page Component
export function BoostPaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-red-100 text-lg">
              Your payment was not completed
            </p>
          </div>
          <div className="p-5">
            {/* Reassurance */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-center text-sm">
                <strong>✓ No charges were made.</strong> Your payment method was
                not charged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
