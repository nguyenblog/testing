# Máy xếp ca v2 — bản thiết kế (nháp 2026-10-02, sửa lần 2)

> Nguồn: mục 3.1 và 3.2 chị quản lý vận hành FFL gửi 02/10, cộng các quy ước tạm user chốt cùng ngày
> (bảng đầy đủ ở `edge-cases.md`). Chưa ai phía FFL duyệt bản này. Chỗ nào là giả định của tớ có ghi **(giả định)**.

## Tóm tắt

Máy v2 là **trợ lý đề xuất có giải thích**, không phải máy tự quyết. Ba nguyên tắc user chốt 02/10:

1. **Ca nào cũng ghi rõ xếp theo rule nào.** Ca nào máy không có rule để quyết thì ghi rõ là thiếu rule gì, để FFL nhìn ra và bổ sung.
2. **Edge case thì gán tạm rồi báo CS chốt.** CS còn phải đi hỏi lại PT và khách, phần đó máy không làm được.
3. **Rule bật/tắt theo từng lần xếp.** Rule của FFL phần lớn là rule mềm, tuỳ PT và hay đổi, nên mỗi tuần FFL chọn bộ rule áp dụng trước khi bấm xếp.

Khác v1 (`xep-ca.html`) về kỹ thuật:

- Chọn theo **thứ tự ưu tiên**, không cộng trừ điểm.
- **Một ca chứa được nhiều khách** (lớp ghép 1-2). Môn và loại lớp lấy từ gói tập.
- **Giới hạn là của từng PT** (ca/ngày, ca/tháng, ca liên tục, ca gãy).
- **Máy nhớ số ca đã xếp trong tháng** của từng PT để chia ca theo tỉ lệ deal.

## Phạm vi demo

| Có | Chưa làm |
|---|---|
| Lớp 1-1 và 1-2 | Lớp 1-4 |
| Giờ mở cửa 6h–21h, ca 1 tiếng tròn giờ (15 ca/ngày) | Ca 45/90 phút, ca lệch giờ |
| Bảng rule bật/tắt, nhãn rule trên từng ca, danh sách chờ CS chốt | Nối CRM thật (vấn đề của khách là dữ liệu giả) |
| Hoán đổi khi PT khách chọn đang bận | Lịch cố định hằng tuần, gói hết giữa tuần, buổi bù |

## Dữ liệu vào

**Hồ sơ PT** (studio khai, mới so với v1 in đậm):

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| `mon_day[]` | Môn dạy được | Gym, Pilates |
| `hop_dong` | full_time / part_time / theo_ca | |
| **`chuyen_mon[]`** | Vấn đề PT chuyên xử lý | cong vẹo cột sống |
| **`loai_lop_chuyen[]`** | Loại lớp PT hợp. 1-1 cần chuyên môn sâu, 1-2 cần khả năng quan sát và điều phối | 1-1 |
| **`ca_thang_deal`** | Số ca theo deal lương, dùng tính tỉ lệ | 50 |
| **`ca_thang_max`** | Trần ca mỗi tháng, có thể trống | 60 |
| **`ca_ngay_max`** | Trần ca mỗi ngày | 4 |
| **`ca_lien_tuc_max`** | Số ca liền tối đa, mặc định 3 | 3 |
| **`nghi_sau_chuoi`** | Số ca nghỉ sau khi chạm trần liên tục, mặc định 1 | 1 |
| **`ca_gay_min`** | Khoảng nghỉ tối thiểu giữa 2 khung trong ngày, PT tự khai, mặc định 4h | 3h |

**Gói tập của khách** (khách chốt trước khi tập): `mon`, `loai_lop` (1-1 hoặc 1-2), số buổi còn lại.
Phiếu hằng tuần của khách không còn chọn môn, chỉ tham chiếu `goi_tap_id`.

**Hồ sơ khách:** `van_de[]` (ví dụ cong vẹo cột sống), lấy từ CRM theo mã KH, khách không điền lại.

**Phiếu khách mỗi tuần:** `goi_tap_id`, `so_buoi`, `o_ranh[]`, `pt_muon_id` (có thể trống), `ghi_chu`.

**Phiếu PT mỗi tuần:** `o_ranh[]` như v1. PT tự khai các khung làm việc (ví dụ 6–10h và 17–21h).

**Ca tập:** `pt_id`, `ngay`, `gio`, `mon`, `loai_lop`, sức chứa (1 hoặc 2), danh sách khách trong ca, **`rule_quyet_dinh`**, **`trang_thai`** (xếp theo rule / gán tạm chờ CS / CS đã chốt), **`ly_do_gan_tam`**.
Đếm ca của PT: 1 lớp = 1 ca, bất kể mấy khách.

## Bảng rule

Mỗi rule có: mã, loại, tham số, **nguồn** (FFL nói / user chốt tạm / tớ đề xuất), **bật-tắt**, và với rule ưu tiên thì có thêm **thứ tự**.

### Rule nền (không tắt được, tắt thì lịch vô nghĩa)

