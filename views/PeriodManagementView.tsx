
import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RotateCcw, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface Props {
  isLocked: boolean;
  onRollover: () => void;
  onReset: () => void;
  onUnlock: () => void;
}

const PeriodManagementView: React.FC<Props> = ({ isLocked, onRollover, onReset, onUnlock }) => {
  const [confirmState, setConfirmState] = useState<'rollover' | 'reset' | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setConfirmState(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startConfirm = (type: 'rollover' | 'reset') => {
    setConfirmState(type);
    setCountdown(5);
  };

  const handleAction = () => {
    if (confirmState === 'rollover') onRollover();
    if (confirmState === 'reset') onReset();
    setConfirmState(null);
    setCountdown(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Quản Lý Kỳ Thanh Toán</h2>
        <p className="text-slate-500">Chuyển sang tháng mới hoặc khôi phục dữ liệu cũ.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="bg-yellow-100 p-4 rounded-2xl">
            <ArrowLeftRight className="text-yellow-600" size={32} />
          </div>
          <h3 className="text-xl font-bold">Chốt & Chuyển Tháng</h3>
          <p className="text-sm text-slate-500">Chỉ số MỚI sẽ trở thành chỉ số CŨ. Chỉ số CŨ sẽ bị khóa để tránh nhầm lẫn.</p>
          
          {confirmState === 'rollover' ? (
            <button 
              onClick={handleAction}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              Xác Nhận ({countdown}s)
            </button>
          ) : (
            <button 
              onClick={() => startConfirm('rollover')}
              className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all"
            >
              Thực Hiện Ngay
            </button>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-2xl">
            <RotateCcw className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-bold">Hoàn Tác / Khôi Phục</h3>
          <p className="text-sm text-slate-500">Quay về trạng thái trước khi chốt sổ gần nhất. Dữ liệu tháng hiện tại sẽ bị ghi đè.</p>
          
          {confirmState === 'reset' ? (
            <button 
              onClick={handleAction}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              Xác Nhận ({countdown}s)
            </button>
          ) : (
            <button 
              onClick={() => startConfirm('reset')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Khôi Phục Gốc
            </button>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
        isLocked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      }`}>
        <div className={`p-3 rounded-full ${isLocked ? 'bg-red-100' : 'bg-green-100'}`}>
          {isLocked ? <ShieldAlert className="text-red-600" /> : <CheckCircle className="text-green-600" />}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800">Trạng thái: {isLocked ? 'Đã Chốt & Khóa' : 'Đang Mở'}</h4>
          <p className="text-sm text-slate-500">
            {isLocked 
              ? 'Chỉ số cũ đã bị khóa để an toàn. Bạn cần mở khóa nếu muốn sửa tay.' 
              : 'Dữ liệu chỉ số cũ có thể chỉnh sửa tự do.'}
          </p>
        </div>
        {isLocked && (
          <button 
            onClick={onUnlock}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50"
          >
            Mở Khóa
          </button>
        )}
      </div>
    </div>
  );
};

export default PeriodManagementView;
