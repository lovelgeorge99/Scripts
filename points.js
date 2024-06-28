const XLSX = require('xlsx');

// Load the workbook and the specific sheet
const workbook = XLSX.readFile('./merged_output.xlsx');
const sheet = workbook.Sheets['MergedData'];  // Replace with your sheet name

// Convert the sheet to JSON

const data = XLSX.utils.sheet_to_json(sheet);

// Add new columns based on the conditions for both holders and delegates
const updatedData = data.map(row => {
  let newHolderPoint = 0;
  let newHolderType = "null";
  let newDelegatePoint = 0;
  let newDelegateType = "null";

  // Calculate Holder Points and Type
  if (row.Balance >= 10000000) {
    newHolderPoint = 100;
    newHolderType = 'Whale';
  } else if (row.Balance >= 1000000) {
    newHolderPoint = 50;
    newHolderType = 'Diamond';
  } else if (row.Balance >= 100000) {
    newHolderPoint = 25;
    newHolderType = 'Platinum';
  } else if (row.Balance >= 10000) {
    newHolderPoint = 15;
    newHolderType = 'Gold';
  } else if (row.Balance >= 1000) {
    newHolderPoint = 5;
    newHolderType = 'Silver';
  } else if (row.Balance >= 500) {
    newHolderPoint = 3;
    newHolderType = 'Bronze';
  } else {
    newHolderPoint = 0;
  }

  // Calculate Delegate Points and Type
  if (row['Voting Power'] >= 1000000) {
    newDelegatePoint = 8;
    newDelegateType = 'Diamond';
  } else if (row['Voting Power'] >= 100000) {
    newDelegatePoint = 5;
    newDelegateType = 'Platinum';
  } else if (row['Voting Power'] >= 15000) {
    newDelegatePoint = 3;
    newDelegateType = 'Gold';
  } else if (row['Voting Power'] >= 5000) {
    newDelegatePoint = 2;
    newDelegateType = 'Silver';
  } else if (row['Voting Power'] >= 2500) {
    newDelegatePoint = 1;
    newDelegateType = 'Bronze';
  } else {
    newDelegatePoint = 0;
  }

  return {
    ...row,
    'holderPoints': newHolderPoint,
    'holderType': newHolderType,
    'delegatePoints': newDelegatePoint,
    'delegateType': newDelegateType
  };
});

// // Reorder the columns
const reorderedData = updatedData.map(row => ({
    'User': row.Address,
    'holderPoints': row['holderPoints'],
    'delegatePoints': row['delegatePoints'],
    'badgeholderPoints':row['Badge']==1 ? 1:0,
    'recipientAddress':row['recipientAddress']==1 ? 1:0,
    'holderType': row['holderType'],
    'delegateType': row['delegateType'],
    'holderAmount': row.Balance,
    'Voting Power': row['Voting Power'],
    
    
    
  }));


// Convert the updated JSON back to a sheet
const newSheet = XLSX.utils.json_to_sheet(reorderedData);

// Append the new sheet to the workbook
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'UpdatedSheet');

// Write the new workbook to a file
XLSX.writeFile(newWorkbook, './points.xlsx');

console.log("New columns added and file saved successfully.");
