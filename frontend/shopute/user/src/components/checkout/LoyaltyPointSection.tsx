import { useState } from "react";

interface Props {
  availablePoints: number;
  onApplyPoints: (points: number) => void;
}

const LoyaltyPointSection = ({ availablePoints, onApplyPoints }: Props) => {
  const [isUsingPoints, setIsUsingPoints] = useState(false);
  const [usePoints, setUsePoints] = useState<string>(""); // Đổi thành string để handle input tốt hơn
  const [error, setError] = useState<string>("");

  const handleApply = () => {
    if (!isUsingPoints) {
      onApplyPoints(0);
      return;
    }

    const pointsNumber = parseInt(usePoints);
    
    // Validation
    if (isNaN(pointsNumber) || pointsNumber < 0) {
      setError("Vui lòng nhập số điểm hợp lệ");
      return;
    }

    if (pointsNumber > availablePoints) {
      setError(`Số điểm không được vượt quá ${availablePoints} điểm`);
      return;
    }

    if (pointsNumber === 0) {
      setError("Số điểm phải lớn hơn 0");
      return;
    }

    // Clear error và apply
    setError("");
    onApplyPoints(pointsNumber);
  };

  const handleToggle = () => {
    const newIsUsingPoints = !isUsingPoints;
    setIsUsingPoints(newIsUsingPoints);
    
    if (!newIsUsingPoints) {
      // Tắt switch - reset mọi thứ
      setUsePoints("");
      setError("");
      onApplyPoints(0);
    } else {
      // Bật switch - reset input và error
      setUsePoints("");
      setError("");
    }
  };

  const handleInputChange = (value: string) => {
    setUsePoints(value);
    setError(""); // Clear error khi user typing
  };

  // Quick select buttons
  const quickSelectOptions = [
    { label: "25%", value: Math.floor(availablePoints * 0.25) },
    { label: "50%", value: Math.floor(availablePoints * 0.5) },
    { label: "75%", value: Math.floor(availablePoints * 0.75) },
    { label: "Tất cả", value: availablePoints },
  ].filter(option => option.value > 0);

  const switchClasses = {
    base: "relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out",
    checked: "bg-emerald-500",
    unchecked: "bg-gray-200",
    dotBase: "inline-block w-5 h-5 transform bg-white rounded-full shadow transition ease-in-out duration-200",
    dotChecked: "translate-x-5",
    dotUnchecked: "translate-x-0.5",
  };

 return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Sử dụng điểm thưởng</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Toggle Switch Section */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 font-medium">Sử dụng điểm thưởng</p>
          <button
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
              isUsingPoints ? 'bg-amber-500' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isUsingPoints}
          >
            <span
              aria-hidden="true"
              className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition ease-in-out duration-200 ${
                isUsingPoints ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Points Available */}
        <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-gray-600 text-sm">
            Điểm hiện có: <span className="font-bold text-amber-600 text-lg">{availablePoints.toLocaleString()}</span> điểm
          </p>
          <p className="text-xs text-gray-500 mt-1">
            1 điểm = 1,000₫
          </p>
        </div>

        {/* Input Section */}
        {isUsingPoints && (
          <div className="space-y-4">
            {/* Quick Select Buttons */}
            {quickSelectOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn nhanh:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickSelectOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleInputChange(option.value.toString())}
                      className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors duration-200"
                    >
                      {option.label} ({option.value.toLocaleString()})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field */}
            <div>
              <label htmlFor="points-input" className="block text-sm font-medium text-gray-700 mb-2">
                Nhập số điểm muốn sử dụng:
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    id="points-input"
                    type="number"
                    className={`border rounded-lg px-3 py-2 w-full focus:ring-amber-500 focus:border-amber-500 transition-all duration-150 ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    value={usePoints}
                    onChange={(e) => handleInputChange(e.target.value)}
                    min={0}
                    max={availablePoints}
                    placeholder="Nhập điểm"
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>
                
                <button
                  onClick={handleApply}
                  className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-amber-500 text-white hover:bg-amber-600 flex-shrink-0"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Preview */}
            {usePoints && !error && parseInt(usePoints) > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-700">
                  Giảm giá: <span className="font-semibold">{(parseInt(usePoints) * 1000).toLocaleString()}₫</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default LoyaltyPointSection;