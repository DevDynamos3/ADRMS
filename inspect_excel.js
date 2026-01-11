const XLSX = require('xlsx');
const path = require('path');

const filePath = 'c:\\Users\\USER\\Documents\\CHANDA SCHEDULE OCT.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log(`\n--- ${sheetName} ---`);
        if (jsonData.length > 0) {
            console.log('Columns:', jsonData[0]);
            console.log('Sample Data Row 1:', jsonData[1] || 'No data');
            console.log('Total Rows:', jsonData.length);
        } else {
            console.log('Empty Sheet');
        }
    });
} catch (error) {
    console.error('Error reading excel file:', error.message);
}
