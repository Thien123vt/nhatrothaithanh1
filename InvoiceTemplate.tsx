
import React from 'react';
import { RoomConfig, GlobalSettings, MonthlyData, BillingPeriod } from './types';
import { formatCurrency, formatDate } from './format';

interface InvoiceTemplateProps {
  room: RoomConfig;
  data: MonthlyData;
  settings: GlobalSettings;
  period: BillingPeriod;
  containerId?: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ room, data, settings, period, containerId }) => {
  const electricityUsed = Math.max(0, data.newElectricity - data.oldElectricity);
  const waterUsed = Math.max(0, data.newWater - data.oldWater);
  
  const electricityTotal = electricityUsed * settings.electricityPrice;
  const waterTotal = waterUsed * settings.waterPrice;
  const wifiPhoneTotal = room.hasWifiPhone ? settings.wifiPhonePrice : 0;
  const wifiTvTotal = room.hasWifiTv ? settings.wifiTvPrice : 0;
  
  const subTotal = room.baseRent + electricityTotal + waterTotal + wifiPhoneTotal + wifiTvTotal + settings.securityTrashPrice;
  const grandTotal = subTotal + data.debt;

  return (
    <div 
      id={containerId} 
      className="invoice-capture-container" 
      style={{ 
        width: '850px', 
        backgroundColor: '#ffffff',
        display: 'inline-block',
        margin: '0',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .inv-table {
          border-collapse: collapse;
          width: 850px;
          table-layout: fixed;
          background-color: white;
          color: #000;
          font-family: Arial, sans-serif;
          margin: 0;
        }
        .inv-td {
          border: 1px solid #d0d7e5;
          padding: 0 4px; 
          vertical-align: middle;
          font-size: 13pt;
          color: #000;
          line-height: 1.2;
          height: 38px;
          word-wrap: break-word;
          box-sizing: border-box;
          overflow: hidden;
        }
        .inv-b-all {
          border: 1px solid #000000 !important;
        }
        .inv-title {
          font-size: 24pt;
          font-weight: bold;
          text-align: center;
          border: none;
          padding: 15px 0;
          height: auto;
        }
        .inv-bg-yellow {
          background-color: #ffff00 !important;
          -webkit-print-color-adjust: exact;
        }
        .inv-text-center { text-align: center; }
        .inv-text-right { text-align: right; }
        .inv-bold { font-weight: bold; }
        
        .inv-room-info {
          font-size: 16pt;
          font-weight: bold;
          text-align: center;
          border: 1px solid #000 !important;
        }

        .inv-header-row .inv-td {
          background-color: #ffff00 !important;
          font-weight: bold;
          text-align: center;
          font-size: 11pt;
          border: 1px solid #000 !important;
          -webkit-print-color-adjust: exact;
        }
      `}</style>

      <table className="inv-table">
        <colgroup>
          <col style={{ width: '45px' }} />
          <col style={{ width: '200px' }} />
          <col style={{ width: '90px' }} />
          <col style={{ width: '90px' }} />
          <col style={{ width: '80px' }} />
          <col style={{ width: '65px' }} />
          <col style={{ width: '135px' }} />
          <col style={{ width: '145px' }} />
        </colgroup>

        <tbody>
          <tr>
            <td colSpan={8} className="inv-title">Nhà Trọ Thái Thanh</td>
          </tr>

          <tr>
            <td colSpan={3} className="inv-td">
              <span className="inv-bold">Từ &nbsp; ngày:</span> &nbsp; {formatDate(period.fromDate)}
            </td>
            <td colSpan={2} rowSpan={2} className="inv-td inv-room-info">
              Phòng số: {room.name}
            </td>
            <td colSpan={3} className="inv-td inv-bold">
              Tên người thuê: {room.tenantName}
            </td>
          </tr>

          <tr>
            <td colSpan={3} className="inv-td">
              <span className="inv-bold">Đến ngày:</span> &nbsp; {formatDate(period.toDate)}
            </td>
            <td colSpan={3} className="inv-td inv-bold">
              Tel : {room.phone}
            </td>
          </tr>

          <tr>
            <td className="inv-td"></td>
            <td className="inv-td"></td>
            <td className="inv-td"></td>
            <td className="inv-td"></td>
            <td className="inv-td"></td>
            <td colSpan={3} className="inv-td inv-bold">
              Đặt cọc - {formatCurrency(room.deposit)}
            </td>
          </tr>

          <tr className="inv-header-row">
            <td className="inv-td">TT</td>
            <td className="inv-td">DANH MỤC</td>
            <td className="inv-td">CHỈ SỐ<br/>MỚI</td>
            <td className="inv-td">CHỈ SỐ<br/>CŨ</td>
            <td className="inv-td">SL TIÊU<br/>THỤ</td>
            <td className="inv-td">ĐVT</td>
            <td className="inv-td">ĐƠN GIÁ</td>
            <td className="inv-td">THÀNH TIỀN</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">1</td>
            <td className="inv-td inv-b-all">Tiền phòng</td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all inv-text-center">1</td>
            <td className="inv-td inv-b-all inv-text-center">Tháng</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(room.baseRent)}</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(room.baseRent)}</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">2</td>
            <td className="inv-td inv-b-all">Điện</td>
            <td className="inv-td inv-b-all inv-text-center">{data.newElectricity}</td>
            <td className="inv-td inv-b-all inv-text-center">{data.oldElectricity}</td>
            <td className="inv-td inv-b-all inv-text-center">{electricityUsed}</td>
            <td className="inv-td inv-b-all inv-text-center">kw</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.electricityPrice)}</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(electricityTotal)}</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">3</td>
            <td className="inv-td inv-b-all">Nước</td>
            <td className="inv-td inv-b-all inv-text-center">{data.newWater}</td>
            <td className="inv-td inv-b-all inv-text-center">{data.oldWater}</td>
            <td className="inv-td inv-b-all inv-text-center">{waterUsed}</td>
            <td className="inv-td inv-b-all inv-text-center">m3</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.waterPrice)}</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(waterTotal)}</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">4</td>
            <td className="inv-td inv-b-all">Wifi - cho ĐT</td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all inv-text-center">{room.hasWifiPhone ? 1 : 0}</td>
            <td className="inv-td inv-b-all inv-text-center">cái</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.wifiPhonePrice)}</td>
            <td className="inv-td inv-b-all inv-text-right">{wifiPhoneTotal > 0 ? formatCurrency(wifiPhoneTotal) : '-'}</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">5</td>
            <td className="inv-td inv-b-all">Wifi - cho TV</td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all inv-text-center">{room.hasWifiTv ? 1 : 0}</td>
            <td className="inv-td inv-b-all inv-text-center">cái</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.wifiTvPrice)}</td>
            {/* Sửa lỗi wifiTvTvTotal thành wifiTvTotal tại đây */}
            <td className="inv-td inv-b-all inv-text-right">{wifiTvTotal > 0 ? formatCurrency(wifiTvTotal) : '-'}</td>
          </tr>

          <tr>
            <td className="inv-td inv-b-all inv-text-center">6</td>
            <td className="inv-td inv-b-all">AN-rác</td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all"></td>
            <td className="inv-td inv-b-all inv-text-center">1</td>
            <td className="inv-td inv-b-all inv-text-center">tháng</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.securityTrashPrice)}</td>
            <td className="inv-td inv-b-all inv-text-right">{formatCurrency(settings.securityTrashPrice)}</td>
          </tr>

          <tr>
            <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
            <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
            <td className="inv-td inv-b-all inv-bold inv-text-center inv-bg-yellow">Tổng cộng</td>
            <td className="inv-td inv-b-all inv-bold inv-text-right">{formatCurrency(subTotal)}</td>
          </tr>

          {data.debt > 0 && (
            <>
              <tr>
                <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
                <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
                <td className="inv-td inv-b-all inv-bold inv-text-center inv-bg-yellow">Nợ</td>
                <td className="inv-td inv-b-all inv-bold inv-text-right">{formatCurrency(data.debt)}</td>
              </tr>
              <tr>
                <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
                <td className="inv-td"></td><td className="inv-td"></td><td className="inv-td"></td>
                <td className="inv-td inv-b-all inv-bold inv-text-center inv-bg-yellow">Tổng cộng</td>
                <td className="inv-td inv-b-all inv-bold inv-text-right">{formatCurrency(grandTotal)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTemplate;
