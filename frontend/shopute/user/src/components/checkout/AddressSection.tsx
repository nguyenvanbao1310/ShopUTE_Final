import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchAddresses } from "../../store/addressSlice";
import { useEffect, useState } from "react";
import { Address } from "../../types/address";

interface AddressSectionProps {
  onSelectAddress?: (addr: Address | null) => void;
}
const AddressSection = ({ onSelectAddress }: AddressSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { defaultAddress, addresses, loading } = useSelector(
    (state: RootState) => state.address
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchAddressesWithErrorHandling = async () => {
      try {
        setError("");
        await dispatch(fetchAddresses()).unwrap();
      } catch (err: any) {
        setError("Không thể tải địa chỉ. Vui lòng thử lại.");
        console.error("Failed to fetch addresses:", err);
      }
    };
    fetchAddressesWithErrorHandling();
  }, [dispatch]);
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(defaultAddress || addresses[0]);
      if (onSelectAddress) onSelectAddress(defaultAddress || addresses[0]);
    }
  }, [addresses, defaultAddress, onSelectAddress]);

  if (loading) {
    return <p>Đang tải địa chỉ...</p>;
  }
  if (error) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-red-100">
        <p className="text-red-600 mb-3">{error}</p>
        <button 
          onClick={() => dispatch(fetchAddresses())}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-green-100">
        <p className="text-gray-600">Bạn chưa có địa chỉ mặc định</p>
        <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg">
          Thêm địa chỉ mới
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Phần hiển thị địa chỉ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Địa chỉ nhận hàng
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">
                  {user?.firstName || ""} {user?.lastName || ""}
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-blue-600 font-medium">
                  {selectedAddress?.phone}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {selectedAddress?.street}, {selectedAddress?.ward},{" "}
                {selectedAddress?.province}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex-shrink-0"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {/* Modal chọn địa chỉ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chọn địa chỉ</h3>
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
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedAddress?.id === addr.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedAddress(addr);
                    if (onSelectAddress) onSelectAddress(addr);
                    setShowModal(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {addr.street}, {addr.ward}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">{addr.province}</p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                    {selectedAddress?.id === addr.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
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
    </>
  );
};

export default AddressSection;
