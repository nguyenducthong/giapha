import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import ExcelJS from 'exceljs';
const { Workbook } = ExcelJS;

const source = await readFile(new URL('../src/utils/excel.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  .replace("from 'exceljs'", `from '${import.meta.resolve('exceljs')}'`);
const { createExcel, readExcel } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const people = [
  { id: 'a', treeId: 'tree', fullName: 'Nguyễn "Văn", A', gender: 'OTHER', status: 'UNKNOWN', generation: 1, branchName: 'Chi 1', isLineage: false, biography: 'Dòng 1\nDòng 2', titles: ['Thủy tổ'] },
  { id: 'b', treeId: 'tree', fullName: 'Nguyễn B', gender: 'FEMALE', status: 'LIVING', generation: 2, branchName: '', isLineage: true },
];
const relations = [{ id: 'r', treeId: 'tree', type: 'ADOPTIVE_PARENT', fromPersonId: 'a', toPersonId: 'b', notes: 'Con nuôi' }];
const file = new File([await createExcel(people, relations)], 'test.xlsx');
const parsed = await readExcel(file, 'tree', []);
assert.deepEqual(JSON.parse(JSON.stringify(parsed.persons)), people);
assert.equal(parsed.relationships[0].type, 'ADOPTIVE_PARENT');
assert.equal(parsed.relationships[0].fromPersonId, 'a');
await assert.rejects(readExcel(file, 'tree', people), /đã tồn tại/);
const csv = new File(['\uFEFFHọ và tên,Đời thứ,Giới tính\r\n"Nguyễn ""A"", B\nC",2,Nữ'], 'test.csv');
assert.equal((await readExcel(csv, 'tree', [])).persons[0].fullName, 'Nguyễn "A", B\nC');
await assert.rejects(readExcel(new File(['Tên\nA'], 'bad.csv'), 'tree', []), /Thiếu cột/);
await assert.rejects(readExcel(new File(['Họ và tên,Đời thứ\nA,-1'], 'bad.csv'), 'tree', []), /số nguyên dương/);
const invalid = new Workbook();
await invalid.xlsx.load(await file.arrayBuffer());
invalid.getWorksheet('Quan hệ').getCell('D2').value = 'missing';
await assert.rejects(readExcel(new File([await invalid.xlsx.writeBuffer()], 'bad.xlsx'), 'tree', []), /mã thành viên/);
const template = new Workbook();
await template.xlsx.load(await createExcel([], []));
const memberSheet = template.getWorksheet('Thành viên');
assert.equal(memberSheet.getCell('D2').dataValidation.formulae[0], '"Nam,Nữ,Khác"');
assert.equal(memberSheet.getCell('M2').dataValidation.formulae[0], '"Có,Không"');
assert.equal(template.getWorksheet('Quan hệ').getCell('B2').dataValidation.formulae[0], '"Vợ chồng,Cha mẹ ruột - con,Cha mẹ nuôi - con"');
await assert.rejects(readExcel(new File([await template.xlsx.writeBuffer()], 'empty.xlsx'), 'tree', []), /Không có thành viên/);
memberSheet.getCell('A2').value = 'TV01'; memberSheet.getCell('B2').value = 'Nguyễn An';
memberSheet.getCell('A3').value = 'TV02'; memberSheet.getCell('B3').value = 'Nguyễn Bình';
memberSheet.getCell('B4').value = 'Nguyễn Chi';
const relSheet = template.getWorksheet('Quan hệ');
relSheet.getCell('B2').value = 'Cha mẹ ruột - con';
relSheet.getCell('C2').value = 'TV01'; relSheet.getCell('D2').value = 'TV02';
const manual = await readExcel(new File([await template.xlsx.writeBuffer()], 'manual.xlsx'), 'tree', []);
assert.equal(manual.persons.length, 3);
assert.match(manual.persons[2].id, /^[0-9a-f-]{36}$/);
assert.equal(manual.relationships[0].type, 'BIOLOGICAL_PARENT');
assert.equal(manual.relationships[0].fromPersonId, 'TV01');
console.log('PASS: Excel round trip, Unicode, optional fields, adoptive relations, duplicate IDs, quoted CSV, invalid headers, years and references.');
