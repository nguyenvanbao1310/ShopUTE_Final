import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchProvinces, fetchWards } from "../../store/locationSlice";
import { Address } from "../../types/address";

interface FormProps {
  editing: Address | null;
  onClose: () => void;
  onSave: (form: {
    street: string;
    ward: string;
    province: string;
    phone: string;
    address: string;
    isDefault?: boolean;
  }) => void;
}

export default function AddressForm({ editing, onClose, onSave }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { provinces, wardsByProvince } = useSelector(
    (s: RootState) => s.location
  );

  const [street, setStreet] = useState(editing?.street || "");
  const [provinceId, setProvinceId] = useState<string>("");
  const [wardId, setWardId] = useState<string>("");
  const [phone, setPhone] = useState(editing?.phone || "");
  const [isDefault, setIsDefault] = useState(editing?.isDefault || false);

  // load provinces khi mở form
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // khi edit -> set provinceId
  useEffect(() => {
    if (editing && provinces.length > 0) {
      const match = provinces.find((p) => p.full_name === editing.province);
      if (match) {
        setProvinceId(match.id);
        dispatch(fetchWards(match.id));
      }
    }
  }, [editing, provinces, dispatch]);

  // khi edit -> set wardId
  useEffect(() => {
    if (editing && provinceId && wardsByProvince[provinceId]) {
      const match = wardsByProvince[provinceId].find(
        (w) => w.full_name === editing.ward
      );
      if (match) setWardId(match.id);
    }
  }, [editing, provinceId, wardsByProvince]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const provinceName =
      provinces.find((p) => p.id === provinceId)?.full_name || "";
    const wardName =
      wardsByProvince[provinceId]?.find((w) => w.id === wardId)?.full_name || "";

    const address = `${street}, ${wardName}, ${provinceName}`;
    onSave({ street, ward: wardName, province: provinceName, phone, address, isDefault });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {editing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Số nhà / Đường"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Tỉnh */}
          <select
            value={provinceId}
            onChange={(e) => {
              setProvinceId(e.target.value);
              dispatch(fetchWards(e.target.value));
              setWardId(""); // reset khi đổi tỉnh
            }}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>

          {/* Phường */}
          <select
            value={wardId}
            onChange={(e) => setWardId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {wardsByProvince[provinceId]?.map((w) => (
              <option key={w.id} value={w.id}>
                {w.full_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            Đặt làm mặc định
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editing ? "Cập nhật" : "Hoàn thành"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
