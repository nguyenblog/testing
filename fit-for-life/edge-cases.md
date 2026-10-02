# Fit For Life — edge case khi xếp lịch (ghi 2026-09-25, bàn tiếp buổi sau)

> Tớ tự liệt kê từ kinh nghiệm chung, **chưa hỏi chị quản lý**. Đối chiếu với `xep-ca.html`:
> ✓ đã có · ◐ có một phần · ✗ chưa có.

## Câu cần hỏi chị quản lý (xếp theo mức ảnh hưởng)

| # | Câu hỏi | Trả lời |
|---|---|---|
| 1 | Pilates có **giới hạn máy (Reformer) hoặc phòng** không? Có **lớp nhóm hoặc tập cặp** (2 người 1 PT) không? | |
| 2 | Khách có muốn **lịch cố định hằng tuần** không, hay tuần nào cũng điền form? | |
| 3 | Khách **không điền form** trước hạn thì làm gì? (giữ lịch tuần trước, bỏ qua, hay CS gọi) | |
| 4 | **Gói hết giữa tuần** hoặc còn ít buổi hơn số khách đăng ký thì sao? | |
| 5 | Có cần **chia ca đều giữa các PT** không? Full-time có **số ca tối thiểu**, part-time có **trần giờ** không? | |
| 6 | **Buổi bù** khi PT hoặc studio huỷ: bù tuần nào? Buổi còn nợ có chuyển sang tuần sau không? | |
| 7 | Ca có **luôn đúng 1 tiếng** không? Có ca 45 hoặc 90 phút, hay ca bắt đầu 8h30 không? | |
| 8 | Khách có yêu cầu **PT theo giới tính hoặc chuyên môn** (chấn thương, bầu, sau sinh) không? | |

Còn 2 câu từ trước, cậu chưa xác nhận:
- Có bỏ luật "PT không dạy 2 ngày liền" khi máy tự xếp không? (bản demo đang bỏ)
- Có gộp `xep-ca.html` vào `mockup.html` không?

## Quy ước tạm (chưa có xác nhận của chị quản lý)

| Ngày | Quy ước | Nguồn |
|---|---|---|
| 2026-10-02 | Giờ mở cửa **6h–21h** (ca 1 tiếng → 15 ca/ngày, ca cuối bắt đầu 20h; lưới 7 × 15 = 105 ô). `xep-ca.html` và 2 trang giải thích vẫn đang 8h–18h, chưa đổi. | User chốt tạm, dựa trên "3.2 Tiêu chí phụ" mục 7 (khách tập 6–10h và 17–21h) |
| 2026-10-02 | Lớp nhóm (1-2, 1-4) là **lớp ghép**: máy ghép các khách cùng giờ vào 1 lớp, không cần nhóm cố định. | User chốt tạm |
| 2026-10-02 | **Chuyên môn là bộ lọc đầu tiên nhưng mềm**: thử PT đúng chuyên môn trước, không có thì lấy PT khác. | User chốt tạm |
| 2026-10-02 | **1 lớp 1-4 tính là 1 ca** khi đếm ca của PT. | User chốt tạm |
| 2026-10-02 | **PT khách muốn thắng tỉ lệ ca** khi hai bên xung đột (chiều khách trước). | User chốt tạm, khớp thứ tự ở mục 3.1 của FFL |
| 2026-10-02 | Nghỉ sau chuỗi ca liên tục: **đề xuất của tớ, chưa ai duyệt** — mỗi PT có số ca liên tục tối đa (mặc định 3), sau đó nghỉ ít nhất 1 ca. Khoảng trống trong ngày ≤ 2 ca là nghỉ tại chỗ; dài hơn là ca gãy và phải ≥ mức PT khai (mặc định 4h). | Chị quản lý chưa có rule, user nhờ đề xuất |

## Tiêu chí FFL gửi (2026-10-02)

**3.1 Tiêu chí cứng, theo thứ tự ưu tiên:** (1) môn tập; (2) PT được học viên lựa chọn; (3) nếu khách không chọn PT: theo phân loại PT (chuyên môn, full-time, part-time, số ca tổng...), thứ tự linh hoạt vì nhân sự chưa ổn định, đẩy hết sang tiêu chí phụ; (4) nếu khách có chọn PT: khung giờ PT trùng hoàn toàn với yêu cầu.

