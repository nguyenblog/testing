# Checklist Onboard & Tiếp nhận Product — dành cho PO

> **Dùng khi nào:** bạn được giao một sản phẩm **đã có người build trước đó** (kế thừa), và nhiệm vụ của bạn là triển khai + enhance, không phải xây từ 0.
>
> **Cách dùng:** copy file này ra một bản riêng cho từng project (vd `adsOp-onboarding.md`), tick dần. Không cần tick hết mới được bắt đầu làm việc — nhưng **Phase 0 → 2 phải xong trước khi bạn hứa bất cứ deadline nào với ai.**

| | |
|---|---|
| **Project** | _(adsOp / Creator Hub / ...)_ |
| **Người build gốc** | |
| **Người cùng phụ trách** | |
| **Ngày bắt đầu onboard** | |
| **Ngày review lại file này** | |

---

## ⚠️ Nguyên tắc nền — đọc trước khi tick

1. **Đừng hứa deadline trong 2 tuần đầu.** Sản phẩm kế thừa luôn có thứ ẩn. Hứa sớm = tự đào hố.
2. **Mỗi doc chỉ tồn tại nếu nó chặn được một cái đau có thật.** Không đau → chưa viết. Viết doc không ai đọc là tốn công của chính bạn.
3. **Người build trước không sai, họ chỉ tối ưu cho ràng buộc khác.** Hỏi "vì sao hồi đó làm thế này" trước khi hỏi "sao không làm thế kia".
4. **Số liệu sai một lần là mất niềm tin lâu dài.** Với product dashboard/report, độ chính xác quan trọng hơn tốc độ ra feature.
5. **Viết doc ở nơi team thật sự vào.** Team sống trong Sheet thì đừng dựng wiki 40 trang không ai mở.

---

## Phase 0 — Tự tìm hiểu trước khi hỏi ai (24–48h đầu)

Mục tiêu: vào buổi họp đầu tiên với tư cách người đã đọc, không phải người đi hỏi từ đầu.

- [ ] Tự mở sản phẩm ở môi trường thật, **click qua hết mọi màn hình**, không bỏ màn nào
- [ ] Vẽ nháp sitemap: có bao nhiêu trang/tab, trang nào là trang chính
- [ ] Chụp screenshot từng màn hình, lưu lại làm mốc "trạng thái ngày tôi nhận"
- [ ] Ghi lại **mọi thứ mình không hiểu** vào một list — đây chính là agenda buổi họp đầu
- [ ] Tìm xem có doc/README/Slack thread/Notion cũ nào không, đọc hết dù đã cũ
- [ ] Thử tìm chỗ **lỗi hoặc số liệu trông sai** — mang vào buổi đầu 1–2 cái là bạn được tin ngay
- [ ] Tự trả lời: *"Nếu ngày mai web này tắt, team mất đi điều gì?"* — nếu chưa trả lời được thì bạn chưa hiểu product

---

## Phase 1 — Access & Inventory

Không có access thì mọi kế hoạch chỉ là phỏng đoán. Xin tất cả một lần, đừng xin lẻ.

### Quyền truy cập cần xin
- [ ] Account trên **prod** (và biết account đó role gì)
- [ ] Account trên **staging / dev** (nếu có)
- [ ] **Source code** (repo nào, branch nào là branch thật đang chạy)
- [ ] **Database** — ít nhất quyền read
- [ ] Nguồn data đầu vào: Google Sheet / Excel / file import / API / extension
- [ ] Nơi log & monitor (nếu có): error log, server log, dashboard uptime
- [ ] Nơi chứa ticket/backlog hiện tại (Jira, Trello, Sheet, hay... chat)
- [ ] Account các nền tảng bên ngoài mà product gọi tới (vd TikTok Ads, Partner Center)

### Inventory môi trường
- [ ] Liệt kê **tất cả** môi trường đang tồn tại: prod / staging / dev / local / bản demo cũ
- [ ] Môi trường nào **đang được dùng thật**? Ai dùng?
- [ ] Có môi trường nào **lệch khỏi prod** không? Lệch cái gì?
- [ ] Prod từng bị **sửa tay / hotfix trực tiếp** chưa? → nếu có, staging không còn đáng tin
- [ ] Deploy lên prod bằng cách nào? Ai bấm? Có rollback được không?

