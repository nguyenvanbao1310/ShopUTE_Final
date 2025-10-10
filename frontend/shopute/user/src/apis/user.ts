import { api } from './base';
import { Profile } from '../types/user';
export const userApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get<Profile>('/users/profile');
    return data;
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const { data } = await api.put<Profile>('users/profile/updateInfor', profileData);
    return data;
  },
   changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put("/users/profile/changePassword", data);
    return res.data;
  },
  confirmChangePassword: async (data: { otp: string; newPassword: string }) => {
    const res = await api.put("/users/profile/confirmChangePassword", data);
    return res.data;
  },
};
