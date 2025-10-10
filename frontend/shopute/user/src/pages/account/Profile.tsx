import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchProfile, updateProfile } from "../../store/authSlice";

const defaultAvatar = "/logo192.png";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((s: RootState) => s.auth);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState<boolean | null>(null);
  const [birthday, setBirthday] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      setFirstname(user.firstName);
      setLastname(user.lastName);
      setPhone(user.phone);
      setEmail(user.email);
      setGender(user.gender ?? null);
      setBirthday(user.birthday ?? "");
      setAvatar(user.avatar_url || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      // TODO: gửi file lên server qua FormData nếu API hỗ trợ
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        firstName: firstname, lastName: lastname, phone, email, gender, birthday
      }))
      .unwrap()
      .then(() => {
        alert("Cập nhật thành công!");
        setIsEditing(false);
      })
      .catch((err) => {
        alert("Cập nhật thất bại: " + err);
      });
  };
if (loading && !user) return <p>Đang tải...</p>;
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-semibold text-gray-700 border-b pb-4 mb-6">
        Hồ sơ của tôi
      </h1>

      <div className="flex gap-10">
        {/* Avatar */}
        <div className="flex flex-col items-center w-1/3">
          <img
            src={avatar || defaultAvatar}
            alt="Avatar"
            className="rounded-full h-32 w-32 object-cover border-2 border-gray-300"
          />
          {isEditing && (
            <label className="mt-4 cursor-pointer text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
              Đổi ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Họ</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Giới tính</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={gender === true}
                    onChange={() => setGender(true)}
                    disabled={!isEditing}
                  />
                  Nam
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={gender === false}
                    onChange={() => setGender(false)}
                    disabled={!isEditing}
                  />
                  Nữ
                </label>
              </div>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                Thay đổi thông tin
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