> 🚩 **Red flag:** có staging nhưng không ai merge lên prod. Lý do thật hầu như không phải "chưa có thời gian" — mà là *không ai dám deploy vì không có cách verify*. Đào tiếp chỗ này.

---

## Phase 2 — System Map: data đi từ đâu đến đâu

Đây là phase quan trọng nhất. Chưa xong cái này thì chưa nên nhận yêu cầu enhance.

### Luồng data
- [ ] Liệt kê **mọi nguồn data đầu vào** (người nhập tay, file upload, API, crawl/extension, DB khác)
- [ ] Với mỗi nguồn: **ai sở hữu**, cập nhật bằng cách nào, **bao lâu một lần**
- [ ] Vẽ được sơ đồ: `nguồn → xử lý → nơi lưu → màn hình hiển thị`
- [ ] Chỉ ra được **source of truth** cho từng loại dữ liệu
- [ ] Nếu 2 nguồn cùng mô tả 1 thứ (vd Sheet và DB cùng có số của 1 creator): **lúc lệch thì tin ai?** Ghi rõ ra.
- [ ] Data có bước nào **thủ công** không? Ai làm? Nếu người đó nghỉ phép thì sao?
- [ ] Có chỗ nào data **ghi đè mất dấu** không? (vd sync mới xóa sạch bảng cũ → không truy lại được)

### Phân quyền
- [ ] Có mấy loại user/role? Mỗi role thấy được gì?
- [ ] **Role A có thể thấy data của role B không?** Test thật, đừng tin mô tả.
- [ ] Mapping phân quyền lưu ở đâu? (DB? Sheet? hardcode?)

> 🚩 **Red flag:** phân quyền dựa trên một file spreadsheet ai cũng sửa được. Đây là lỗ bảo mật lẫn lỗ data, và nó sẽ nổ vào đúng lúc đông người nhất.

### Điểm vỡ
- [ ] Liệt kê các **single point of failure**: component nào chết là tắt cả luồng?
- [ ] Nếu nguồn data ngoài (API/extension/crawl) **chết im lặng**, ai biết? Bằng cách nào?
- [ ] Có phụ thuộc nào vào nền tảng bên ngoài mà **mình không kiểm soát** (đổi API, đổi UI, ban account)?

---

## Phase 3 — Hiểu người dùng và việc thật của họ

Sản phẩm do dev hoặc do sếp dựng lên thường **chưa được verify với người dùng thật**. Đây là chỗ bạn tạo ra giá trị lớn nhất với vai PO.

- [ ] Liệt kê từng nhóm user. Với mỗi nhóm trả lời **3 câu**:
  - [ ] Họ mở web này ra để **làm hành động gì**?
  - [ ] Họ **quyết định gì** sau khi xem?
  - [ ] Nếu không có web, họ làm việc đó bằng gì? (→ chính là đối thủ thật của bạn)
- [ ] **Ngồi xem 1 người dùng thật dùng web, không hướng dẫn, không nhắc.** Ghi lại chỗ họ lúng túng.
- [ ] Hỏi: *"Có số nào trên này anh/chị không tin không?"* — câu này lộ ra nhiều bug nhất
- [ ] Hỏi: *"Có việc gì anh/chị vẫn phải làm ngoài Excel vì web chưa làm được?"*
- [ ] Đếm xem thật sự **có bao nhiêu người dùng nó hằng ngày** (đừng tin con số được kể)
- [ ] Phân biệt rõ: feature **sếp muốn** vs feature **người dùng cần** — hai cái này không luôn trùng nhau, và bạn là người duy nhất ở vị trí nhìn thấy khoảng cách đó

---

## Phase 4 — Săn rủi ro & nợ kỹ thuật

Mục tiêu: có một list để mang đi nói chuyện, không phải để tố ai.

- [ ] Lập **Technical Debt Backlog** (chỉ cần 1 bảng, xem template Phụ lục C)
- [ ] Mỗi item ghi đủ: *hiện trạng → rủi ro nếu không sửa → mức độ → đề xuất*
- [ ] Phân loại: ① sẽ nổ ② gây sai số ③ gây chậm người ④ chỉ là xấu code (cái này không phải việc của bạn)
- [ ] Đưa list này cho CTO xem **trước khi** đưa cho ai khác
- [ ] Ghi lại ngày nêu vấn đề và phản hồi nhận được → đây là cách bạn tự bảo vệ mình khi sự cố xảy ra

