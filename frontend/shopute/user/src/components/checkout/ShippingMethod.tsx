import { useEffect, useState } from "react";
import { shippingMethodApi } from "../../apis/shippingMethodApi";
import type { ShippingMethod as ShippingMethodType } from "../../types/shippingMethod";

interface ShippingMethodProps {
  onSelectShipping?: (method: ShippingMethodType | null) => void;
}

const ShippingMethod = ({ onSelectShipping }: ShippingMethodProps) => {
  const [methods, setMethods] = useState<ShippingMethodType[]>([]);
  const [selected, setSelected] = useState<ShippingMethodType | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await shippingMethodApi.getAll();
        setMethods(res);
      } catch (e) {
        console.error("Failed to fetch shipping methods:", e);
      }
    };
    fetchMethods();
  }, []);

  const handleSelect = (method: ShippingMethodType) => {
    setSelected(method);
    setShowModal(false);
    if (onSelectShipping) onSelectShipping(method);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Phương thức vận chuyển
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selected ? (
          <div
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setShowModal(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{selected.name}</p>
                {selected.estimatedDays && (
                  <p className="text-sm text-gray-600">
                    Dự kiến giao: {selected.estimatedDays}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-semibold text-gray-900">
                  {Number(selected.fee).toLocaleString()}₫
                </p>
                <p className="text-xs text-gray-500">Phí vận chuyển</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            Chọn phương thức giao hàng
          </button>
        )}
      </div>

      {/* Modal chọn shipping method */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chọn phương thức giao hàng</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selected?.id === method.id
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelect(method)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{method.name}</p>
                      {method.estimatedDays && (
                        <p className="text-sm text-gray-600 mb-1">
                          Dự kiến: {method.estimatedDays}
                        </p>
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {Number(method.fee).toLocaleString()}₫
                      </p>
                    </div>
                    {selected?.id === method.id && (
                      <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingMethod;