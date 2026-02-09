
import React, { useState } from 'react';
import { History, Search, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { formatCurrency, formatDate } from './format';
import InvoiceTemplate from './InvoiceTemplate';

interface Props {
  history: any[];
}

const HistoryView: React.FC<Props> = ({ history }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <History size={64} className="text-slate-200 mb-4" />
        <p className="text-slate-400 font-medium">Chưa có dữ liệu lịch sử nào được lưu.</p>
        <p className="text-xs text-slate-300">Dữ liệu sẽ xuất hiện sau khi bạn thực hiện "Chốt Sổ".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Lịch Sử Hóa Đơn</h2>
        <p className="text-slate-500">Xem lại các kỳ thanh toán đã chốt.</p>
      </div>

      <div className="space-y-4">
        {history.map((entry, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-xl">
                  <History className="text-slate-600" size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800">Kỳ: {formatDate(entry.period.fromDate)} - {formatDate(entry.period.toDate)}</div>
                  <div className="text-sm text-slate-500">Gồm {entry.data.length} hóa đơn phòng</div>
                </div>
              </div>
              {expandedIndex === idx ? <ChevronDown /> : <ChevronRight />}
            </button>

            {expandedIndex === idx && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-6">
                 <div className="flex flex-wrap gap-4">
                    {entry.roomsAtTime.map((room: any) => {
                       const roomData = entry.data.find((d: any) => d.roomId === room.id);
                       return (
                         <div key={room.id} className="scale-75 origin-top-left -mr-[212px] -mb-[212px]">
                           <InvoiceTemplate 
                            room={room}
                            data={roomData}
                            settings={entry.settingsAtTime}
                            period={entry.period}
                           />
                         </div>
                       );
                    })}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