### Danh mục red flag thường gặp (soi xem có cái nào không)

| Dấu hiệu | Thường nghĩa là |
|---|---|
| Staging tồn tại nhưng không ai merge | Không có cách verify, hoặc prod đã bị sửa tay |
| Data vào bằng người copy-paste thủ công | Quy trình thật, không phải tạm thời — thiết kế lại phải tôn trọng nó |
| Không ai biết công thức một metric | Số đang được tin mà không ai kiểm được |
| Dựa vào crawl/extension/scrape | Nền tảng đổi là tắt, thường tắt im lặng |
| Không có log / không có alert | Lỗi chỉ được biết khi người dùng phàn nàn |
| Chỉ một người hiểu hệ thống | Rủi ro nhân sự, cũng là nút cổ chai mọi việc |
| Số trên web khác số trong file nguồn | Có bug, hoặc có 2 định nghĩa khác nhau cho 1 metric |
| Không có backup / không restore được | Một lệnh sai là mất sạch |

---

## Phase 5 — Triển khai (rollout & adoption)

Phần này hay bị bỏ qua, nhưng *"web có rồi mà không ai dùng"* là kiểu thất bại phổ biến nhất của sản phẩm nội bộ.

- [ ] Xác định rõ: **ai phải chuyển sang dùng web**, chuyển từ cái gì
- [ ] Tìm **lý do họ sẽ không muốn chuyển** (chậm hơn? thiếu cột? không export được? sợ sai?)
- [ ] Giải quyết lý do đó **trước khi** bắt đầu truyền thông, không phải sau
- [ ] Chọn 1–2 người dùng thử trước làm **điểm tựa**, không rollout cả team một lần
- [ ] Viết hướng dẫn ngắn — ưu tiên ảnh/video 2 phút hơn văn bản dài
- [ ] Mở một kênh nhận phản hồi rõ ràng (1 group chat / 1 form), đừng để feedback rải khắp DM
- [ ] Đặt mốc kiểm: sau 1 tuần / 2 tuần, **bao nhiêu % đã dùng thật**
- [ ] Chốt với nhau: **khi nào thì tắt cách làm cũ?** Nếu không bao giờ tắt, người ta sẽ không bao giờ chuyển hẳn

---

## Phase 6 — Enhance: nhận yêu cầu & nghiệm thu

- [ ] Chốt **một chỗ duy nhất** để nhận yêu cầu (không nhận qua DM, không nhận miệng)
- [ ] Mỗi yêu cầu bắt buộc có: *ai cần, để làm gì, hiện tại đang xoay sở thế nào*
- [ ] Viết **User Story + Acceptance Criteria** cho từng item trước khi dev bắt tay
- [ ] AC viết theo dạng **kiểm được đúng/sai**, không mô tả chung
  - ❌ "Dashboard hiển thị đúng dữ liệu"
  - ✅ "Với partner P có 3 creator, bảng hiển thị đúng 3 dòng; partner P không thấy creator của partner khác; tổng GMV = tổng 3 dòng; data cũ không quá 24h, có ghi giờ cập nhật trên màn hình"
- [ ] Mỗi story có ghi rõ **cái gì KHÔNG nằm trong phạm vi lần này**
- [ ] Trước khi nhận "done": tự test lại theo đúng AC, **bằng data thật**
- [ ] Sau mỗi lần release: kiểm lại checklist regression (Phụ lục D)

### Phân chia việc khi có 2 người cùng phụ trách
- [ ] Chốt ai là **người quyết cuối** khi hai người khác ý (không có cái này là tắc)
- [ ] Chốt ai là **đầu mối duy nhất với dev/CTO** — hai người cùng gửi yêu cầu sẽ gây nhiễu
- [ ] Chia theo **mảng** (vd mỗi người một nhóm user/một nhóm màn hình), đừng chia theo "ai rảnh"
- [ ] Mỗi tuần sync 1 lần, cùng nhìn vào một backlog chung

### Lưu ý khi chính CTO là người build sản phẩm
- [ ] Hiểu rằng thời gian của CTO không dành riêng cho project này → **xếp ưu tiên giúp họ**, đừng đẩy list dài
- [ ] Gộp yêu cầu thành batch, đừng nhỏ giọt từng cái
- [ ] Mỗi yêu cầu kèm sẵn lý do nghiệp vụ → tiết kiệm vòng hỏi lại
- [ ] Những gì tự làm được (sửa data, sửa Sheet, viết doc, test) thì tự làm hết

