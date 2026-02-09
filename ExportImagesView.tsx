
import React, { useState } from 'react';
import { AppState } from './types';
import InvoiceTemplate from './InvoiceTemplate';
import { Download, Camera, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  state: AppState;
}

const ExportImagesView: React.FC<Props> = ({ state }) => {
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);

  const captureElement = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 850,
        height: element.offsetHeight,
        windowWidth: 1200,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById(elementId);
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = 'none';
            el.style.transform = 'none';
            el.style.margin = '0';
          }
        }
      });
      
      const link = document.createElement('a');
      const jpgFileName = fileName.replace('.png', '.jpg');
      link.download = jpgFileName;
      link.href = canvas.toDataURL('image/jpeg', 1.0); 
      link.click();
    } catch (error) {
      console.error(`Lỗi khi chụp ${elementId}`, error);
    }
  };

  const handleCaptureAll = async () => {
    setCapturing(true);
    setProgress(0);

    const sortedRooms = [...state.rooms].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (let i = 0; i < sortedRooms.length; i++) {
      const room = sortedRooms[i];
      const fileName = `HoaDon_Phong${room.name}_${state.billingPeriod.toDate}.jpg`;
      await captureElement(`invoice-${room.id}`, fileName);
      setProgress(Math.round(((i + 1) / sortedRooms.length) * 100));
      await new Promise(r => setTimeout(r, 400));
    }

    setCapturing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Xuất Hóa Đơn HD</h2>
          <p className="text-slate-500">Ảnh xuất ra định dạng JPG siêu nét, cắt sát viền bảng.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={handleCaptureAll}
            disabled={capturing}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-2xl font-black hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-[0_10px_20px_-5px_rgba(250,204,21,0.4)] active:scale-95"
          >
            {capturing ? (
              <><Loader2 className="animate-spin" /> {progress}%</>
            ) : (
              <><Camera size={20} /> XUẤT TẤT CẢ JPG HD</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 justify-items-center bg-slate-100 p-8 rounded-[40px] border-4 border-dashed border-slate-200 overflow-x-auto">
        {state.rooms.map((room) => {
          const roomData = state.currentData.find(d => d.roomId === room.id)!;
          return (
            <div key={room.id} className="relative group bg-white shadow-2xl p-0 transition-transform hover:scale-[1.01]">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button 
                  title="Tải ảnh JPG này"
                  onClick={() => captureElement(`invoice-${room.id}`, `HoaDon_Phong${room.name}.jpg`)}
                  className="bg-yellow-400 p-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-all text-yellow-900"
                >
                  <Download size={20}/>
                </button>
              </div>
              
              <InvoiceTemplate 
                containerId={`invoice-${room.id}`}
                room={room}
                data={roomData}
                settings={state.globalSettings}
                period={state.billingPeriod}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExportImagesView;
