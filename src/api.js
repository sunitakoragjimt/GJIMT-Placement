
// Google Apps Script bridge for Placement LMS.

// OLD Google Sheet: Students, Companies, Drives, etc.
export const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbz6MRtzzcGWMnxtO0tK4X89RotK4JUVyJLSE-UpHgxdfjQltHinwULCCHQl35tx_r3kVA/exec'

// NEW Google Sheet: Technical and Programming Results.
export const GOOGLE_RESULTS_API_URL = 'https://script.google.com/macros/s/AKfycbzTG_vneRXQKhCuUNbBL0rR3XMtuii0laDVYiJUKKOwwSOa4xB5lMmfq6QfxpFCBs5sGg/exec'

// Decide which Google Sheet to use.
function getApiUrl(sheet) {
  if (sheet === 'technicalResults' || sheet === 'programmingResults') {
    return GOOGLE_RESULTS_API_URL
  }

  return GOOGLE_SHEETS_API_URL
}

// Read data from the correct Google Sheet.
export function readSheet(sheet) {
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl(sheet)
    const callback = `placementLmsCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')

    const timer = window.setTimeout(
      () => finish(new Error('Google Sheets request timed out')),
      15000
    )

    function finish(error, data) {
      window.clearTimeout(timer)
      delete window[callback]
      script.remove()

      if (error) reject(error)
      else if (!data?.ok) reject(new Error(data?.error || 'Google Sheets read failed'))
      else resolve(data.rows || [])
    }

    window[callback] = (data) => finish(null, data)

    script.onerror = () => finish(
      new Error('Could not reach Google Apps Script. Check deployment access and URL.')
    )

    const params = new URLSearchParams({
      action: 'list',
      sheet,
      callback
    })

    script.src = `${apiUrl}?${params.toString()}`
    document.head.appendChild(script)
  })
}

// Save data to the correct Google Sheet.
export async function appendSheetRow(sheet, row) {
  const apiUrl = getApiUrl(sheet)

  await fetch(apiUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      sheet,
      row
    })
  })
}

export function mapStudent(row) {
  return {
    id: String(row.Student_ID || ''),
    name: String(row.Name || ''),
    rollNumber: String(row.Roll_Number || ''),
    email: String(row.Email || '').toLowerCase(),
    course: String(row.Course || ''),
    batch: String(row.Batch || ''),
    registeredAt: String(row.Created_At || ''),
  }
}

export function mapResult(row) {
  return {
    id: String(row.Result_ID || ''),
    testId: 'mca-aptitude-set-1',
    testName: String(row.Test_Name || ''),
    studentId: String(row.Student_ID || ''),
    studentName: String(row.Student_Name || ''),
    email: String(row.Email || '').toLowerCase(),
    rollNumber: String(row.Roll_Number || ''),
    score: Number(row.Score || 0),
    totalQuestions: Number(row.Total_Marks || row.Total_Questions || 0),
    percentage: Number(row.Percentage || 0),
    submittedAt: String(row.Submitted_At || ''),
    startedAt: '',
    durationSeconds: 0,
    autoSubmitted: false,
  }
}