---

## Phase 7 — Hệ thống tài liệu: làm cái gì, theo thứ tự nào

**Đừng làm cả bộ cùng lúc.** Thứ tự dưới đây xếp theo giá trị thực tế.

### Tier 1 — làm ngay, song song với công việc đang chạy
- [ ] **System Map** — sơ đồ luồng data + danh sách nguồn + source of truth
- [ ] **Metric / Data Dictionary** — quan trọng nhất với sản phẩm dashboard/report (template ở Phụ lục B)
- [ ] **Business Rules** — các quy tắc nghiệp vụ, viết dạng câu phán xử được
- [ ] **User Story + AC** — chỉ cho việc đang build, **không viết hồi tố** cho feature đã ship
- [ ] **Technical Debt Backlog** — chỉ là một bảng chạy liên tục, rẻ nhất mà hữu ích nhất

### Tier 2 — sau khi đợt việc hiện tại ship xong
- [ ] **Definition of Done** — gọn 5 dòng. Phải có dòng *"đã lên prod và người dùng thật đã xác nhận"*
- [ ] **Regression checklist thủ công** — chưa cần automation, xem Phụ lục D
- [ ] **Definition of Ready** — chỉ làm khi đã có luồng nhận yêu cầu đều đặn

### Tier 3 — chưa cần bây giờ
- [ ] **NFRs đầy đủ** → premature. Chỉ giữ 2 thứ và nhét thẳng vào AC: **độ tươi của data** và **phân quyền**
- [ ] **Test Strategy & Automation** → việc của CTO/eng lead, không phải PO. Và automation trước khi business rule ổn định = tự động hóa đúng bug đang có

### Giữ cho doc không chết
- [ ] Mỗi doc có **1 owner** và **ngày review cuối** ghi ngay đầu file
- [ ] Doc đặt ở nơi team thật sự vào
- [ ] Business rule viết dạng kiểm được:
  - ❌ "Hệ thống xử lý commission"
  - ✅ "Commission = GMV × rate theo tier. Tier chốt theo ngày cuối tháng. Đơn refund trừ ngược vào tháng phát sinh."

> 📌 Doc cũ mà người ta vẫn tin còn nguy hiểm hơn doc không tồn tại.

---

## Phụ lục A — Câu hỏi mang đi hỏi từng người

### Hỏi CTO / người build
- [ ] Phần nào của hệ thống anh thấy **mong manh nhất**?
- [ ] Có chỗ nào hồi đó làm tạm mà **chưa kịp quay lại sửa**?
- [ ] Nếu chỉ được sửa 1 chỗ trong 1 tháng tới, anh sửa chỗ nào?
- [ ] Deploy và rollback thế nào? Em được phép làm gì, không được làm gì?
- [ ] Có backup không, có từng restore thử chưa?
- [ ] Em cần biết điều gì mà em chưa biết để mà hỏi?

### Hỏi sếp / người nêu ý tưởng ban đầu
- [ ] Ban đầu sản phẩm này sinh ra để giải quyết việc gì?
- [ ] Nếu nó chạy thật tốt, 3 tháng tới chị kỳ vọng thấy điều gì khác đi?
- [ ] Chỉ số nào chị dùng để biết nó đang có tác dụng?
- [ ] Việc nào trên này quan trọng nhất, việc nào có thể bỏ?

### Hỏi người dùng hằng ngày
- [ ] Một ngày anh/chị mở nó mấy lần, để làm gì?
- [ ] Chỗ nào làm anh/chị mất thời gian nhất?
- [ ] Có số nào anh/chị không tin không? Vì sao?
- [ ] Việc gì vẫn phải làm ngoài Excel vì web chưa làm được?
- [ ] Nếu mai web tắt một tuần, anh/chị xoay thế nào?

---

## Phụ lục B — Template Metric / Data Dictionary

Một dòng cho mỗi con số xuất hiện trên sản phẩm. Không có dòng nào → con số đó chưa được ai bảo chứng.

| Tên hiển thị | Định nghĩa nghiệp vụ | Công thức | Nguồn data | Chu kỳ cập nhật | Owner | Trường hợp đặc biệt |
|---|---|---|---|---|---|---|
| | | | | | | |

