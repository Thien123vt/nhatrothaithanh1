
import { AppState, GlobalSettings, RoomConfig, MonthlyData } from './types';

export const ROOM_IDS = [
  'KIOT-A', '1A', '2A', '3A', '4A', '5A', '6A',
  'KIOT', '1', '2', '3', '4', '5', '6'
];

export const INITIAL_SETTINGS: GlobalSettings = {
  electricityPrice: 3500,
  waterPrice: 14000,
  wifiPhonePrice: 30000,
  wifiTvPrice: 70000,
  securityTrashPrice: 40000
};

const DEFAULT_ROOM_RENT = 1100000;
const KIOT_RENT = 2200000;

export const INITIAL_ROOMS: RoomConfig[] = ROOM_IDS.map(id => ({
  id,
  name: id,
  tenantName: id === '2A' ? 'Anh Đệ' : (id === '5' ? 'HỮU DƯ + TUYẾT ANH' : ''),
  baseRent: id.includes('KIOT') ? KIOT_RENT : DEFAULT_ROOM_RENT,
  deposit: id.includes('KIOT') ? 1000000 : 500000,
  hasWifiPhone: ['1A', '5A', '1', '5', '6'].includes(id),
  hasWifiTv: id === '1',
  phone: ''
}));

// Mock data from user's image
const MOCK_READINGS: Record<string, { ne: number, oe: number, nw: number, ow: number, debt: number }> = {
  'KIOT-A': { ne: 12413, oe: 12257, nw: 1170, ow: 1167, debt: 646000 },
  '1A': { ne: 7563, oe: 7503, nw: 476, ow: 474, debt: 0 },
  '2A': { ne: 6132, oe: 5912, nw: 399, ow: 392, debt: 1095000 },
  '3A': { ne: 0, oe: 0, nw: 0, ow: 0, debt: 0 },
  '4A': { ne: 4305, oe: 4266, nw: 396, ow: 388, debt: 0 },
  '5A': { ne: 9465, oe: 9371, nw: 514, ow: 508, debt: 0 },
  '6A': { ne: 10756, oe: 10734, nw: 822, ow: 817, debt: 0 },
  'KIOT': { ne: 22519, oe: 22330, nw: 1166, ow: 1160, debt: 0 },
  '1': { ne: 15414, oe: 15140, nw: 881, ow: 868, debt: 0 },
  '2': { ne: 12359, oe: 12359, nw: 1062, ow: 1062, debt: 0 },
  '3': { ne: 9301, oe: 9141, nw: 505, ow: 499, debt: 0 },
  '4': { ne: 11388, oe: 11226, nw: 370, ow: 364, debt: 0 },
  '5': { ne: 7977, oe: 7917, nw: 516, ow: 511, debt: 0 },
  '6': { ne: 6939, oe: 6834, nw: 760, ow: 750, debt: 0 },
};

export const INITIAL_MONTHLY_DATA: MonthlyData[] = ROOM_IDS.map(id => ({
  roomId: id,
  oldElectricity: MOCK_READINGS[id]?.oe || 0,
  newElectricity: MOCK_READINGS[id]?.ne || 0,
  oldWater: MOCK_READINGS[id]?.ow || 0,
  newWater: MOCK_READINGS[id]?.nw || 0,
  debt: MOCK_READINGS[id]?.debt || 0
}));
