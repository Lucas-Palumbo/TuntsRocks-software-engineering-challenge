
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config(); //Load environment variables from .env file


console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Read the contents of the JSON file
const credentialsFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const credentialsFileContents = fs.readFileSync(credentialsFilePath, 'utf8');

// Parse the content of the JSON file
const credentials = JSON.parse(credentialsFileContents);

// Configure authentication
const auth = new google.auth.GoogleAuth({
  credentialsFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create Google Sheets API client instance
const sheets = google.sheets({ version: 'v4', auth });

// Function to calculate the situation of each student
async function calculateStudentSituation() {
  try {
    // Read data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1g86631KmtRwSDqbHMHG5B9D64fw1_JPhUnB4QOuxcJw',
      range: 'A4:H27', // Range containing student data, including results
    });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    // Iterate over student data and calculate the situation for each one
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const matricula = row[0];
      const nome = row[1];
      const faltas = parseInt(row[2]);
      const p1 = parseFloat(row[3])/10;
      const p2 = parseFloat(row[4])/10;
      const p3 = parseFloat(row[5])/10;

      const numAulas = 60; // Total number of classes in the semester
      const limiteFaltas = numAulas * 0.25; // 25% of the total number of classes

      // Calculate average of grades
      const media = (p1 + p2 + p3) / 3;
      // Check situation based on absences
      let situacao = '';
      if (faltas > limiteFaltas) {
        situacao = 'Reprovado por Falta';
      } else {
        // Check situation based on average
        if (media < 5) {
          situacao = 'Reprovado por Nota';
        } else if (media < 7) {
          situacao = 'Exame Final';
        } else {
          situacao = 'Aprovado';
        }
      }

      // Calculate Final Exam Grade if necessary
      let naf = 0;
      if (situacao === 'Exame Final') {
        naf = Math.ceil((7 - media) * 2);
      } else if (situacao === 'Reprovado por Nota') {
        naf = Math.ceil((5 - media) * 2);
      }

      // Write results back to the spreadsheet
      const values = [
        [situacao, naf]
      ];
      const writeResponse = await sheets.spreadsheets.values.update({
        spreadsheetId: '1g86631KmtRwSDqbHMHG5B9D64fw1_JPhUnB4QOuxcJw',
        range: `G${i + 4}:H${i + 4}`, // Columns G and H for the result
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(`Situation of ${matricula} - ${nome} calculated and written to the spreadsheet.`);
    }
  } catch (error) {
    console.error('Error calculating student situations:', error);
  }
}

// Call the main function
calculateStudentSituation();
