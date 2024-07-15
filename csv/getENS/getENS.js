const xlsx = require("xlsx");
const axios = require("axios");

// Function to fetch ENS name from the address
async function getENSName(address) {
  try {
    const url = `https://api.ensideas.com/ens/resolve/${address}`;
    const response = await axios.get(url);
    return response.data.name || "No ENS";
  } catch (e) {
    console.error(`Error fetching ENS name for address ${address}:`, e.message);
    return "Error";
  }
}

// Function to process each row and get ENS name
async function processRow(row) {
  const address = row["User"];
  console.log(`Processing address: ${address}`);
  if (address) {
    row["ENS Name"] = await getENSName(address);
  } else {
    row["ENS Name"] = "No Address";
  }
  return row;
}

// Function to process rows in batches
async function processBatch(batch) {
  const processedBatch = await Promise.all(batch.map(processRow));
  return processedBatch;
}

// Main function to process the XLSX file
async function processSheet(inputFilePath, outputFilePath, batchSize) {
  // Read the workbook
  const workbook = xlsx.readFile(inputFilePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // Process rows in batches
  let processedData = [];
  for (let i = 0; i < jsonData.length; i += batchSize) {
    const batch = jsonData.slice(i, i + batchSize);
    const processedBatch = await processBatch(batch);
    processedData = processedData.concat(processedBatch);
  }

  // Convert JSON back to sheet
  const newSheet = xlsx.utils.json_to_sheet(processedData);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, sheetName);

  // Write the updated workbook to a new file
  xlsx.writeFile(newWorkbook, outputFilePath);
}

// Run the script
const inputFilePath = "./data.xlsx"; // Path to your input file
const outputFilePath = "./output.xlsx"; // Path to your output file
const batchSize = 100; // Number of rows to process in parallel

processSheet(inputFilePath, outputFilePath, batchSize)
  .then(() => console.log("Processing complete!"))
  .catch((error) => console.error("Error processing sheet:", error));
