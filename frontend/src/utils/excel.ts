import ExcelJS from 'exceljs';
import type { Person, Relationship } from '../types/genealogy';
const { Workbook } = ExcelJS;

const columns: [keyof Person, string][] = [
  ['id', 'Mã thành viên'], ['fullName', 'Họ và tên'], ['courtesyName', 'Tên chữ'],
  ['gender', 'Giới tính'], ['generation', 'Đời thứ'], ['status', 'Trạng thái'],
  ['birthYear', 'Năm sinh'], ['deathYear', 'Năm mất'], ['lunarDeathDate', 'Ngày giỗ âm'],
  ['branchName', 'Chi ngành'], ['tombLocation', 'Mộ phần'], ['currentResidence', 'Nơi ở'],
  ['isLineage', 'Thuộc huyết thống'],
  ['commonName', 'Tên thường gọi'], ['solarBirthDate', 'Ngày sinh dương lịch'],
  ['solarDeathDate', 'Ngày mất dương lịch'], ['lunarBirthDate', 'Ngày sinh âm lịch'],
  ['lunarDeathCanChi', 'Năm mất Can Chi'], ['orderInFamily', 'Thứ bậc trong gia đình'],
  ['avatarUrl', 'Đường dẫn ảnh đại diện'], ['birthPlace', 'Nơi sinh'], ['originPlace', 'Nguyên quán'],
  ['maternalClanName', 'Dòng họ bên ngoại'], ['maternalOriginPlace', 'Quê ngoại'],
  ['maternalFather', 'Cha bên ngoại'], ['maternalMother', 'Mẹ bên ngoại'],
  ['maternalNotes', 'Ghi chú bên ngoại'], ['biography', 'Tiểu sử'],
  ['achievements', 'Công trạng'], ['titles', 'Danh vị'],
];
const genders = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };
const statuses = { LIVING: 'Còn sống', DECEASED: 'Đã mất', UNKNOWN: 'Chưa rõ' };
const relationTypes = { MARRIAGE: 'Vợ chồng', BIOLOGICAL_PARENT: 'Cha mẹ ruột - con', ADOPTIVE_PARENT: 'Cha mẹ nuôi - con' };

function choice(sheet: ExcelJS.Worksheet, column: number, options: string[]) {
  // Apply choices to the full supported input range, including empty template rows.
  for (let row = 2; row <= 10001; row++) {
    sheet.getCell(row, column).dataValidation = {
      type: 'list', allowBlank: true, formulae: [`"${options.join(',')}"`],
      showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Lựa chọn không hợp lệ',
      error: 'Vui lòng chọn một giá trị trong danh sách.',
    };
  }
}

