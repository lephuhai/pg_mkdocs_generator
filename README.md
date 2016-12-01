# pg_mkdocs_generator
Postgres document generator from tables name and columns to Mkdocs

### Chức năng

1. Hỗ trợ tạo nhanh `Document` dạng markdown cho cơ sở sữ liệu `Postgres`.
2. Đọc cấu trúc dữ liệu bảng trên các `Schema`, cấu trúc các `columns` trên các bảng.

### Hướng dẫn sử dụng

+ Yêu cầu:
    
    * Cài đặc [mkdocs](http://www.mkdocs.org)
    
+ Sử dụng:
    
    * Cài đặt `node_modules`
    * Cấu hình kết nối cơ sở dữ liệu tại file `/config/database.js`
    * Tại thư mục của project, chạy file thực thi bằng lệnh `node app.js`
    
> Sau khi quá trình tạo `document` hoàn tất. Bạn có thể `cd` vào thư mục `/site/` và chạy 1 web server đơn giản bằng python như sau:
 
 ```bash
    python -m SimpleHTTPServer [PORT]
 ```
 
> Tiếp theo, truy cập vào địa chỉ: `localhost:[PORT]`