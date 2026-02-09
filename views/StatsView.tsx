
import React from 'react';
import { AppState } from '../types';
import { formatCurrency } from '../utils/format';
import { Zap, Droplets, Banknote, History as HistoryIcon, TrendingUp } from 'lucide-react';

interface Props {
  state: AppState;
}

const StatsView: React.FC<Props> = ({ state }) => {
  const { currentData, rooms, globalSettings } = state;

  const stats = currentData.reduce((acc, data) => {
    const room = rooms.find(r => r.id === data.roomId);
    if (!room) return acc;

    const eUsed = Math.max(0, data.newElectricity - data.oldElectricity);
    const wUsed = Math.max(0, data.newWater - data.oldWater);
    
    const eTotal = eUsed * globalSettings.electricityPrice;
    const wTotal = wUsed * globalSettings.waterPrice;
    const wifi = (room.hasWifiPhone ? globalSettings.wifiPhonePrice : 0) + (room.hasWifiTv ? globalSettings.wifiTvPrice : 0);
    
    const roomRevenue = room.baseRent + eTotal + wTotal + wifi + globalSettings.securityTrashPrice + data.debt;

    acc.totalElec += eUsed;
    acc.totalWater += wUsed;
    acc.totalDebt += data.debt;
    acc.totalRevenue += roomRevenue;
    acc.elecRevenue += eTotal;
    acc.waterRevenue += wTotal;
    acc.rentRevenue += room.baseRent;
    acc.otherRevenue += wifi + globalSettings.securityTrashPrice;

    return acc;
  }, { 
    totalElec: 0, totalWater: 0, totalDebt: 0, totalRevenue: 0, 
    elecRevenue: 0, waterRevenue: 0, rentRevenue: 0, otherRevenue: 0 
  });

  const maxElec = Math.max(...currentData.map(d => d.newElectricity - d.oldElectricity), 1);
  const maxWater = Math.max(...currentData.map(d => d.newWater - d.oldWater), 1);

  // Sorting logic for the charts
  const sortedByElec = [...currentData].sort((a, b) => {
    const aUsed = Math.max(0, a.newElectricity - a.oldElectricity);
    const bUsed = Math.max(0, b.newElectricity - b.oldElectricity);
    return bUsed - aUsed;
  });

  const sortedByWater = [...currentData].sort((a, b) => {
    const aUsed = Math.max(0, a.newWater - a.oldWater);
    const bUsed = Math.max(0, b.newWater - b.oldWater);
    return bUsed - aUsed;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tổng Quan Hệ Thống</h2>
          <p className="text-slate-500">Thống kê dữ liệu tiêu thụ và doanh thu dự kiến tháng này.</p>
        </div>
        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 shrink-0">
          <TrendingUp className="text-green-500 shrink-0" size={24} />
          <div className="flex flex-col">
            <span className="text-[0.6em] text-slate-400 uppercase font-black tracking-widest leading-none">Dự kiến thu</span>
            <span className="font-black text-slate-800 text-[1.2em]">{formatCurrency(stats.totalRevenue)} đ</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng Thu" value={formatCurrency(stats.totalRevenue)} icon={<Banknote size={24} className="text-green-600" />} color="bg-green-50 border-green-100" />
        <StatCard title="Tổng Điện" value={stats.totalElec.toString()} icon={<Zap size={24} className="text-yellow-600" />} color="bg-yellow-50 border-yellow-100" />
        <StatCard title="Tổng Nước" value={stats.totalWater.toString()} icon={<Droplets size={24} className="text-blue-600" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="Tổng Nợ Cũ" value={formatCurrency(stats.totalDebt)} icon={<HistoryIcon size={24} className="text-red-600" />} color="bg-red-50 border-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Electricity Chart - Sorted */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" /> Điện Tiêu Thụ Cao Nhất
            </h3>
            <span className="text-[0.6em] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase">KW</span>
          </div>
          <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {sortedByElec.map(d => {
              const used = Math.max(0, d.newElectricity - d.oldElectricity);
              const percentage = (used / maxElec) * 100;
              return (
                <div key={d.roomId} className="group">
                  <div className="flex justify-between text-[0.8em] font-bold text-slate-500 mb-1 group-hover:text-slate-800 transition-colors">
                    <span>Phòng {d.roomId}</span>
                    <span>{used} kw</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                      style={{ width: `${Math.max(2, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Water Chart - Sorted */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Droplets size={20} className="text-blue-500" /> Nước Tiêu Thụ Cao Nhất
            </h3>
            <span className="text-[0.6em] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase">M3</span>
          </div>
          <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {sortedByWater.map(d => {
              const used = Math.max(0, d.newWater - d.oldWater);
              const percentage = (used / maxWater) * 100;
              return (
                <div key={d.roomId} className="group">
                  <div className="flex justify-between text-[0.8em] font-bold text-slate-500 mb-1 group-hover:text-slate-800 transition-colors">
                    <span>Phòng {d.roomId}</span>
                    <span>{used} m3</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${Math.max(2, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8 border-l-4 border-indigo-500 pl-4 uppercase tracking-wider">Cơ Cấu Doanh Thu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <RevenueBit label="Tiền Phòng" amount={stats.rentRevenue} color="bg-indigo-500" total={stats.totalRevenue} />
           <RevenueBit label="Tiền Điện" amount={stats.elecRevenue} color="bg-yellow-500" total={stats.totalRevenue} />
           <RevenueBit label="Tiền Nước" amount={stats.waterRevenue} color="bg-blue-500" total={stats.totalRevenue} />
           <RevenueBit label="Dịch vụ khác" amount={stats.otherRevenue} color="bg-emerald-500" total={stats.totalRevenue} />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
  <div className={`${color} border p-6 rounded-3xl shadow-sm transition-transform hover:scale-[1.02] flex flex-col items-center text-center md:items-start md:text-left`}>
    <div className="p-3 bg-white/60 rounded-2xl mb-4 shadow-sm shrink-0">{icon}</div>
    <div className="text-[0.6em] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</div>
    <div className="text-[1.5em] font-black text-slate-800 leading-tight">{value}</div>
  </div>
);

const RevenueBit: React.FC<{ label: string, amount: number, color: string, total: number }> = ({ label, amount, color, total }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full shrink-0 ${color}`} />
      <span className="text-[0.8em] font-bold text-slate-600">{label}</span>
    </div>
    <div className="text-[1.2em] font-black text-slate-800">{formatCurrency(amount)} đ</div>
    <div className="text-[0.7em] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full w-fit">
      {((amount/total)*100).toFixed(1)}%
    </div>
  </div>
);

export default StatsView;