export async function createExcel(persons: Person[], relationships: Relationship[]) {
  const book = new Workbook();
  const sheet = book.addWorksheet('Thành viên');
  sheet.addRow(columns.map(([, label]) => label));
  persons.forEach(person => sheet.addRow(columns.map(([key]) => {
    const value = person[key];
    if (key === 'gender') return genders[person.gender];
    if (key === 'status') return statuses[person.status];
    if (key === 'isLineage') return person.isLineage ? 'Có' : 'Không';
    return Array.isArray(value) ? value.join('\n') : value ?? '';
  })));
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.columns.forEach(column => { column.width = 24; });
  sheet.getRow(1).font = { bold: true };
  choice(sheet, 4, Object.values(genders));
  choice(sheet, 6, Object.values(statuses));
  choice(sheet, 13, ['Có', 'Không']);
  const relations = book.addWorksheet('Quan hệ');
  relations.addRow(['Mã quan hệ', 'Loại quan hệ', 'Mã người thứ nhất', 'Mã người thứ hai', 'Ghi chú', 'Thứ tự hôn phối']);
  relationships.forEach(r => relations.addRow([r.id, relationTypes[r.type], r.fromPersonId, r.toPersonId, r.notes ?? '', r.marriageOrder ?? '']));
  choice(relations, 2, Object.values(relationTypes));
  relations.columns.forEach(column => { column.width = 28; });
  const help = book.addWorksheet('Hướng dẫn');
  help.addRow(['Bắt buộc: Họ và tên. Các thông tin khác có thể để trống nếu chưa biết.']);
  help.addRow(['Không cần tự tạo mã hệ thống. Để trống Mã thành viên để được cấp tự động.']);
  help.addRow(['Để nối quan hệ, tự đặt mã dễ nhớ như TV01, TV02 trong bảng Thành viên rồi dùng lại mã đó trong bảng Quan hệ. Mỗi người một mã riêng, không trùng mã đã có.']);
  help.addRow(['Giới tính, Trạng thái, Thuộc huyết thống và Loại quan hệ: chọn trong danh sách thả xuống.']);
  help.addRow(['Nếu bỏ trống: Giới tính = Khác, Trạng thái = Chưa rõ, Đời thứ = 1, Thuộc huyết thống = Có. Nên điền đúng đời để phả đồ xếp tầng chính xác.']);
  help.addRow(['Cha mẹ - con: người thứ nhất là cha hoặc mẹ, người thứ hai là con. Vợ chồng: hai người phối ngẫu. Mã quan hệ có thể để trống.']);
  help.addRow(['Ví dụ: Thành viên TV01 Nguyễn Văn An; TV02 Nguyễn Văn Bình. Quan hệ: Cha mẹ ruột - con | TV01 | TV02.']);
  help.addRow(['Công trạng và Danh vị: mỗi mục một dòng trong ô (Alt+Enter). Ngày tháng: nhập dạng văn bản để giữ nguyên thông tin.']);
  help.addRow(['CSV chỉ nhập thành viên. Lưu tệp dưới dạng UTF-8; Excel cũ .xls cần lưu lại thành .xlsx.']);
  help.getColumn(1).width = 110;
  help.getColumn(1).alignment = { wrapText: true, vertical: 'top' };
  help.eachRow(row => { row.height = 45; });
  return book.xlsx.writeBuffer();
}

