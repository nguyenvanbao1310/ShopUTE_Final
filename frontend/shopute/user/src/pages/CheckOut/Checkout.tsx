import AddressSection from "../../components/checkout/AddressSection";
import ProductList from "../../components/checkout/ProductList";
import VoucherSection from "../../components/checkout/VoucherSection";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import OrderSummary from "../../components/checkout/OrderSummary";
import LoyaltyPointSection from "../../components/checkout/LoyaltyPointSection";
import Layout from "../../layouts/MainLayout";
import { useState } from "react";
import { Voucher } from "../../types/voucher";
import { ShippingMethod as ShippingMethodType } from "../../types/shippingMethod";
import { Address } from "../../types/address";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Checkout = () => {
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const availablePoints = user?.loyaltyPoints ?? 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thanh toán đơn hàng
              </h1>
              <p className="text-gray-600">
                Vui lòng kiểm tra thông tin và hoàn tất đơn hàng
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-600">Giỏ hàng</span>
                </div>
                
                <div className="w-12 h-0.5 bg-blue-500"></div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-600">Thanh toán</span>
                </div>
                
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-500">3</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Hoàn tất</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Step 1: Review Products */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        Xác nhận sản phẩm
                      </h2>
                    </div>
                    <ProductList />
                  </div>

                  {/* Step 2: Delivery Information */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Thông tin giao hàng
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <AddressSection onSelectAddress={setAddress} />
                      <ShippingMethod onSelectShipping={setShippingMethod} />
                    </div>
                  </div>

                  {/* Step 3: Payment Method */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        Phương thức thanh toán
                      </h2>
                    </div>
                    <PaymentMethod onSelectPayment={setPaymentMethod} />
                  </div>

                  {/* Step 4: Discounts & Promotions */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                        Ưu đãi & Khuyến mãi
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <VoucherSection onSelectVoucher={setVoucher} />
                      <LoyaltyPointSection 
                        availablePoints={availablePoints} 
                        onApplyPoints={setUsedPoints} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
               <div className="sticky top-36">   
                  <OrderSummary
                    voucher={voucher}
                    paymentMethod={paymentMethod}
                    shippingMethod={shippingMethod}
                    address={address}
                    usedPoints={usedPoints}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </Layout>
  );
};

export default Checkout;