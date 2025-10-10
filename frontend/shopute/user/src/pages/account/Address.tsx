import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../store/addressSlice";
import { Address } from "../../types/address";
import AddressForm from "./AddressForm";
export default function AddressPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading } = useSelector((s: RootState) => s.address);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    await dispatch(deleteAddress(id));
  };

  const handleSave = async (form: {
    street: string;
    ward: string;
    province: string;
    phone: string;
    address: string;
    isDefault?: boolean;
  }) => {
    if (editing) {
      await dispatch(updateAddress({ id: editing.id, data: form }));
    } else {
      await dispatch(createAddress(form));
    }
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Địa chỉ của tôi</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">
                {addr.street}, {addr.ward}, {addr.province}
              </p>
              <p className="text-gray-600">SĐT: {addr.phone}</p>
              {addr.isDefault && (
                <span className="text-xs text-red-600 border border-red-600 px-2 py-1 rounded">
                  Mặc định
                </span>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(addr);
                  setShowForm(true);
                }}
                className="text-blue-600"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AddressForm
          editing={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