**Quy ước:** mỗi khi phát hiện 2 người hiểu khác nhau về cùng một metric → ghi ngay vào đây, đó là bug chực chờ.

---

## Phụ lục C — Template Technical Debt Backlog

| # | Hiện trạng | Rủi ro nếu không sửa | Mức độ | Đề xuất | Ngày nêu | Phản hồi |
|---|---|---|---|---|---|---|
| 1 | | | Cao/TB/Thấp | | | |

---

## Phụ lục D — Template Regression Checklist thủ công

Chạy lại sau **mỗi lần** release. Với sản phẩm dashboard, bug chết người nhất là **số đổi mà không ai phát hiện** — nên phải ghi sẵn giá trị đúng để so.

| # | Màn hình | Thao tác | Kết quả đúng phải là | Pass/Fail |
|---|---|---|---|---|
| 1 | Đăng nhập | login bằng role A | vào được, chỉ thấy data của A | |
| 2 | | dùng data của kỳ đã chốt | số phải đúng bằng ___ (giá trị known-good) | |
| 3 | | login role A, thử xem data role B | **phải bị chặn** | |
| 4 | | xem ngày cập nhật data | có hiển thị, và không cũ hơn ___ | |
| 5 | | export (nếu có) | file ra đúng số dòng, đúng số tổng | |

---

## Phụ lục E — Mốc 30 / 60 / 90 ngày

### 30 ngày đầu — hiểu, chưa hứa
- [ ] Xong Phase 0 → 3
- [ ] Có System Map + Metric Dictionary bản đầu
- [ ] Đã ngồi xem ít nhất 3 người dùng thật dùng sản phẩm
- [ ] Có Technical Debt Backlog và đã trao đổi với CTO
- [ ] **Chưa cam kết roadmap dài** — chỉ cam kết những việc nhỏ chắc chắn làm được

### 60 ngày — ship được việc nhỏ, dựng được nếp
- [ ] Đã ship 2–3 enhancement nhỏ, có AC rõ, không gây lỗi mới
- [ ] Luồng nhận yêu cầu đã về một chỗ
- [ ] Có Definition of Done và regression checklist đang dùng thật
- [ ] Rollout đạt mốc adoption đã đặt

### 90 ngày — nói chuyện được bằng dữ kiện
- [ ] Trả lời được: sản phẩm đang tạo ra giá trị gì, đo bằng gì
- [ ] Có đề xuất rõ ràng cho 1–2 việc lớn hơn, kèm lý do từ data chứ không từ cảm giác
- [ ] Giảm được ít nhất 1 món nợ kỹ thuật nghiêm trọng
- [ ] Hệ thống không còn chỉ một người hiểu

---

## Ghi chú riêng cho project adsOp

> Điền và kiểm chứng khi onboard — các giả định dưới đây **chưa được xác nhận**, đừng coi là sự thật.

- [ ] adsOp phục vụ nhóm nào? Họ đang làm thủ công bước nào trong vận hành ads?
- [ ] **Sản phẩm có liên quan tới tiền không** (ngân sách, chi phí, ROAS, payout)?
      → Nếu có: độ chính xác và khả năng truy vết lịch sử là **yêu cầu số 1**, trên mọi feature mới
- [ ] Data ads lấy từ đâu — API chính thức, export thủ công, hay crawl? (quyết định độ tin cậy và rủi ro)
- [ ] Ai được phép **thao tác thay đổi** (sửa ngân sách, bật/tắt campaign) qua web? Có log lại ai làm gì, lúc nào?
- [ ] Có hành động nào **không thể hoàn tác** không? → cần bước xác nhận trước khi thực thi
- [ ] Số trên adsOp có khớp với số trên platform gốc không? **Đối chiếu thủ công 1 kỳ để kiểm.**
      → Lệch bao nhiêu % thì coi là bình thường? Chốt ngưỡng và ghi vào Business Rules
- [ ] CTO build sản phẩm này → xem lại mục *"Lưu ý khi chính CTO là người build"* ở Phase 6
- [ ] Phân vai với chị cùng phụ trách: ai quyết cuối, ai là đầu mối với CTO, chia mảng thế nào

---

*Checklist này là bản sống. Mỗi lần onboard xong một project, quay lại thêm vào cái bạn học được — và xoá cái tỏ ra không dùng đến.*
