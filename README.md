# react-ui-spreadsheet-app

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/dhakary/react-ui-spreadsheet-app)

React Spreadsheet Application

This is a simple spreadsheet application built with React that allows users to:
1. Display a grid of editable cells.
2. Add more rows and columns dynamically.
3. Insert formulas like SUM and AVERAGE.
4. Copy and paste cells.
5. Save and load the spreadsheet as a JSON file.
6. Format cells with numbers and validate input.

Features
1. Grid Display
    A default 10x10 grid of cells is displayed.
    Each cell can be clicked and edited by typing numbers.
2. Add Rows and Columns
    Use the Add Row and Add Column buttons to dynamically extend the grid.
3. Formulas
    You can insert formulas (SUM or AVERAGE) into a cell by clicking on the appropriate button.
    The formula is recalculated when the values of the dependent cells change.
    Example formulas:
    =SUM(A1:A5) – Sums the values from cells A1 to A5.
    =AVERAGE(B1:B3) – Calculates the average of values from cells B1 to B3.
4. Copy and Paste Cells
    Select multiple cells, click the Copy button, and then select the starting cell where you want to paste the copied cells. Click the Paste button to paste the copied values.
5. Save and Load Spreadsheet
6. Save the current spreadsheet to a JSON file by clicking the Save button.
7. Load a previously saved spreadsheet from a JSON file by selecting a file with the Choose File button.

Future Enhancements
1. Formatting cells with bold text and background color.

Project Setup
Prerequisites
Before you begin, make sure you have the following installed:
Node.js (v14 or higher)
npm (comes with Node.js)

Getting Started
Run the following command to install the project dependencies: npm install
Run the app:
npm start
The app should now be running on http://localhost:3000.

Project Structure
Here’s a brief overview of the important files in the project:
├── public/
│ └── index.html # Main HTML file
├── src/
│ ├── App.js # App entry point, rendering Spreadsheet
│ ├── components/
│ │ └── Spreadsheet.js # Main spreadsheet component
│ └── SpreadSheet.css # Styling for the spreadsheet
├── README.md # Project instructions (this file)
├── package.json # Project metadata and dependencies
└── package-lock.json # Exact versions of installed dependencies

License
This project is open-source and available under the MIT License.