| Mã | Rule | Nguồn |
|---|---|---|
| N1 | PT dạy đúng môn của gói | FFL 3.1 mục 1 |
| N2 | Khách rảnh ô đó | v1 |
| N3 | PT khai rảnh ô đó, không báo nghỉ | v1 |
| N4 | Ca còn chỗ: 1-1 thì PT phải trống; 1-2 thì PT trống hoặc có lớp 1-2 cùng môn còn 1 chỗ. Không trộn loại lớp trong 1 ca | User chốt tạm (lớp ghép) |

### Rule giới hạn (bật/tắt được, tham số theo từng PT)

| Mã | Rule | Nguồn |
|---|---|---|
| G1 | Khách tối đa 1 buổi/ngày | v1, FFL chưa nói |
| G2 | PT không quá `ca_ngay_max` | FFL 3.2 mục 5 |
| G3 | PT không quá `ca_thang_max` (tính ca đã xếp trong tháng) | FFL 3.2 mục 4 |
| G4 | PT không quá `ca_lien_tuc_max` ca liền, sau đó nghỉ `nghi_sau_chuoi` ca | FFL 3.2 mục 6; số ca nghỉ là tớ đề xuất |
| G5 | Khoảng trống trong ngày của PT: tối đa 2 ca là nghỉ tại chỗ, dài hơn là ca gãy và phải ≥ `ca_gay_min` | FFL 3.2 mục 7; ngưỡng 2 ca là tớ đề xuất |
| G6 | PT theo ca chỉ dùng khi PT khác không nhận được | User chốt 25/09 |

### Rule ưu tiên (bật/tắt được, đổi được thứ tự)

Tiêu chí trên hoà mới xét tiêu chí dưới.

| Thứ tự | Mã | Rule | Nguồn |
|---|---|---|---|
| 1 | U1 | PT khách chọn, kèm hoán đổi (xem dưới) | FFL 3.1 mục 2 và 4 |
| 2 | U3 | Loại lớp PT hợp khớp loại lớp của gói | FFL 3.2 mục 3; user: sai loại là "bí lắm mới chọn" |
| 3 | U2 | Chuyên môn PT khớp vấn đề của khách | FFL 3.2 mục 1; mềm, không có thì PT khác |
| 4 | U4 | Lớp 1-2: ghép vào lớp còn 1 chỗ trước khi mở lớp mới | User chốt 02/10 |
| 5 | U5 | Tỉ lệ ca: PT có (ca đã xếp trong tháng ÷ `ca_thang_deal`) thấp nhất được trước | FFL 3.2 mục 2; user chốt tính trên ca đã xếp |
| 6 | U6 | Dồn ca: ô sát một ca PT đã có | v1 |

Thứ tự này user chốt tạm 02/10 qua 3 tình huống, FFL chưa duyệt:

- **Chuyên môn trên tỉ lệ ca:** ưu tiên khách. Thiếu ca so với deal của PT dễ xử lý hơn là khách tập không thấy hiệu quả.
- **Loại lớp trên chuyên môn:** khách gói 1-2 có vấn đề cột sống vẫn xếp PT hợp dạy 1-2 trước, vì sale đã tư vấn rõ từng gói (user xác nhận 02/10).
- **Ghép lớp trên tỉ lệ ca:** lấp đủ lớp đang lẻ của PT A trước khi mở lớp mới cho PT B đang thiếu ca.

FFL đã nói thứ tự này linh hoạt theo tình hình nhân sự, nên nó vẫn là cấu hình đổi được theo từng lần xếp.

### Cấu hình theo từng lần xếp

- Trước khi bấm "Xếp ca", FFL thấy bảng rule: bật/tắt từng rule G và U, kéo đổi thứ tự rule U, sửa tham số.
- Mặc định chép từ lần xếp trước.
- **Mỗi lần xếp lưu lại bản chụp bộ rule đã dùng.** Mở lại lịch tuần cũ vẫn giải thích được bằng đúng rule của tuần đó.

## U1 chi tiết: PT khách chọn và hoán đổi

1. Ô khách xin mà PT đó rảnh và hợp lệ → xếp. Nhãn: "U1 PT khách chọn".
2. PT đó đang có ca của **khách không chọn đích danh PT này** → dời khách kia sang PT khác cùng giờ, trả ô cho khách đang xét. Nhãn cho cả hai ca: "U1 hoán đổi". Không tìm được PT khác cùng giờ cho khách kia thì không hoán đổi, xử lý như mục 4.
3. PT đó đang có ca của **khách cũng chọn đích danh PT này** → máy không tự quyết. Gán tạm khách đang xét sang PT khác, báo CS, kèm gợi ý: khách kia tuần này có mấy ca với PT đó, và ô nào khác cả khách kia lẫn PT đều rảnh để CS hỏi khách kia đổi. Khách đồng ý thì CS đổi; không thì giữ PT gán tạm.
4. PT đó không khai rảnh ô nào khách xin, hoặc đã chạm giới hạn → gán tạm sang PT khác, báo CS **(giả định)**.

