# Placement LMS – MCA Aptitude Set-1

React + Vite placement assessment portal. This package preserves the existing UI and includes the latest 50-question MCA Aptitude Test Set-1 question bank (60-minute timer), student registration/login demo, student dashboard, administrator dashboard and CSV result export. The Admin / Placement Coordinator area now includes an 18-company placement report, status summary, company add/edit/delete, placement-drive creation, eligibility fields, and email sharing to registered student addresses. Student registration, student login, aptitude test and result flow are retained from the uploaded version.

## Run on Windows
1. Install Node.js LTS (https://nodejs.org/).
2. Extract this ZIP.
3. Open the `placement-lms-starter` folder.
4. Double-click `START_LMS.bat` (or open Command Prompt in this folder and run `npm install` followed by `npm run dev`).
5. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Demo admin (local demo only)
- Email: `admin@placementlms.local`
- Password: `Admin@123`

## Google Sheets integration
The frontend is configured with the supplied Apps Script Web App URL. Student profile submissions and MCA aptitude test results are sent to Google Sheets. Admin company records and placement drives can also sync to the `Companies` and `Placement Drives` tabs after the updated Apps Script backend is deployed. Follow `GOOGLE_SHEETS_SETUP.md` to update and redeploy the Apps Script backend before testing.

**Important:** this is a prototype data-sync integration, not production authentication. Student passwords are not sent to Sheets, and student login remains browser-local. The demo admin login is hard-coded. The Apps Script list endpoint may expose student records to anyone who can access the deployment. Review the security notes in `GOOGLE_SHEETS_SETUP.md` before using real student data.

## New assessment modules (integration build)
- Student dashboard now has Available Tests and My Test Results views.
- Technical MCQ track selection is prepared with the six exact names: Web Development, AI Engineer, Cloud Engineer, Software Developer (SDE), Data Analytics, Cyber Security. Track cards include subject icons.
- Each test has an independent six-hour retest cooldown. Every submitted attempt is retained with an attempt number and next-retest timestamp.
- Programming Test submissions are routed to a separate Google Sheets tab (`Programming Results`); technical MCQ attempts are routed to `Technical MCQ Results`.
- Student result history includes a print action.

**Question-bank note:** The six-track selector and question-runner integration are prepared. The original 300 MCQ records still need to be imported into `src/data/technicalQuestions.js`; the file currently has the six track definitions but no question records. The UI intentionally disables starting an empty track rather than showing invented, altered, or incomplete questions. Do not use this build for student testing until all 50 original questions and answer keys have been loaded into each track.
