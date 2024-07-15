const axios = require("axios");
const XLSX = require("xlsx");
require("dotenv").config();
// Define the API endpoint, parameters, and the Bearer token
const apiUrl = "https://vote.optimism.io/api/v1/projects";
const limit = 100; // Maximum limit for each request
let offset = 0; // Starting offset
let allData = []; // Array to store all the data
const bearerToken = "80963194-c250-4a37-921a-302bf50dee34"; // Replace with your actual Bearer token

// Function to fetch data from the API
const fetchData = async (offset, limit) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        limit: limit,
        offset: offset,
      },
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Main function to retrieve all data
const getAllData = async () => {
  let hasNext = true;

  while (hasNext) {
    const data = await fetchData(offset, limit);

    if (data && data.data && data.data.length > 0) {
      allData = allData.concat(data.data);
      offset += limit;
      hasNext = data.meta.has_next; // Assuming the API response has a meta field with a has_next property
    } else {
      hasNext = false;
    }
  }

  // Process the data into the desired format for the CSV
  const rows = allData.map((project) => ({
    project_id: project.id,
    team_id: project.team.join(", "),
  }));

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "FID");

  // Write the workbook to a CSV file
  XLSX.writeFile(workbook, "agoraTeamFID.csv");

  console.log("CSV file has been created successfully.");
};

// Run the main function
getAllData();
