This repository contains the solution to the Software Engineering challenge proposed during a selection process. The challenge consists of developing an application in Node.js that calculates each student's situation based on their grades and frequency, using data from a Google Sheets spreadsheet.

Functionalities;

Reading data from a Google Sheets spreadsheet.
Calculation of each student's situation based on grade averages and frequency.
Updating the spreadsheet with calculated situations and notes for final approval (when applicable).

How to Run;

Install project dependencies:
npm install

install dotenv:
npm install dotenv

Create a .env file:
Create a file named ".env" in the root of your project directory. This file will store your sensitive credentials;

Configure your .env file:
Add the following environment variables to your .env file, replacing the placeholders with your own credentials:

GOOGLE_APPLICATION_CREDENTIALS="your_credentials_file.json"

Start the application:
npm start

Technologies Used
Node.js
Google Sheets API
GitHub Actions (for CI/CD)
Author
[Lucas Paulmbo] - [lucas.palumbo@outlook.com]

License
This project is licensed under the MIT License.
