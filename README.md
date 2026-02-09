
# Nhà Trọ Thái Thanh - Quản lý Cloud V2

Ứng dụng quản lý tính tiền phòng trọ, chốt số điện nước và xuất hóa đơn hình ảnh chuyên nghiệp dành riêng cho Nhà Trọ Thái Thanh.

## 🚀 Tính năng chính
- **Đồng bộ Đám mây (Firebase):** Dữ liệu được cập nhật tức thì giữa Máy tính và Điện thoại.
- **Quản lý linh hoạt:** Nhập chỉ số điện/nước, quản lý tiền phòng, tiền cọc, nợ cũ.
- **Chốt số tự động:** Cơ chế Rollover thông minh chuyển số Mới thành số Cũ và lưu lịch sử.
- **Xuất hóa đơn HD:** Chụp ảnh hóa đơn sắc nét (JPG HD) để gửi qua Zalo/Facebook.
- **Thống kê:** Biểu đồ tiêu thụ điện nước và cơ cấu doanh thu.
- **PWA:** Có thể cài đặt trực tiếp lên màn hình điện thoại như một ứng dụng thực thụ.

## 🛠 Hướng dẫn thiết lập Firebase
Để đồng bộ dữ liệu, bạn cần thực hiện:
1. Tạo dự án trên [Firebase Console](https://console.firebase.google.com/).
2. Tạo **Firestore Database**.
3. Trong phần **Rules**, dán đoạn mã sau:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /nha_tro_thai_thanh/main_data {
         allow read, write: if true;
       }
     }
   }
   ```
4. Copy mã cấu hình (Config) và dán vào phần **Cài đặt -> Thiết lập đám mây** trong ứng dụng.

## 💻 Công nghệ sử dụng
- React 19 (ESM)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- Firebase (Firestore)
- html2canvas (Export Images)

---
*Phát triển bởi Senior Engineer - Thái Thanh Tro Project.*
