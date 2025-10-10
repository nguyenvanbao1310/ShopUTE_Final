import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressApi } from "../apis/addressApi";
import { Address } from "../types/address";

interface AddressState {
  addresses: Address[];
  defaultAddress?: Address;
  loading: boolean;
  error?: string;
}

const initialState: AddressState = {
  addresses: [],
  defaultAddress: undefined,
  loading: false,
};

// Thunk lấy tất cả địa chỉ
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async () => {
    const res = await addressApi.getAll();
    return res;
  }
);

// Thêm địa chỉ
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (data:{
    street: string;
    ward: string;
    province: string;
    phone: string;
    isDefault?: boolean;
  }) => {
    const res = await addressApi.create(data);
    return res;
  }
);
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({
    id,
    data,
  }: {
    id: number;
    data: {
      street: string;
      ward: string;
      province: string;
      phone: string;
      isDefault?: boolean;
    };
  }) => {
    const res = await addressApi.update(id, data);
    return res;
  }
);

// Xóa địa chỉ
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id: number) => {
    await addressApi.remove(id);
    return id;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setDefaultAddress(state, action) {
      state.defaultAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.defaultAddress = action.payload.find((a: Address) => a.isDefault);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        if (action.payload.isDefault) {
          state.defaultAddress = action.payload;
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.addresses.findIndex((a) => a.id === action.payload.id);
        if (idx >= 0) state.addresses[idx] = action.payload;
        if (action.payload.isDefault) {
          state.defaultAddress = action.payload;
        }
      })

      // delete
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
        if (state.defaultAddress?.id === action.payload) {
          state.defaultAddress = undefined;
        }
      });
      
  },
});

export const { setDefaultAddress } = addressSlice.actions;
export default addressSlice.reducer;