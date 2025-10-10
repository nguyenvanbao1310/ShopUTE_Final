import { useState } from "react";
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from "../../types/order";

interface PaymentMethodProps {
  onSelectPayment?: (method: string) => void;
}

const PaymentMethod = ({ onSelectPayment }: PaymentMethodProps) => {
  const [selected, setSelected] = useState(DEFAULT_PAYMENT_METHOD);

  const handleSelect = (id: string) => {
    setSelected(id);
    if (onSelectPayment) onSelectPayment(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path 
                fillRule="evenodd" 
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Phương thức thanh toán
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selected === method.id
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selected === method.id}
                  onChange={() => handleSelect(method.id)}
                  className="w-4 h-4 text-gray-600 border-2 border-gray-300 focus:ring-gray-500 focus:ring-2"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{method.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{method.desc}</p>
                </div>
                {selected === method.id && (
                  <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
        
      
      </div>
    </div>
  );
};


export default PaymentMethod;