**3.2 Tiêu chí phụ (phần lớn là tham số riêng từng PT):** (1) chuyên môn, lấy vấn đề của khách từ CRM theo mã KH; (2) tỉ lệ ca giữa các PT cùng môn theo deal lương, ví dụ min 50 và min 80 thì chia 5:8; (3) loại lớp 1-1 / 1-2 / 1-4, mỗi PT chuyên một loại; (4) min/max ca mỗi tháng; (5) max ca mỗi ngày; (6) số ca liên tục tối đa; (7) ca gãy: nghỉ giữa 2 khung tối thiểu 3h/4h/6h tuỳ PT, PT tự quyết.

**User chốt tạm thêm cùng ngày:**
- PT khách chọn chỉ rảnh một phần số buổi: xem ca đang chiếm ô của PT đó có phải do khách khác chọn đích danh không. Không phải thì hoán đổi; phải thì đẩy sang PT khác và báo CS.
- Demo chỉ làm lớp 1-1 và 1-2, chưa mở 1-4.
- Loại lớp lấy từ gói tập (khách chốt gói trước khi tập).
- Tỉ lệ ca tính trên **ca đã xếp** (dễ giải thích với PT theo plan tuần); phát sinh tính sau.

- Ba nguyên tắc cho máy v2: ca nào cũng ghi rõ xếp theo rule nào và chỗ nào thiếu rule; edge case thì gán tạm rồi báo CS chốt; rule bật/tắt theo từng lần xếp.
- Lớp 1-2 có 1 khách vẫn mở; xếp xong chưa ai ghép thì báo CS. PT chuyên 1-1 dạy 1-2 được nhưng là phương án cuối.

**Bản thiết kế gom tất cả:** `may-xep-ca-v2-thiet-ke.md` (đọc file đó trước khi dựng máy v2). Câu còn mở nằm ở cuối file đó.

**Câu mới về đổi lịch trong tuần (2026-10-02, chưa hỏi chị quản lý):**
1. Đổi trước giờ tập bao lâu thì không mất buổi? (đang tạm giả định: đổi trong 3 tiếng trước giờ tập thì ca cũ vẫn tính)
2. Mỗi khách được đổi tối đa mấy lần/tuần hoặc /tháng?
3. Có được hỏi khách khác đổi để nhường ô không, hay chỉ xếp vào ô trống?
4. Buổi không đổi được thì chuyển tuần sau hay mất? (trùng câu buổi bù)
5. Khách đổi thẳng với PT qua Zalo: PT có phải báo CS cập nhật không?

## Từ lịch và thread thật tuần 21/09 – 04/10 (user gửi 2026-10-02)

Nguồn: ảnh lịch trực nhân sự, lưới trực theo môn, lịch buổi tập, và thread "Báo huỷ / Đổi lịch" của CS. Chưa hỏi lại chị quản lý.

**Đã rõ từ dữ liệu:**
- Lên lịch 2 lớp: (1) **lịch trực HLV** theo khung giờ và môn, có tổng giờ/ngày và giờ/tuần, ô đỏ khi quá (ví dụ 10,3h/ngày, 54h/tuần), tối thiểu 2 HLV/ngày và 1 CS/ngày; (2) **buổi tập** xếp bên trong khung trực.
- Có lớp **1-4**, Gym cũng có 1-2. Ca dài 1 tiếng, có ca bắt đầu :30. Khung trực lẻ 15 phút.
- Lớp nhóm là **chỗ cố định có ghế trống** `()`. Khách huỷ thì thành ghế trống; khách khác có thể chuyển vào lấp.
- **Rule tính buổi khi huỷ** (khớp 16/17 ca trong thread): báo trước ≥ 3h thì không tính buổi, không tính comm; báo < 2h, sau giờ tập, hoặc không đến không báo thì tính buổi, tính comm.
- **Ngoại lệ:** huỷ lần đầu của gói mới thì không tính, kể cả báo < 2h.
- **Studio huỷ lớp 1-4 khi không đủ học viên** (còn 1 khách sau khi người kia huỷ sớm). Khi bạn cùng lớp huỷ sát giờ (vẫn tính buổi) thì lớp vẫn chạy.
- **Ghép chéo gói:** khách 1-4 vào lớp 1-2, ký hiệu `1-2' A + (1-4 B)`.
- **Đổi gói:** 4 buổi 1-4 đổi được 1 buổi 1-1.
- Ghế trống lớp 1-4: nhân viên được đăng ký sát giờ để audit chất lượng, không tính comm, khách đặt vẫn được ưu tiên.
- Đổi lịch trong thread = huỷ + đặt mới, có thể đổi cả môn. HLV thả 👍 để xác nhận.
- Trial có ghi chú mục tiêu và vấn đề sức khoẻ: đây là nguồn cho trường `van_de`.
- Lịch còn có khối không phải buổi tập: `BLOCK`, `HỌP MKT`, `CMSN`.

