const XLSX = require('xlsx');

// Load the workbook
const workbook = XLSX.readFile('./points.xlsx');
const sheet = workbook.Sheets['UpdatedSheet']; // Replace 'yourSheetName' with your actual sheet name

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(sheet);

// Add new columns based on conditions
function determineTypeName(row) {
    const holder = row['holderPoints'] ? row['holderPoints'] : 0;
    const delegate = row['delegatePoints'] ? row['delegatePoints']  : 0;
    const recipient = row['recipientsPoints'] ? row['recipientsPoints'] : 0;
    const badgeHolder = row['badgeholderPoints'] ? row['badgeholderPoints'] : 0;
    const typeName= "null";
   
    
  
    if (badgeHolder!==0 && delegate!==0 && recipient!==0 && holder!==0) return {badgeHolder,delegate:0,recipient:0,holder,typeName:"B+H"};
    if (badgeHolder!==0 && delegate!==0 && recipient!==0 && holder===0) return {badgeHolder,delegate:0,recipient:0,holder:0,typeName:"B"};
    if (badgeHolder!==0 && delegate!==0 && recipient===0 && holder!==0) return {badgeHolder,delegate:0,recipient:0,holder,typeName:"B+H"};
    if (badgeHolder!==0 && delegate!==0 && recipient===0 && holder===0) return {badgeHolder,delegate:0,recipient:0,holder:0,typeName:"B"};
    if (badgeHolder!==0 && delegate===0 && recipient!==0 && holder!==0) return {badgeHolder,delegate:0,recipient:0,holder,typeName:"B+H"};
    if (badgeHolder!==0 && delegate===0 && recipient!==0 && holder===0) return {badgeHolder,delegate:0,recipient:0,holder:0,typeName:"B"};
    if (badgeHolder!==0 && delegate===0 && recipient===0 && holder!==0) return {badgeHolder,delegate:0,recipient:0,holder,typeName:"B+H"};
    if (badgeHolder!==0 && delegate===0 && recipient===0 && holder===0) return {badgeHolder,delegate:0,recipient:0,holder:0,typeName:"B"};
    if (badgeHolder===0 && delegate!==0 && recipient!==0 && holder!==0) return {badgeHolder:0,delegate,recipient:0,holder:0,typeName:"D"};
    if (badgeHolder===0 && delegate!==0 && recipient!==0 && holder===0) return {badgeHolder:0,delegate,recipient:0,holder:0,typeName:"D"};
    if (badgeHolder===0 && delegate!==0 && recipient===0 && holder!==0) return {badgeHolder:0,delegate,recipient:0,holder:0,typeName:"D"};
    if (badgeHolder===0 && delegate!==0 && recipient===0 && holder===0) return {badgeHolder:0,delegate,recipient:0,holder:0,typeName:"D"};
    if (badgeHolder===0 && delegate===0 && recipient!==0 && holder!==0) return {badgeHolder:0,delegate:0,recipient,holder,typeName:"R+H"};
    if (badgeHolder===0 && delegate===0 && recipient!==0 && holder===0) return {badgeHolder:0,delegate:0,recipient,holder:0,typeName:"R"};
    if (badgeHolder===0 && delegate===0 && recipient===0 && holder!==0) return {badgeHolder:0,delegate:0,recipient:0,holder,typeName:"H"};
    return {badgeHolder:0,delegate:0,recipient:0,holder:0,typeName};
  }

  const updatedData = data.map(row => {
    const {holder,delegate,recipient,badgeHolder,typeName}=determineTypeName(row)
    return {
      'User':row.User,
      'New holderPoints': holder,
      'New delegatePoints': delegate,
      'New recipientsPoints': recipient,
      'New badgeholderPoints': badgeHolder,
      'Type Name':typeName,
      'holderType': holder==0 ? 'null':row['holderType'],
      'delegateType': delegate==0 ? 'null':row['delegateType'],
      'holderAmount': holder==0 ? 0:row['holderAmount'],
      'delegateAmount': delegate==0 ? 0:row['Voting Power'],
    };
  });

//   console.log(updatedData)
// Convert the updated data back to a worksheet
const newSheet = XLSX.utils.json_to_sheet(updatedData);

// Add the new sheet to the workbook
const newworkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newworkbook, newSheet, 'GriffLogicSheet');

// Write the workbook to a new file
XLSX.writeFile(newworkbook, './griffLogic.xlsx');
