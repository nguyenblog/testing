// Test máy xếp ca v2: mở trang trong Chromium headless rồi kiểm từng luật.
// Chạy: node fit-for-life/tests/run.js   (cần Playwright; đặt PW=<đường dẫn playwright> nếu không cài trong dự án)
const path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const PAGE = 'file://' + path.resolve(__dirname, '../xep-ca-v2.html');
let fail = 0, pass = 0;
const ok = (name, cond, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗'} ${name}${cond ? '' : '  ' + extra}`); };

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(PAGE);
  const ev = (fn, arg) => pg.evaluate(fn, arg);

  // --- Đọc khung giờ
  const w = await ev(() => { const r = parseWin('T2 6:15-10:15 Gym; T7 8-12', ['Pilates', 'Gym']);
    return { starts: [...r.starts].filter(k => k.startsWith('0|')).map(k => +k.split('|')[1]), gymOnly: r.kinds.get(K(0, 420)), t7: r.kinds.get(K(5, 480)) }; });
  ok('Khung 6:15–10:15: buổi bắt đầu 6:30 … 9:00', JSON.stringify(w.starts) === JSON.stringify([390, 420, 450, 480, 510, 540]), JSON.stringify(w.starts));
  ok('Khung có ghi môn chỉ nhận môn đó', JSON.stringify(w.gymOnly) === '["Gym"]' && w.t7 === undefined);
  const lst = await ev(() => [...parseWin('T2,T4 7,8h30').starts].sort());
  ok('Giờ cụ thể "7,8h30"', JSON.stringify(lst) === JSON.stringify(['0|420', '0|510', '2|420', '2|510'].sort()), JSON.stringify(lst));
  const bad = await ev(() => ['T2 7h15', 'T2 6-25', 'T9 7', 'T2 7-9 Yoga x'].map(t => { try { parseWin(t); return 'ok' } catch (e) { return 'err' } }));
  ok('Báo lỗi giờ lẻ, giờ sai, ngày sai, thừa chữ', bad.every(x => x === 'err'), JSON.stringify(bad));
  ok('avHuman gộp khoảng', await ev(() => avHuman(parseWin('T2-T6 7-9').starts)) === 'T2-T6 7-9');

  // --- Luật xếp (dựng tình huống nhỏ trên dữ liệu mẫu)
  const r = await ev(() => {
    seed(); const vy = PB.vy, khoa = PB.khoa, ha = CB.ha, lan = CB.lan;
    const mk = (c, d, h, p) => book(c, { d, h, p, join: null }, { rule: 'TEST' });
    const out = {};
    mk(ha, 0, 420, vy);                                              // Vy dạy T2 7:00–8:00
    lan.av = parseWin('T2 7-9').starts;
    out.overlap = check(lan, 0, 450, vy).no;                         // 7:30 chồng giờ → N4
    out.next = !!check(lan, 0, 480, vy).ok;                          // 8:00 liền sau → được
    lan.av = parseWin('T7 8').starts;
    out.kind = check(lan, 5, 480, khoa).no;                          // T7 Khoa chỉ trực Gym → N3
    seed();
    out.run3 = runsOk([420, 480, 540], PB.vy); out.run4 = runsOk([420, 480, 540, 600], PB.vy);
    out.notRun = runsOk([420, 510, 600, 690], PB.vy);                // cách 30 phút: không tính liền
    out.restShort = runsOk([420, 480, 540, 630], PB.vy);             // nghỉ 30 phút sau 3 buổi liền → phạm
    out.restOk = runsOk([420, 480, 540, 660], PB.vy);                // nghỉ 1 tiếng → được
    seed(); const vy2 = PB.vy;
    book(CB.ha, { d: 1, h: 420, p: vy2, join: null }, { rule: 'T' }); book(CB.lan, { d: 1, h: 1050, p: vy2, join: null }, { rule: 'T' });
    book(CB.truc, { d: 2, h: 420, p: vy2, join: null }, { rule: 'T' }); book(CB.nam, { d: 2, h: 690, p: vy2, join: null }, { rule: 'T' });
    finalize(); out.gaps = RUN.gaps.map(g => [g.d, g.g]);
    return out;
  });
  ok('Buổi 7:30 chồng buổi 7:00 của cùng HLV bị chặn (N4)', r.overlap === 'N4', r.overlap);
  ok('Buổi 8:00 ngay sau buổi 7:00 vẫn xếp được', r.next);
  ok('Khung chỉ Gym không nhận khách Pilates (N3)', r.kind === 'N3', r.kind);
  ok('3 buổi liền được, 4 buổi liền bị chặn (runMax 3)', r.run3 && !r.run4);
  ok('Buổi cách nhau 30 phút không tính là liền', r.notRun);
  ok('Sau 3 buổi liền phải nghỉ ít nhất 1 tiếng', !r.restShort && r.restOk);
  ok('Ca gãy: trống 3,5h (dưới mức 4h của Vy) bị ghi, trống 9,5h thì không', JSON.stringify(r.gaps) === JSON.stringify([[2, 3.5]]), JSON.stringify(r.gaps));

  // --- Lịch trực
  const ro = await ev(() => { seed(); const R = rosterCheck(); return { vy: R.rows[0].week / 60, overWeek: R.rows[0].overWeek, present: R.present, warn: R.warn.length }; });
  ok('Giờ trực Vy = 44h/tuần, vượt trần 40h', ro.vy === 44 && ro.overWeek, JSON.stringify(ro));
  ok('Đếm HLV có mặt từng ngày (CN = 0)', JSON.stringify(ro.present) === JSON.stringify([3, 3, 3, 3, 2, 3, 0]), JSON.stringify(ro.present));
  ok('Gộp khung trực chồng nhau', await ev(() => dutyMin([{ d: 0, a: 360, b: 600 }, { d: 0, a: 540, b: 660 }, { d: 0, a: 900, b: 960 }])[0]) === 360);

  // --- Kịch bản mẫu chạy hết luồng, không lỗi
  const run = await ev(() => { defaultCfg(); run(); addLate(); return { n: SESS.reduce((a, s) => a + s.bk.length, 0), unp: RUN.unp.length }; });
  ok('Kịch bản mẫu: xếp 12 buổi, 1 khách thiếu buổi', run.n === 12 && run.unp === 1, JSON.stringify(run));

  // --- Đọc thread (ví dụ tên giả)
  const th = await ev(() => { const r = readThread(THR_SAMPLE); const cx = r.ev.filter(e => e.type === 'huy');
    const R = { noCharge: 3, charge: 2 }; cx.forEach(e => { e.exp = expectCharge(e, R) });
    return { ev: r.ev.length, unk: r.unk.length, mism: cx.filter(e => e.exp.v != null && e.charged != null && e.exp.v !== e.charged).length, gap: cx.filter(e => e.exp.gap).length }; });
  ok('Thread mẫu: 15 sự kiện, 0 dòng không hiểu, 1 lệch, 1 chưa có rule', th.ev === 15 && th.unk === 0 && th.mism === 1 && th.gap === 1, JSON.stringify(th));

  ok('Không có lỗi JavaScript trên trang', errs.length === 0, errs.join(' | '));
  await browser.close();
  console.log(`\n${pass} đạt, ${fail} trượt`);
  process.exit(fail ? 1 : 0);
})();