export async function readExcel(file: File, treeId: string, existing: Person[]) {
  if (file.size > 10 * 1024 * 1024) throw new Error('Tệp vượt quá giới hạn 10 MB.');
  const book = new Workbook();
  if (/\.csv$/i.test(file.name)) {
    // ExcelJS uses Node streams for CSV; parse quoted UTF-8 CSV directly in the browser.
    const text = (await file.text()).replace(/^\uFEFF/, '');
    const delimiter = text.split(/\r?\n/)[0].includes(';') ? ';' : ',';
    const rows: string[][] = []; let row: string[] = []; let value = ''; let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted;
      } else if (!quoted && (c === delimiter || c === '\n' || c === '\r')) {
        row.push(value); value = '';
        if (c !== delimiter) { rows.push(row); row = []; if (c === '\r' && text[i + 1] === '\n') i++; }
      } else value += c;
    }
    if (quoted) throw new Error('CSV có dấu ngoặc kép chưa đóng.');
    if (value || row.length) { row.push(value); rows.push(row); }
    const sheet = book.addWorksheet('Thành viên'); rows.forEach(r => sheet.addRow(r));
  } else if (/\.xlsx$/i.test(file.name)) {
    await book.xlsx.load(await file.arrayBuffer());
  } else throw new Error('Chỉ hỗ trợ .xlsx và .csv. Hãy lưu tệp .xls thành .xlsx.');
  const sheet = book.getWorksheet('Thành viên') ?? book.worksheets[0];
  if (!sheet || sheet.rowCount < 2) throw new Error('Tệp chưa có dữ liệu thành viên.');
  const headers = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, index) => { headers.set(cell.text.trim(), index); });
  // Continue accepting previously exported files with technical column names.
  columns.forEach(([key, label]) => {
    const old = headers.get(key === 'id' ? 'ID' : key);
    if (!headers.has(label) && old) headers.set(label, old);
  });
  if (!headers.has('Họ và tên')) throw new Error('Thiếu cột Họ và tên. Hãy tải tệp mẫu.');
  const ids = new Set(existing.map(p => p.id));
  const persons: Person[] = [];
  sheet.eachRow((row, index) => {
    if (index === 1 || !row.hasValues) return;
    if (persons.length >= 10000) throw new Error('Mỗi lần nhập tối đa 10.000 thành viên.');
    const get = (label: string) => headers.has(label) ? row.getCell(headers.get(label)!).text.trim() : '';
    const fail = (message: string): never => { throw new Error(`Dòng ${index}: ${message}`); };
    const fullName = get('Họ và tên');
    if (!fullName) fail('Họ và tên không được trống.');
    const id = get('Mã thành viên') || crypto.randomUUID();
    if (ids.has(id)) fail(`Mã thành viên ${id} đã tồn tại. Không nhập để ghi đè thành viên.`);
    ids.add(id);
    const number = (label: string, fallback?: number) => {
      const text = get(label); if (!text) return fallback;
      const n = Number(text); if (!Number.isSafeInteger(n) || n < 1) fail(`${label} phải là số nguyên dương.`);
      return n;
    };
    const gender = ({ Nam: 'MALE', Nữ: 'FEMALE', Khác: 'OTHER' } as Record<string, string>)[get('Giới tính')] || get('Giới tính') || 'OTHER';
    const status = ({ 'Còn sống': 'LIVING', 'Đã mất': 'DECEASED', 'Chưa rõ': 'UNKNOWN' } as Record<string, string>)[get('Trạng thái')] || get('Trạng thái') || 'UNKNOWN';
    if (!['MALE', 'FEMALE', 'OTHER'].includes(gender)) fail('Giới tính không hợp lệ.');
    if (!['LIVING', 'DECEASED', 'UNKNOWN'].includes(status)) fail('Trạng thái không hợp lệ.');
    const lineage = get('Thuộc huyết thống').toLowerCase();
    if (lineage && !['có', 'không', 'true', 'false', '1', '0'].includes(lineage)) fail('Thuộc huyết thống: chọn Có hoặc Không.');
    const p: Person = { id, treeId, fullName, gender: gender as Person['gender'], status: status as Person['status'],
      generation: number('Đời thứ', 1)!, branchName: get('Chi ngành'), isLineage: !['không', 'false', '0'].includes(lineage),
      birthYear: number('Năm sinh'), deathYear: number('Năm mất') };
    if (p.birthYear && p.deathYear && p.deathYear < p.birthYear) fail('Năm mất trước năm sinh.');
    for (const [key, label] of columns) {
      if (key in p) continue;
      const value = get(label); if (!value) continue;
      if (key === 'achievements' || key === 'titles') {
        if (value.startsWith('[')) {
          try { const list: unknown = JSON.parse(value); if (!Array.isArray(list) || !list.every(v => typeof v === 'string')) fail(`${label}: mỗi mục một dòng.`); p[key] = list as string[]; }
          catch { fail(`${label}: mỗi mục một dòng.`); }
        } else p[key] = value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
      } else Object.assign(p, { [key]: value });
    }
    persons.push(p);
  });
  if (!persons.length) throw new Error('Không có thành viên để nhập.');
  const relationships: Relationship[] = [];
  book.getWorksheet('Quan hệ')?.eachRow((row, index) => {
    if (index === 1 || !row.hasValues) return;
    const label = row.getCell(2).text.trim();
    const type = (Object.entries(relationTypes).find(([, name]) => name === label)?.[0] ?? label) as Relationship['type'];
    const from = row.getCell(3).text.trim(), to = row.getCell(4).text.trim();
    if (!['MARRIAGE', 'BIOLOGICAL_PARENT', 'ADOPTIVE_PARENT'].includes(type) || !ids.has(from) || !ids.has(to) || from === to)
      throw new Error(`Quan hệ dòng ${index}: loại hoặc mã thành viên không hợp lệ. Hãy điền mã người thứ nhất và người thứ hai khớp bảng Thành viên.`);
    const order = row.getCell(6).text.trim();
    if (order && (!Number.isSafeInteger(Number(order)) || Number(order) < 1)) throw new Error(`Quan hệ dòng ${index}: thứ tự hôn phối không hợp lệ.`);
    relationships.push({ id: crypto.randomUUID(), treeId, type, fromPersonId: from, toPersonId: to, notes: row.getCell(5).text, marriageOrder: order ? Number(order) : undefined });
  });
  return { persons, relationships };
}
