const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "users.xlsx";

// Function to load existing data or create a new sheet
function loadData() {
  if (fs.existsSync(FILE_PATH)) {
    const workbook = XLSX.readFile(FILE_PATH);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
  }
  return [];
}

// Save data back to Excel
function saveData(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, FILE_PATH);
}

// POST API for signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  const users = loadData();
  users.push({ username, password, createdAt: new Date().toISOString() });

  saveData(users);
  res.json({ message: "User registered successfully!" });
});

// GET API for all users (Optional, for admin)
app.get("/users", (req, res) => {
  const users = loadData();
  res.json(users);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
