// Test luồng bản demo xep-ca.html: chạy đủ các vai và thao tác, kiểm luật bất biến sau mỗi bước.
// Chạy: node fit-for-life/tests/demo.js   (cần Playwright; đặt PW=<đường dẫn playwright> nếu không cài trong dự án)
const path = require('path');
const { chromium } = require(process.env.PW || 'playwright');
const PAGE = 'file://' + path.resolve(__dirname, '../xep-ca.html');
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗'} ${name}${cond ? '' : '  ' + extra}`); };

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1480, height: 950 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(PAGE);
  // Bất biến: không quá sức chứa, buổi nằm trong khung trực (trừ CS xếp tay), không chồng giờ HLV/khách, đúng môn và loại lớp
  const inv = async step => { const r = await pg.evaluate(() => { const bad = [];
    for (const s of SESS) { const p = PB[s.p]; if (s.bk.length > CAP[s.cls]) bad.push('quá sức chứa');
      if (!p.av.has(K(s.d, s.h)) && !OFFD.has(p.id + '|' + s.d) && !s.bk.some(x => x.rule === 'CS')) bad.push('ngoài khung trực');
      for (const t of SESS) if (t !== s && t.d === s.d && Math.abs(t.h - s.h) < DUR) { if (t.p === s.p) bad.push('HLV chồng giờ'); if (t.bk.some(x => s.bk.some(y => y.c === x.c))) bad.push('khách chồng giờ') }
      for (const x of s.bk) { const c = CB[x.c]; if (c.kind !== s.kind || c.cls !== s.cls) bad.push('sai môn/loại lớp') } }
    return { n: SESS.reduce((a, s) => a + s.bk.length, 0), bad: [...new Set(bad)] } });
    ok(`${step}: không phạm bất biến (${r.n} buổi)`, !r.bad.length, r.bad.join(', ')); return r };
  const click = async sel => pg.click(sel);

  await click('.tb [data-act="auto"]'); const r0 = await inv('Xếp tự động');
  ok('Xếp được ít nhất 30 buổi từ dữ liệu mẫu', r0.n >= 30, r0.n);
  ok('Có lớp 1-4 ghép nhiều khách', await pg.evaluate(() => SESS.some(s => s.cls === '1-4' && s.bk.length >= 2)));
  ok('Có buổi gán tạm chờ CS chốt', await pg.evaluate(() => allBk().some(x => isTmp(x.b))));
  ok('Bản máy xếp được lưu để so chỉ số', await pg.evaluate(() => !!WK.may));
  await click('.blk'); await click('[data-act="move"]'); await click('[data-act="m-go"]'); await inv('Đổi chỗ trong bản nháp');
  await click('[data-act="publish"]'); await click('[data-act="m-go"]');
  ok('Chốt lịch: bản v1, khoá hoán đổi', await pg.evaluate(() => state.status === 'published' && WK.ver === 1 && NOSWAP));
  await click('.blk'); await click('[data-act="kchange"]'); await click('[data-act="m-when"][data-v="near"]'); await click('[data-act="m-go"]');
  await inv('Khách huỷ sát giờ');
  ok('Huỷ sát giờ được ghi là tính buổi', await pg.evaluate(() => WK.log.some(l => l.type === 'huy' && l.charged === true)));
  await click('.blk'); await click('[data-act="kchange"]'); await click('[data-act="m-when"][data-v="far"]'); await pg.check('#m_first'); await click('[data-act="m-go"]');
  ok('Huỷ lần đầu gói mới được ghi là không tính', await pg.evaluate(() => WK.log.some(l => l.type === 'huy' && l.charged === false)));
  await click('.gh [data-act="sel-p"]'); await click('[data-act="ptoff"]'); await click('[data-act="m-go"]'); await inv('HLV báo nghỉ');
  ok('Có danh sách "cần báo" sau khi chốt', await pg.evaluate(() => CHANGES.length >= 3));
  for (const t of ['rules', 'ptav', 'req', 'metrics', 'thread', 'sys']) await click(`[data-act="tab"][data-v="${t}"]`);
  await click('[data-act="tab"][data-v="metrics"]'); ok('Tab Chỉ số có bảng so 3 bản', !!(await pg.$('table.mt')));
  await click('.dev [data-v="kh"]'); await click('[data-act="f-keep"][data-v="change"]'); await click('[data-act="f-band"][data-v="2"]'); await click('[data-act="kh-send"]');
  await click('.dev [data-v="pt"]'); await click('[data-act="pt-prev"]'); await click('[data-act="pt-send"]');
  await click('.dev [data-v="cs"]'); await click('[data-act="tab"][data-v="plan"]'); await click('.tb [data-act="auto"]'); await inv('Xếp phần còn thiếu sau khi khách và HLV nộp');
  ok('HLV nộp trễ đã có khung trực', await pg.evaluate(() => PB.bao.submitted && PB.bao.av.size > 0));
  await click('.dev [data-v="lab"]'); await pg.fill('#lm_name', 'Chị Mai'); await click('[data-act="lm-band"][data-v="2"]'); await click('[data-act="lm-add"]'); await click('.lbar [data-act="lab-go"]');
  await inv('Chạy thử với khách tự điền');
  ok('Khách tự điền có trên lịch', await pg.evaluate(() => CL.some(c => c.mine)));
  ok('Không có lỗi JavaScript', !errs.length, errs.join(' | '));
  await b.close(); console.log(`\n${pass} đạt, ${fail} trượt`); process.exit(fail ? 1 : 0);
})();
