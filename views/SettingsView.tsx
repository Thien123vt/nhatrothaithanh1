
import React, { useRef, useState } from 'react';
import { GlobalSettings, RoomConfig, AppState } from '../types';
import { Zap, Droplets, Wifi, Tv, ShieldCheck, Type, Download, Upload, Database, Cloud, Key, Copy, Check } from 'lucide-react';

interface Props {
  settings: GlobalSettings;
  rooms: RoomConfig[];
  uiFontSize: number;
  fullState: AppState;
  cloudConfig: any;
  onSettingsChange: (s: GlobalSettings) => void;
  onRoomsChange: (r: RoomConfig[]) => void;
  onFontSizeChange: (size: number) => void;
  onRestoreState: (state: AppState) => void;
  onCloudConfigSave: (config: any) => void;
}

const SettingsView: React.FC<Props> = ({ 
  settings, rooms, uiFontSize, fullState, cloudConfig,
  onSettingsChange, onRoomsChange, onFontSizeChange, onRestoreState, onCloudConfigSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempConfig, setTempConfig] = useState(cloudConfig ? JSON.stringify(cloudConfig, null, 2) : '');
  const [copied, setCopied] = useState(false);

  const handleSettingsChange = (field: keyof GlobalSettings, value: string) => {
    onSettingsChange({ ...settings, [field]: parseInt(value, 10) || 0 });
  };

  const handleRoomChange = (roomId: string, field: keyof RoomConfig, value: any) => {
    const updated = rooms.map(r => r.id === roomId ? { ...r, [field]: value } : r);
    onRoomsChange(updated);
  };

  const saveCloudConfig = () => {
    try {
      const parsed = JSON.parse(tempConfig);
      if (!parsed.apiKey || !parsed.projectId) throw new Error();
      onCloudConfigSave(parsed);
      alert("Đã lưu cấu hình Đám mây! Ứng dụng sẽ khởi động lại.");
    } catch (e) {
      alert("Lỗi: Định dạng JSON không hợp lệ hoặc thiếu thông tin quan trọng (apiKey, projectId).");
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(tempConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Cloud Config Section - GIẢI PHÁP TỰ ĐỘNG */}
      <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Cloud size={120} className="text-indigo-600" />
        </div>
        
        <div className="mb-6 relative z-10">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Cloud size={28} className="text-indigo-600" /> Thiết Lập Đám Mây Tự Động
          </h2>
          <p className="text-slate-500 max-w-xl">Dán mã <strong>Firebase Config</strong> của bạn vào đây để đồng bộ Máy tính & Điện thoại mà không cần làm thủ công.</p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="relative">
            <textarea 
              value={tempConfig}
              onChange={(e) => setTempConfig(e.target.value)}
              placeholder='Dán đoạn mã { "apiKey": "...", ... } vào đây'
              className="w-full h-40 bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-4 border-slate-800 shadow-inner"
            />
            <button 
                onClick={handleCopyConfig}
                className="absolute top-3 right-3 p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors"
                title="Sao chép"
            >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <button 
                onClick={saveCloudConfig}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
                <Key size={20} /> KẾT NỐI ĐÁM MÂY
            </button>
            <button 
                onClick={() => { setTempConfig(''); onCloudConfigSave(null); }}
                className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
                Ngắt kết nối
            </button>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[0.85em] text-amber-800 space-y-2">
            <p><strong>Lưu ý quan trọng để không bị lỗi:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
                <li>Truy cập Firebase Console -> Project Settings để lấy mã Config này.</li>
                <li>Trên Firebase, mục <strong>Firestore Database -> Rules</strong>, bạn phải sửa <code>allow read, write: if false;</code> thành <code>allow read, write: if true;</code> để được phép lưu dữ liệu.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Manual Backup Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database size={24} className="text-slate-600" /> Sao Lưu Thủ Công (File)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => {
              const dataStr = JSON.stringify(fullState, null, 2);
              const link = document.createElement('a');
              link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
              link.download = `Backup_NhaTro_${new Date().toLocaleDateString('vi-VN')}.json`;
              link.click();
          }} className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 hover:bg-slate-50 transition-all group">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform"><Download size={24} /></div>
            <div className="text-left">
                <div className="font-bold">Xuất File Dự Phòng</div>
                <div className="text-xs text-slate-400">Lưu dữ liệu vào máy</div>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 hover:bg-slate-50 transition-all group">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Upload size={24} /></div>
            <div className="text-left">
                <div className="font-bold">Nhập File Dữ Liệu</div>
                <div className="text-xs text-slate-400">Khôi phục từ file có sẵn</div>
            </div>
            <input type="file" ref={fileInputRef} hidden accept=".json" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        const json = JSON.parse(ev.target?.result as string);
                        if(confirm("Ghi đè dữ liệu hiện tại?")) onRestoreState(json);
                    } catch(e) { alert("Lỗi định dạng!"); }
                };
                r.readAsText(file);
            }} />
          </button>
        </div>
      </section>

      {/* 3. Global UI Font Size */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Type size={24}/> Cỡ Chữ Hệ Thống</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Nhỏ</span>
            <input type="range" min="12" max="24" step="1" value={uiFontSize} onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <span className="text-xs font-bold text-slate-400 uppercase">Lớn ({uiFontSize}px)</span>
          </div>
        </div>
      </section>

      {/* 4. Global Prices */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Cài Đặt Đơn Giá</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <PriceInput label="Điện (kw)" value={settings.electricityPrice} onChange={(v) => handleSettingsChange('electricityPrice', v)} icon={<Zap size={18} className="text-yellow-500" />} />
          <PriceInput label="Nước (m3)" value={settings.waterPrice} onChange={(v) => handleSettingsChange('waterPrice', v)} icon={<Droplets size={18} className="text-blue-500" />} />
          <PriceInput label="Wifi ĐT" value={settings.wifiPhonePrice} onChange={(v) => handleSettingsChange('wifiPhonePrice', v)} icon={<Wifi size={18} className="text-indigo-500" />} />
          <PriceInput label="Wifi TV" value={settings.wifiTvPrice} onChange={(v) => handleSettingsChange('wifiTvPrice', v)} icon={<Tv size={18} className="text-purple-500" />} />
          <PriceInput label="AN - Rác" value={settings.securityTrashPrice} onChange={(v) => handleSettingsChange('securityTrashPrice', v)} icon={<ShieldCheck size={18} className="text-green-500" />} />
        </div>
      </section>
      
      {/* 5. Room Management Table */}
      <section>
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Danh Sách Phòng</h2>
        </div>
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase text-slate-400">
                <th className="p-6">Phòng</th>
                <th className="p-6">Người Thuê</th>
                <th className="p-6">Tiền Phòng / Cọc</th>
                <th className="p-6 text-center">Tiện Ích</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-black text-slate-800 text-lg">{room.name}</td>
                  <td className="p-6">
                    <input type="text" value={room.tenantName} onChange={(e) => handleRoomChange(room.id, 'tenantName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Tên khách..." />
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                        <input type="number" value={room.baseRent} onChange={(e) => handleRoomChange(room.id, 'baseRent', parseInt(e.target.value, 10))} className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
                        <input type="number" value={room.deposit} onChange={(e) => handleRoomChange(room.id, 'deposit', parseInt(e.target.value, 10))} className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-400" />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-4">
                        <label className="flex flex-col items-center gap-1 cursor-pointer">
                            <input type="checkbox" checked={room.hasWifiPhone} onChange={(e) => handleRoomChange(room.id, 'hasWifiPhone', e.target.checked)} className="w-5 h-5 accent-indigo-600" />
                            <span className="text-[10px] font-bold text-slate-400">ĐT</span>
                        </label>
                        <label className="flex flex-col items-center gap-1 cursor-pointer">
                            <input type="checkbox" checked={room.hasWifiTv} onChange={(e) => handleRoomChange(room.id, 'hasWifiTv', e.target.checked)} className="w-5 h-5 accent-indigo-600" />
                            <span className="text-[10px] font-bold text-slate-400">TV</span>
                        </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const PriceInput: React.FC<{ label: string, value: number, onChange: (v: string) => void, icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
    <div className="flex items-center gap-2 mb-3">
      <span className="p-2 bg-slate-50 rounded-xl">{icon}</span>
      <span className="text-[0.65em] font-black text-slate-400 uppercase tracking-wider truncate">{label}</span>
    </div>
    <div className="relative">
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full py-1 text-xl font-black text-slate-800 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-all" />
      <span className="absolute right-0 bottom-2 text-slate-300 font-bold text-xs uppercase">đ</span>
    </div>
  </div>
);

export default SettingsView;
