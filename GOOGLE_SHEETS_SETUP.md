# Google Sheets connection – Placement LMS

The React app uses the Google Apps Script Web App connected explicitly to spreadsheet ID `1PxYCRtdNP1EoWgxbgIo-rN9rdltX61brTMCnOOs25-0`. Google Sheets is the source of truth for student profiles: registration writes to the `Students` tab, and the app loads/reloads the student list from that tab without merging browser-cached student profiles. It syncs student registrations to the `Students` tab, aptitude results to `Test Results`, technical MCQ attempts to `Technical MCQ Results`, programming submissions to `Programming Results`, company placement report records to `Companies`, and coordinator-created jobs to `Placement Drives`. The updated Admin area also supports updating and deleting company / drive rows by ID.

## 1. Update the Apps Script code
1. Open the Google Sheet that should hold Placement LMS data.
2. Choose **Extensions → Apps Script**.
3. Replace the editor code with `GOOGLE_SHEETS_BACKEND_Code.gs` from this project.
4. Save the project.
5. Select `setupDatabase` in the function list and click **Run** once. Approve the requested spreadsheet permissions. This creates/updates the required tabs and headers.

## 2. Redeploy the existing Web App
1. In Apps Script choose **Deploy → Manage deployments**.
2. Edit the existing Web App deployment (pencil icon).
3. Select **New version** and deploy.
4. Keep the same deployment URL if possible. The frontend currently uses the URL provided for this LMS.
5. Confirm the deployment's access setting is appropriate for your institution before sharing the LMS.

## 3. Run the LMS
From the extracted `placement-lms-starter` folder:

```cmd
npm install
npm run dev
```

Open the local Vite URL printed in CMD, normally `http://localhost:5173`.

## 4. Test the connection safely
1. Open the LMS and register one test student using dummy details.
2. Open the linked Google Sheet and check the `Students` tab.
3. Submit an aptitude test and check `Test Results`.
4. Submit a Technical MCQ attempt and check `Technical MCQ Results`.
5. Submit a Programming Test response and check `Programming Results`.
4. Open the Admin dashboard and confirm the shared student and result counts appear.
5. Add a test company and a test placement drive, then confirm the rows appear in `Companies` and `Placement Drives`. Edit and delete the test rows to verify update/delete actions.

## Important limitations and security
- This version syncs student profile fields (name, roll number, email, course, batch) and aptitude test results. It does **not** send student passwords to Google Sheets.
- Student login is still the existing demo/local-browser login. A student account created on one browser will not authenticate on a different computer. Cross-device student authentication needs a proper server-side identity system (for example Firebase Authentication or Google Identity) and authorization rules.
- The included demo Admin login is hard-coded in the frontend. Do not use the demo credentials for real institutional administration.
- The starter Apps Script `list` endpoint returns sheet rows to whoever can access the Web App. If deployed as **Anyone**, student names, roll numbers and emails may be publicly readable by people who obtain the URL. Do not put sensitive/confidential data in this prototype or make it public for live institutional use. Before real deployment, implement authenticated admin-only reads and student-scoped access.
- The browser uses an Apps Script JSONP read and a simple POST. The POST response is opaque due to Apps Script cross-origin redirects; the app refreshes the sheet to check that records become visible. Always verify the test row in Google Sheets before using it with a class.
- The URL is included in `src/api.js`. If the deployment URL changes, update `GOOGLE_SHEETS_API_URL` there and rebuild/restart Vite.


## Student profile storage note
- Student profile fields (name, roll number, email, course, batch, registration date) are stored in and fetched from the Google Sheet `Students` tab.
- For this starter build, the student password is deliberately not written to Google Sheets; the password check remains in the same browser's local storage. Therefore, a student who registers on one browser can log in on that same browser, but cross-device login requires a proper authentication service such as Firebase Authentication.
- Existing student profiles already in local browser storage are not automatically copied to the Sheet. Import/migrate them to the `Students` tab if they need to appear in the shared roster.
