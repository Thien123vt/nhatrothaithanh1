
export interface GlobalSettings {
  electricityPrice: number;
  waterPrice: number;
  wifiPhonePrice: number;
  wifiTvPrice: number;
  securityTrashPrice: number;
}

export interface RoomConfig {
  id: string;
  name: string;
  tenantName: string;
  baseRent: number;
  deposit: number;
  hasWifiPhone: boolean;
  hasWifiTv: boolean;
  phone: string;
}

export interface MonthlyData {
  roomId: string;
  oldElectricity: number;
  newElectricity: number;
  oldWater: number;
  newWater: number;
  debt: number;
}

export interface BillingPeriod {
  fromDate: string;
  toDate: string;
}

export interface AppState {
  globalSettings: GlobalSettings;
  rooms: RoomConfig[];
  currentData: MonthlyData[];
  billingPeriod: BillingPeriod;
  isLocked: boolean;
  uiFontSize: number;
  history: {
    period: BillingPeriod;
    data: MonthlyData[];
    settingsAtTime: GlobalSettings;
    roomsAtTime: RoomConfig[];
  }[];
}
