const express = require("express");
const app = express();
const fs = require("fs");
const csv = require("csv-parser");

/**
 * GET /api/data
 * Returns JSON data from data.csv
 * Optional query: ?limit=N to limit number of rows returned
 *
 * Behavior:
 * 400 Bad Request if the 'limit' query parameter is invalid
 * 500 Internal Server Error if the CSV file is not found or cannot be read
 * 204 No Content if the CSV file is empty or has no valid data rows
 */
app.get("/api/data", (req, res) => {
  const parsedData = [];

  // Check if the 'limit' query parameter is provided and is a valid number
  const limitParam = req.query.limit;
  let limitRows;
  if (limitParam !== undefined) {
    limitRows = parseInt(limitParam);
    if (isNaN(limitRows) || limitRows <= 0) {
      return res.status(400).send("Bad Request: Invalid limit parameter");
    }
  }

  // Check if the data.csv file exists
  if (!fs.existsSync("data.csv")) {
    return res
      .status(500)
      .send("Internal Server Error: data.csv file not found");
  }

  // Check if file is empty
  const stats = fs.statSync("data.csv");
  console.log("File size:", stats.size);
  if (stats.size === 0) {
    return res.status(204).send();
  }

  // Read the CSV file and parse it
  fs.createReadStream("data.csv")
    .pipe(
      csv({
        separator: ";", // Use semicolon as the separator
        headers: true, // Use the first row as headers
        skipEmptyLines: true, // Skip empty lines in the CSV
      })
    )
    .on("data", (row) => {
      // Convert each row to an object with string values
      const values = Object.values(row);
      if (
        values.includes("id") &&
        values.includes("name") &&
        values.includes("age") &&
        values.includes("email")
      ) {
        return;
      }
      parsedData.push({
        id: values[0],
        name: values[1],
        age: values[2],
        email: values[3],
      }); // Push each row into the parsedData array
    })
    .on("end", () => {
      // Filter out rows that are completely empty
      const nonEmptyRows = parsedData.filter((row) =>
        Object.values(row).some((value) => value && value.trim() !== "")
      );

      // If no valid data rows, return 204 No Content
      if (nonEmptyRows.length === 0) {
        return res.status(204).send();
      }

      // If limitRows is specified, slice the array to return only the specified number of rows
      res.json(limitRows ? nonEmptyRows.slice(0, limitRows) : nonEmptyRows);
    })
    .on("error", (err) => {
      // Handle errors while reading the CSV file
      console.error("Error reading CSV file:", err);
      res.status(500).send("Internal Server Error: Failed to read CSV");
    });
});

// Export the app for use in server.js
module.exports = app;
