import React, { useState, useEffect, useRef } from 'react';
import { AppState, GlobalSettings, RoomConfig, MonthlyData, BillingPeriod } from './types';
import { INITIAL_SETTINGS, INITIAL_ROOMS, INITIAL_MONTHLY_DATA } from './constants';
import { Home, Settings, Lock, History, Image as ImageIcon, Save, BarChart3, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";

// Import trực tiếp từ thư mục gốc
import InputDataView from './InputDataView';
import SettingsView from './SettingsView';
import PeriodManagementView from './PeriodManagementView';
import HistoryView from './HistoryView';
import ExportImagesView from './ExportImagesView';
import StatsView from './StatsView';

const LOCAL_STORAGE_KEY = 'thai_thanh_tro_v2_state';
const CLOUD_CONFIG_KEY = 'thai_thanh_cloud_config';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      globalSettings: INITIAL_SETTINGS,
      rooms: INITIAL_ROOMS,
      currentData: INITIAL_MONTHLY_DATA,
      billingPeriod: { fromDate: '2026-02-10', toDate: '2026-03-10' },
      isLocked: false,
      uiFontSize: 16,
      history: []
    };
  });

  const [activeTab, setActiveTab] = useState<'input' | 'settings' | 'lock' | 'history' | 'export' | 'stats'>('input');
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'online' | 'offline' | 'error' | 'unconfigured'>('unconfigured');
  const [cloudConfig, setCloudConfig] = useState<any>(() => {
    const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const firestoreRef = useRef<Firestore | null>(null);
  const isUpdatingFromCloud = useRef(false);

  useEffect(() => {
    if (!cloudConfig || !cloudConfig.apiKey || cloudConfig.apiKey === "YOUR_API_KEY") {
      setSyncStatus('unconfigured');
      return;
    }

    try {
      let app: FirebaseApp;
      if (getApps().length > 0) {
        app = getApp();
      } else {
        app = initializeApp(cloudConfig);
      }
      const db = getFirestore(app);
      firestoreRef.current = db;

      setSyncStatus('syncing');
      
      const unsub = onSnapshot(doc(db, "nha_tro_thai_thanh", "main_data"), (docSnap) => {
        if (docSnap.exists()) {
          isUpdatingFromCloud.current = true;
          const cloudData = docSnap.data() as AppState;
          setState(cloudData);
          setSyncStatus('online');
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 500);
        } else {
          saveToCloud(state);
        }
      }, (error) => {
        console.error("Firebase Error:", error);
        setSyncStatus('error');
      });

      return () => unsub();
    } catch (e) {
      setSyncStatus('error');
    }
  }, [cloudConfig]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    if (syncStatus === 'online' && !isUpdatingFromCloud.current) {
      saveToCloud(state);
    }
  }, [state]);

  const saveToCloud = async (newState: AppState) => {
    if (!firestoreRef.current) return;
    setSyncStatus('syncing');
    try {
      await setDoc(doc(firestoreRef.current, "nha_tro_thai_thanh", "main_data"), newState);
      setSyncStatus('online');
    } catch (e) {
      setSyncStatus('error');
    }
  };

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => updater(prev));
  };

  const handleRollover = () => {
    updateState(prev => {
      const historyEntry = {
        period: { ...prev.billingPeriod },
        data: [...prev.currentData],
        settingsAtTime: { ...prev.globalSettings },
        roomsAtTime: [...prev.rooms]
      };
      
      const newData = prev.currentData.map(roomData => ({
        ...roomData,
        oldElectricity: roomData.newElectricity,
        oldWater: roomData.newWater,
        newElectricity: 0,
        newWater: 0,
        debt: 0
      }));

      const nextFromDate = prev.billingPeriod.toDate;
      const nextToDateObj = new Date(nextFromDate);
      nextToDateObj.setMonth(nextToDateObj.getMonth() + 1);
      const nextToDate = nextToDateObj.toISOString().split('T')[0];

      return {
        ...prev,
        history: [historyEntry, ...prev.history],
        currentData: newData,
        billingPeriod: { fromDate: nextFromDate, toDate: nextToDate },
        isLocked: true
      };
    });
    alert("Đã chốt sổ thành công!");
    setActiveTab('input');
  };

  const handleResetPeriod = () => {
    if (state.history.length === 0) {
      alert("Không có lịch sử để khôi phục!");
      return;
    }
    updateState(prev => {
      const last = prev.history[0];
      return {
        ...prev,
        billingPeriod: last.period,
        currentData: last.data,
        globalSettings: last.settingsAtTime,
        rooms: last.roomsAtTime,
        history: prev.history.slice(1),
        isLocked: false
      };
    });
    alert("Đã khôi phục dữ liệu kỳ trước!");
    setActiveTab('input');
  };

  const handleCloudConfigSave = (config: any) => {
    setCloudConfig(config);
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
    if (config) {
        window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50" style={{ fontSize: `${state.uiFontSize}px` }}>
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-4 sticky top-0 z-20 shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-lg shrink-0"><Home className="text-white" size={24} /></div>
            <h1 className="text-xl font-bold text-slate-800 truncate">Thái Thanh</h1>
          </div>
          <div className="flex items-center gap-2">
             {syncStatus === 'syncing' && <RefreshCw className="animate-spin text-blue-500" size={18} />}
             {syncStatus === 'online' && <span title="Đã kết nối"><Cloud className="text-green-500" size={18} /></span>}
             {syncStatus === 'error' && <span title="Lỗi"><AlertCircle className="text-red-500" size={18} /></span>}
             {syncStatus === 'unconfigured' && <span title="Ngoại tuyến"><CloudOff className="text-slate-300" size={18} /></span>}
          </div>
        </div>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          <NavItem active={activeTab === 'input'} onClick={() => setActiveTab('input')} icon={<Save size={20}/>} label="Nhập Liệu" />
          <NavItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={20}/>} label="Thống Kê" />
          <NavItem active={activeTab === 'lock'} onClick={() => setActiveTab('lock')} icon={<Lock size={20}/>} label="Chốt Sổ" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Cài Đặt" />
          <NavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={20}/>} label="Lịch Sử" />
          <NavItem active={activeTab === 'export'} onClick={() => setActiveTab('export')} icon={<ImageIcon size={20}/>} label="Xuất Ảnh" />
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'input' && <InputDataView state={state} onDataChange={(d) => updateState(p => ({...p, currentData: d}))} onPeriodChange={(p) => updateState(prev => ({...prev, billingPeriod: p}))} />}
          {activeTab === 'stats' && <StatsView state={state} />}
          {activeTab === 'settings' && <SettingsView settings={state.globalSettings} rooms={state.rooms} uiFontSize={state.uiFontSize} fullState={state} cloudConfig={cloudConfig} onSettingsChange={(s) => updateState(p => ({...p, globalSettings: s}))} onRoomsChange={(r) => updateState(p => ({...p, rooms: r}))} onFontSizeChange={(s) => updateState(p => ({...p, uiFontSize: s}))} onRestoreState={(s) => setState(s)} onCloudConfigSave={handleCloudConfigSave} />}
          {activeTab === 'lock' && <PeriodManagementView isLocked={state.isLocked} onRollover={handleRollover} onReset={handleResetPeriod} onUnlock={() => updateState(p => ({...p, isLocked: false}))} />}
          {activeTab === 'history' && <HistoryView history={state.history} />}
          {activeTab === 'export' && <ExportImagesView state={state} />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${active ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span>{icon}</span>
    <span className="text-[0.9em]">{label}</span>
  </button>
);

export default App;