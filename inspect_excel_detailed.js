const XLSX = require('xlsx');

const filePath = 'c:\\Users\\USER\\Documents\\CHANDA SCHEDULE OCT.xlsx';

try {
    const workbook = XLSX.readFile(filePath);

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log(`\n=== ${sheetName} ===`);
        // Find a row that looks like a header (has multiple columns)
        let headerRowIdx = 0;
        for (let i = 0; i < Math.min(rows.length, 10); i++) {
            if (rows[i] && rows[i].filter(cell => cell).length > 5) {
                headerRowIdx = i;
                break;
            }
        }

        const headers = rows[headerRowIdx] || [];
        console.log('Detected Headers:', headers.filter(h => h));
        console.log('Row Index:', headerRowIdx);

        // Sample data from row after header
        const sampleRow = rows[headerRowIdx + 1] || [];
        console.log('Sample Row:', sampleRow);
    });
} catch (error) {
    console.error(error);
}
