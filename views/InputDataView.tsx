
import React, { useState } from 'react';
import { AppState, MonthlyData, BillingPeriod } from '../types';
import { Zap, Droplets, CreditCard, Save, CheckCircle } from 'lucide-react';

interface Props {
  state: AppState;
  onDataChange: (data: MonthlyData[]) => void;
  onPeriodChange: (period: BillingPeriod) => void;
}

const InputDataView: React.FC<Props> = ({ state, onDataChange, onPeriodChange }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleChange = (roomId: string, field: keyof MonthlyData, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const newData = state.currentData.map(d => 
      d.roomId === roomId ? { ...d, [field]: numValue } : d
    );
    onDataChange(newData);
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handlePeriodChange = (field: keyof BillingPeriod, value: string) => {
    onPeriodChange({ ...state.billingPeriod, [field]: value });
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800">Nhập Dữ Liệu Tháng Này</h2>
          <p className="text-slate-500">Nhập chỉ số mới (Mới ← Cũ) và tiền nợ nếu có.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Từ ngày</label>
              <input 
                type="date" 
                value={state.billingPeriod.fromDate}
                onChange={(e) => handlePeriodChange('fromDate', e.target.value)}
                className="bg-transparent rounded-lg px-2 py-1 text-sm outline-none font-medium"
              />
            </div>
            <div className="text-slate-300">|</div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Đến ngày</label>
              <input 
                type="date" 
                value={state.billingPeriod.toDate}
                onChange={(e) => handlePeriodChange('toDate', e.target.value)}
                className="bg-transparent rounded-lg px-2 py-1 text-sm outline-none font-medium"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
              saveStatus === 'saved' 
                ? 'bg-green-500 text-white' 
                : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
            }`}
          >
            {saveStatus === 'saved' ? <CheckCircle size={20} /> : <Save size={20} />}
            {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? 'Đã lưu' : 'Lưu dữ liệu'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Phòng</th>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-500"/> Điện (Mới ← Cũ)</div>
              </th>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2"><Droplets size={16} className="text-blue-500"/> Nước (Mới ← Cũ)</div>
              </th>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2"><CreditCard size={16} className="text-red-500"/> Nợ</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {state.rooms.map((room) => {
              const data = state.currentData.find(d => d.roomId === room.id)!;
              return (
                <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{room.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={data.newElectricity}
                        onChange={(e) => handleChange(room.id, 'newElectricity', e.target.value)}
                        className="w-20 md:w-28 border border-slate-200 rounded-lg px-2 py-2 text-md outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100 font-bold text-slate-900 bg-yellow-50/30"
                        placeholder="Mới"
                      />
                      <span className="text-slate-400">←</span>
                      <input 
                        type="number" 
                        disabled={state.isLocked}
                        value={data.oldElectricity}
                        onChange={(e) => handleChange(room.id, 'oldElectricity', e.target.value)}
                        className={`w-20 md:w-24 border ${state.isLocked ? 'bg-slate-100 border-slate-100 text-slate-400' : 'border-slate-200'} rounded-lg px-2 py-1 text-sm outline-none`}
                        placeholder="Cũ"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={data.newWater}
                        onChange={(e) => handleChange(room.id, 'newWater', e.target.value)}
                        className="w-20 md:w-28 border border-slate-200 rounded-lg px-2 py-2 text-md outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100 font-bold text-slate-900 bg-yellow-50/30"
                        placeholder="Mới"
                      />
                      <span className="text-slate-400">←</span>
                      <input 
                        type="number" 
                        disabled={state.isLocked}
                        value={data.oldWater}
                        onChange={(e) => handleChange(room.id, 'oldWater', e.target.value)}
                        className={`w-20 md:w-24 border ${state.isLocked ? 'bg-slate-100 border-slate-100 text-slate-400' : 'border-slate-200'} rounded-lg px-2 py-1 text-sm outline-none`}
                        placeholder="Cũ"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <input 
                      type="number" 
                      value={data.debt}
                      onChange={(e) => handleChange(room.id, 'debt', e.target.value)}
                      className="w-full max-w-[140px] border border-slate-200 rounded-lg px-2 py-2 text-md outline-none focus:border-red-400 focus:ring-1 focus:ring-red-50 text-red-600 font-bold"
                      placeholder="0"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InputDataView;
