const xlsx = require('xlsx');

// Load the workbooks
const workbook1 = xlsx.readFile('./csv/main.xlsx');

// Get the first sheet from each workbook
const sheet1 = workbook1.Sheets['holders'];
const sheet2 = workbook1.Sheets['delegates'];
const sheet3 = workbook1.Sheets['badgeholders'];
const sheet4 = workbook1.Sheets['recipients'];


// Convert sheets to JSON
const holders = xlsx.utils.sheet_to_json(sheet1);
const delegates = xlsx.utils.sheet_to_json(sheet2);
const badgeholders = xlsx.utils.sheet_to_json(sheet3);
const recipients = xlsx.utils.sheet_to_json(sheet4)



// Create a map to store merged data by address
const mergedData = {};


// Merge data1 into the map
holders.forEach(row => {
  const address = row['holder'].toLowerCase();
  if (!mergedData[address]) {
    mergedData[address] = { Address: address };
  }
  Object.keys(row).forEach(key => {
    if (key !== 'holder') {
      mergedData[address][key] = row[key];
    }
  });
});

// Merge data2 into the map
delegates.forEach(row => {
  const address = row['Address'].toLowerCase();
  if (!mergedData[address]) {
    mergedData[address] = { Address: address };
  }
  Object.keys(row).forEach(key => {
    if (key !== 'Address') {
      mergedData[address][key] = row[key];
    }
  });
});

badgeholders.forEach(row => {
    const address = row['Addresses'].toLowerCase();
    if (!mergedData[address]) {
      mergedData[address] = { Address: address };
    }
    mergedData[address]['Badge'] = 1;
  });

recipients.forEach(row => {
const address = row['recipientAddress'].toLowerCase();
if (!mergedData[address]) {
  mergedData[address] = { Address: address };
  mergedData[address]['recipientAddress']=0
}
mergedData[address]['recipientAddress'] = 1;
});



// Convert the merged data back to an array
const mergedArray = Object.values(mergedData);

// Determine all unique columns
const allColumns = new Set();
mergedArray.forEach(row => {
  Object.keys(row).forEach(col => allColumns.add(col));
});

// Convert mergedArray to array of arrays, ensuring all columns are present
const header = Array.from(allColumns);
const dataWithAllColumns = [header].concat(
  // mergedArray.map(row => header.map(col => row[col] || ''))
  mergedArray.map(row => header.map(col => row[col] !== undefined ? row[col] : 0))

);

// Create a new workbook and sheet
const newWorkbook = xlsx.utils.book_new();
const newSheet = xlsx.utils.aoa_to_sheet(dataWithAllColumns);

// Append the new sheet to the workbook
xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'MergedData');

// Write the new workbook to a file
xlsx.writeFile(newWorkbook, './csv/merged_output.xlsx');

console.log('Merging complete. Output written to merged_output.xlsx');