PT khách chọn thắng mọi rule U2–U6. Khách có vấn đề sức khoẻ mà chọn PT không đúng chuyên môn: vẫn xếp, kèm cảnh báo cho CS.

## Gán tạm và báo CS

Nguyên tắc: gặp edge case thì máy vẫn đưa ra phương án tốt nhất nó tìm được, đánh dấu **gán tạm**, và đưa vào danh sách chờ CS chốt. Mỗi loại có mã để đếm được.

| Mã | Tình huống | Máy làm gì |
|---|---|---|
| T1 | PT khách chọn bận vì khách khác cũng chọn | Gán PT khác, gợi ý phương án hỏi khách kia đổi ca |
| T2 | PT khách chọn không khai rảnh hoặc chạm giới hạn | Gán PT khác |
| T3 | Không có PT đúng chuyên môn trống, **hoặc có nhưng bị rule ưu tiên xếp trên (ví dụ Loại lớp) loại trước** | Gán PT khác chuyên môn. Trường hợp sau: nêu tên PT đúng chuyên môn, rule đã loại PT đó, và ô CS có thể đổi sang (user chốt 02/10) |
| T4 | Phải dùng PT không hợp loại lớp (ví dụ PT chuyên 1-1 dạy 1-2) | Gán, đánh dấu "không khuyến nghị" |
| T5 | Xếp xong mà lớp 1-2 vẫn chỉ có 1 khách | Giữ lớp, CS quyết ghép thêm hay PT dạy như 1-1 |
| T6 | Phải dùng PT theo ca | Gán |
| T7 | Hai khách tranh một ô, không rule nào phân được | Hiện cả hai, CS chọn (như v1) |
| T8 | Lịch của PT phạm G4 hoặc G5 ở bước rà cuối | Giữ nguyên, liệt kê chỗ phạm |
| T9 | Không tìm được ô nào cho buổi của khách | Không gán, liệt kê ô gần nhất nếu nới 1 rule |

## Máy báo cáo gì sau mỗi lần xếp

1. **Trên từng ca:** rule quyết định (ví dụ "U2 chuyên môn"), các rule đã qua, và trạng thái (xếp theo rule / gán tạm).
2. **Danh sách chờ CS chốt:** gom theo mã T, mỗi dòng có phương án gán tạm và gợi ý của máy.
3. **Bảng "rule đang thiếu":** đếm theo mã T qua các tuần. Ví dụ "T7 tranh chấp: 6 lần tuần này, CS đều chọn khách tập đều hơn" là tín hiệu để FFL chốt thành rule mới.
4. **Tỉ lệ ca gán tạm trên tổng số ca.** Con số này cho biết máy có đỡ việc cho CS thật không. Nếu quá nửa số ca là gán tạm thì bộ rule chưa đủ dùng.
5. **Bảng tỉ lệ ca theo PT:** ca đã xếp trong tháng so với deal.

## Máy chạy

1. FFL xem bảng rule, bật/tắt, bấm xếp. Máy lưu bản chụp bộ rule.
2. Dựng lưới 7 ngày × 15 giờ. Nạp số ca đã xếp trong tháng của từng PT.
3. Xếp thứ tự khách: khách có chọn PT trước, rồi tới khách ít lựa chọn nhất (như v1).
4. Với mỗi buổi của mỗi khách: lọc bằng rule N và rule G đang bật, chọn theo rule U đang bật, ghi ca kèm nhãn rule.
5. Rà cuối: lớp 1-2 chưa đủ người (T5), luật khoảng trống (T8), tỉ lệ ca.
6. Xuất lịch nháp, danh sách chờ CS chốt, các bảng báo cáo.

## Rủi ro kỹ thuật

- **Bật/tắt rule tự do sinh ra nhiều tổ hợp.** Cần test từng rule riêng và vài tổ hợp hay dùng. Tắt U5 vài tuần thì tỉ lệ ca cả tháng sẽ lệch, máy phải cảnh báo điều này khi tắt.
- **Luật khoảng trống G5 phụ thuộc thứ tự xếp.** PT có ca 6h và 10h là phạm, thêm ca 8h thì hợp lệ. Vì vậy G5 chỉ kiểm ở bước rà cuối. Nếu lệch nhiều thì chuyển sang bộ giải ràng buộc.
- **Chưa có lịch thật để so.** Cần 1–2 tuần lịch CS đã xếp tay.
- **Tỉ lệ ca tính trên ca đã xếp.** Ca phát sinh hoặc huỷ sau khi chốt lịch chưa được tính lại.

## Còn mở

1. Thứ tự rule ưu tiên: user đã chốt tạm, còn chờ chị quản lý xác nhận.
2. G1 (khách 1 buổi/ngày) FFL có áp dụng không?
3. Khi hoán đổi, có được đổi giờ của khách bị dời không, hay chỉ đổi PT?
4. Các câu cũ: ca có luôn tròn giờ 1 tiếng, lịch cố định hằng tuần, gói hết giữa tuần, buổi bù, khách không điền form.
