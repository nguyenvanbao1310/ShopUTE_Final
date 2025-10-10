import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Province {
  id: string;
  full_name: string;
}
export interface Ward {
  id: string;
  full_name: string;
}
interface LocationState {
  provinces: Province[];
  wardsByProvince: { [provinceId: string]: Ward[] };
  loading: boolean;
  error?: string;
}
const initialState: LocationState = {
  provinces: [],
  wardsByProvince: {},
  loading: false,
};

export const fetchProvinces = createAsyncThunk(
  "location/fetchProvinces",
  async () => {
    const res = await axios.get("https://esgoo.net/api-tinhthanh-new/1/0.htm");
    return res.data.data as Province[];
  }
);

export const fetchWards = createAsyncThunk(
  "location/fetchWards",
  async (provinceId: string) => {
    const res = await axios.get(
      `https://esgoo.net/api-tinhthanh-new/2/${provinceId}.htm`
    );
    return { provinceId, wards: res.data.data as Ward[] };
  }
);
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.wardsByProvince[action.payload.provinceId] = action.payload.wards;
      });
  },
});

export default locationSlice.reducer;