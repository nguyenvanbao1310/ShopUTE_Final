import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "http://localhost:8088/api";
function getTokenFromStorage(): string | undefined {
  try {
    const t =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      undefined;
    return t && t.trim() ? t : undefined;
  } catch {
    return undefined;
  }
}
function getDeviceId(): string {
  try {
    const KEY = "deviceId";
    let id = localStorage.getItem(KEY) ?? "";
    if (!id) {
      id = (crypto as any)?.randomUUID?.() ?? `dev-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "device-fallback";
  }
}

// ===== Types =====
export type CartItemDTO = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  imageUrl?: string;
};

export type CartDTO = {
  cartId: number | string;
  items: CartItemDTO[];
  totalItems: number; // unique item count for badge
  totalQuantity: number; // total quantity across items
};

type CartState = {
  cart: CartDTO | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

const initialState: CartState = {
  cart: null,
  status: "idle",
};

// ===== Thunks =====
export const fetchCart = createAsyncThunk<CartDTO>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      const resp = await axios.get(`${BASE_URL}/cart`, { headers, withCredentials: true });
      const data: any = (resp?.data as any)?.data ?? (resp?.data as any);
      const items: CartItemDTO[] = (data.items ?? []).map((it: any) => ({
        id: Number(it.id),
        productId: Number(it.productId),
        name: String(it.name ?? ""),
        price: Number(it.price ?? 0),
        quantity: Number(it.quantity ?? 0),
        selected: Boolean(it.selected),
        imageUrl: it.thumbnailUrl || it.imageUrl || undefined,
      })) as CartItemDTO[];
      const totalItems = data?.totalItems ?? items.length;
      const totalQuantity =
        data?.totalQuantity ?? items.reduce((s: number, it: CartItemDTO) => s + (it.quantity || 0), 0);
      return { cartId: data?.cartId, items, totalItems, totalQuantity } as CartDTO;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk<
  void,
  { productId: number; quantity?: number }
>(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.post(`${BASE_URL}/cart/items`, { productId, quantity }, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk<
  void,
  { itemId: number; quantity: number }
>(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.patch(`${BASE_URL}/cart/items/${itemId}`, { quantity }, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to update quantity");
    }
  }
);

export const toggleSelectItem = createAsyncThunk<
  void,
  { itemId: number; selected: boolean }
>(
  "cart/toggleSelectItem",
  async ({ itemId, selected }, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.patch(`${BASE_URL}/cart/items/${itemId}`, { selected }, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to toggle select");
    }
  }
);

export const selectAll = createAsyncThunk<void>(
  "cart/selectAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.post(`${BASE_URL}/cart/toggle-select-all`, { selected: true }, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to select all");
    }
  }
);

export const unselectAll = createAsyncThunk<void>(
  "cart/unselectAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.post(`${BASE_URL}/cart/toggle-select-all`, { selected: false }, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to unselect all");
    }
  }
);

export const removeCartItem = createAsyncThunk<void, { itemId: number }>(
  "cart/removeCartItem",
  async ({ itemId }, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.delete(`${BASE_URL}/cart/items/${itemId}`, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk<void>(
  "cart/clearCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      const headers: any = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-device-id": getDeviceId() };
      await axios.delete(`${BASE_URL}/cart/clear`, { headers, withCredentials: true });
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to clear cart");
    }
  }
);

// Merge guest cart (device) into user cart after login
export const mergeGuestCart = createAsyncThunk<void>(
  "cart/mergeGuestCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      if (!token) return; // only applicable when logged in
      const deviceId = getDeviceId();
      if (!deviceId) return;
      await axios.post(
        `${BASE_URL}/cart/merge`,
        { deviceId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      await dispatch(fetchCart());
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "Failed to merge cart");
    }
  }
);

// ===== Slice =====
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch cart";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to add to cart";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to update quantity";
      })
      .addCase(toggleSelectItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to toggle select";
      })
      .addCase(selectAll.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to select all";
      })
      .addCase(unselectAll.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to unselect all";
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to remove item";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to clear cart";
      });
  },
});

export default cartSlice.reducer;

// ===== Selectors =====
export const selectCart = (s: any) => s.cart?.cart as CartDTO | null;
export const selectCartStatus = (s: any) => s.cart?.status as CartState["status"];
export const selectCartBadge = (s: any) => s.cart?.cart?.totalItems ?? 0;
export const selectSelectedItems = (s: any) =>
  (s.cart?.cart?.items ?? []).filter((it: CartItemDTO) => it.selected);