**Câu cần hỏi chị quản lý:**
1. Báo huỷ trong khoảng 2–3h trước giờ tập thì tính buổi không?
2. Lớp nhóm cần tối thiểu mấy khách để chạy? (đoán: số khách bị tính buổi ≥ 2 với lớp 1-4; lớp 1-2 chạy với 1 khách)
3. `BLOCK` (KHOA BLOCK, Toen BLOCK) là HLV khoá giờ bận hay giữ chỗ?
4. Viết tắt trước tên khách: `NT`, `NP`; trong lịch: `ĐT`, `TBC`, `CMSN`?
5. Lớp 1-4 có cố định hằng tuần không?
6. Trần giờ HLV: tối đa bao nhiêu giờ/ngày, giờ/tuần? Tối thiểu HLV mỗi môn theo từng khung giờ?
7. "Huỷ lần đầu của gói mới" áp dụng cho mọi gói hay chỉ gói mới mua?
8. Lịch buổi tập đang ở công cụ nào, có xuất được file (.ics / CSV) không?

**Đã làm trong demo:** tab "Đọc thread CS" đọc thread dán vào thành nhật ký sự kiện và so với rule tính buổi (ngưỡng chỉnh được). Chạy trên thread thật 25–27/9: 23 sự kiện, 17 huỷ/vắng, 16 khớp rule, 1 lệch (ngoại lệ huỷ lần đầu gói mới).

## Danh sách đầy đủ

### 1. Phía khách
- ✓ Đăng ký nhiều buổi hơn số ngày rảnh.
- ✓ Hai khách tranh cùng một ô giờ (CS chọn, lựa chọn được ghi lại).
- ✗ Gói sắp hết hoặc hết hạn giữa tuần.
- ✗ Không điền form trước hạn.
- ✗ Muốn lịch cố định hằng tuần.
- ✗ Tập cặp hoặc lớp nhóm (1 ô giờ nhiều khách, đổi hẳn bài toán).
- ✗ Yêu cầu PT theo giới tính hoặc chuyên môn.
- ✗ Khách mới cần buổi đánh giá, có thể dài hơn hoặc phải đúng PT.
- ✗ Khách đổi lịch thẳng với PT qua Zalo, lịch trên hệ thống lệch với thực tế.
- ◐ Khách đổi nhiều lần hoặc hay vắng (mới hiển thị lịch sử, chưa có luật).

### 2. Phía PT
- ✓ PT nghỉ cả ngày.
- ✓ PT nộp lịch trễ ("Xếp phần còn thiếu").
- ✗ Nghỉ nửa ngày hoặc báo sát giờ.
- ◐ PT sửa lịch rảnh sau khi chốt làm rơi ca (demo mới báo bằng toast, chưa đưa phương án).
- ✗ Số giờ tối thiểu hoặc tối đa theo hợp đồng.
- ✗ Chia ca công bằng (hoa hồng tính theo ca). Demo đang dồn 19 ca cho PT Huy.
- ✗ Nghỉ phép dài ngày, cần báo trước bao lâu.
- ✗ PT tự nguyện dạy quá 2 ca liền: có cho không, có cần ghi lý do không.

### 3. Phòng và máy
- ✗ Số máy Reformer hoặc số phòng Pilates có hạn.
- ✗ Gym có đông quá mức vào giờ cao điểm không.

### 4. Thời gian
- ✗ Ca không đúng 1 tiếng, hoặc bắt đầu lệch giờ.
- ✗ Ngày lễ, studio đóng cửa.
- ✗ Buổi bù, buổi còn nợ chuyển tuần.
- ◐ Đổi lịch muộn trong 3 tiếng: ca cũ tính, ca mới tính thêm (giả định của tớ, chưa chốt).
- ✗ PT hoặc studio huỷ: không tính buổi của khách, nhưng có bù không?

### 5. Quy trình
- ✗ Khách nhận lịch rồi không xác nhận.
- ✗ Hai CS cùng sửa một lịch.
- ✗ Khách VIP giữ chỗ cố định trước khi máy xếp.

## Buổi sau
1. Cậu mang 8 câu trên hỏi chị quản lý, hoặc gửi file này cho chị điền cột "Trả lời".
2. Có câu trả lời thì tớ xếp ưu tiên để đưa vào `xep-ca.html`. Theo tớ, câu 1 (máy, phòng, lớp nhóm) và câu 2 (lịch cố định) ảnh hưởng thuật toán nhiều nhất.
