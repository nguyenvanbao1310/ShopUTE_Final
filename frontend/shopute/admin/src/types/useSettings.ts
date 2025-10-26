export type StoreProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: number;
};

export type StoreTiming = {
  day: string;
  start: string;
  end: string;
  fullDay: boolean;
};

export type StoreContact = {
  email: string;
  hotline: string;
  facebook: string;
  zalo: string;
};

export type StoreSettings = {
  profile: StoreProfile;
  timing: StoreTiming[];
  contact: StoreContact;
};
