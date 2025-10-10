import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { CartItemDTO, removeCartItem, toggleSelectItem, updateCartItem } from "../../store/cartSlice";
import { Link } from "react-router-dom";

type Props = {
  item: CartItemDTO;
};

const CartItem: React.FC<Props> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();

  const onToggle = (checked: boolean) => {
    dispatch(toggleSelectItem({ itemId: item.id, selected: checked }));
  };

  const onDec = () => {
    const q = Math.max(1, item.quantity - 1);
    dispatch(updateCartItem({ itemId: item.id, quantity: q }));
  };

  const onInc = () => {
    const q = item.quantity + 1;
    dispatch(updateCartItem({ itemId: item.id, quantity: q }));
  };

  const onRemove = () => {
    dispatch(removeCartItem({ itemId: item.id }));
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      <input
        type="checkbox"
        className="mt-2"
        checked={item.selected}
        onChange={(e) => onToggle(e.target.checked)}
      />

      <Link to={`/product/${item.productId}`} className="w-20 h-20 flex-shrink-0">
        <img
          src={item.imageUrl || "/placeholder.png"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
          loading="lazy"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.productId}`} className="line-clamp-2 font-medium hover:underline">
          {item.name}
        </Link>

        <div className="mt-1 text-red-600 font-semibold">
          {item.price.toLocaleString("vi-VN")}₫
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button className="px-2 py-1 border rounded" onClick={onDec}>−</button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button className="px-2 py-1 border rounded" onClick={onInc}>＋</button>

          <button className="ml-4 text-sm text-gray-500 hover:text-red-600" onClick={onRemove}>
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
