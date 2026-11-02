import { useEffect, useMemo, useState } from 'react'
import { aptitudeQuestions } from './data/questions.js'
import { technicalTracks } from './data/technicalQuestions.js'
import { appendSheetRow, readSheet, mapStudent, mapResult, GOOGLE_SHEETS_API_URL } from './api.js'
import {
  GraduationCap,
  Code2,
  Brain,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  Users,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  UserRound,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Printer,
  RefreshCw,
  Download,
  Mail,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  BrainCircuit,
  Cloud,
  Laptop,
  ChartColumn
} from 'lucide-react'
import { programmingTracks } from './data/programmingQuestion.js'
const STUDENTS_KEY = 'placement_lms_students_v1'
const STUDENT_AUTH_KEY = 'placement_lms_student_auth_v1'
const RESULTS_KEY = 'placement_lms_results_v1'
const COMPANIES_KEY = 'placement_lms_companies_v1'
const DRIVES_KEY = 'placement_lms_drives_v1'
const SESSION_KEY = 'placement_lms_session_v1'
const ADMIN_EMAIL = 'admin@placementlms.local'
const ADMIN_PASSWORD = 'Admin@123'
const GOOGLE_RESULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1PxYCRtdNP1EoWgxbgIo-rN9rdltX61brTMCnOOs25-0/edit'
const GOOGLE_RESULT_SHEET_DOWNLOAD_URL = 'https://docs.google.com/spreadsheets/d/1PxYCRtdNP1EoWgxbgIo-rN9rdltX61brTMCnOOs25-0/export?format=xlsx'

function loadStudentCredentials() {
  const saved = readStorage(STUDENT_AUTH_KEY, {})
  const legacyStudents = readStorage(STUDENTS_KEY, [])
  const legacyCredentials = Object.fromEntries(legacyStudents.filter((s) => s.email && s.password).map((s) => [String(s.email).toLowerCase(), s.password]))
  return { ...legacyCredentials, ...saved }
}
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function mergeById(remote, local) {
  const merged = new Map()
  for (const item of remote) if (item.id) merged.set(item.id, item)
  for (const item of local) if (item.id) merged.set(item.id, { ...merged.get(item.id), ...item })
  return [...merged.values()]
}

function mapTechnicalResult(row) { return { id:String(row.Result_ID||''), testId:String(row.Test_ID||''), testName:String(row.Test_Name||''), testType:String(row.Test_Type||'technical'), studentId:String(row.Student_ID||''), studentName:String(row.Student_Name||''), email:String(row.Email||'').toLowerCase(), rollNumber:String(row.Roll_Number||''), score:Number(row.Score||0), totalQuestions:Number(row.Total_Questions||0), percentage:Number(row.Percentage||0), startedAt:String(row.Started_At||''), submittedAt:String(row.Submitted_At||''), durationSeconds:Number(row.Duration_Seconds||0), autoSubmitted:String(row.Auto_Submitted||'')==='Yes', attemptNumber:Number(row.Attempt_Number||1), answers: (()=>{try{return JSON.parse(row.Answers_JSON||'{}')}catch{return {}}})() } }
function mapProgrammingResult(row) { return mapTechnicalResult({...row, Test_Type:row.Test_Type||'programming'}) }


const DEFAULT_COMPANIES = [
  ['Assa Abloy','MBA III','4–5 LPA','', 'Process in progress'],
  ['Bajaj Housing Finance Ltd.','BBA V, B.Com Hons.V, MBA III','3 LPA','4','Complete process, selections done / offer letters released'],
  ['Berkeley Skoda','BBA V, B.Com Hons.V, MBA III','5.1 LPA','', 'Process in progress'],
  ['Eclerx','All Programs','2.83 LPA + incentives + benefits','9 shortlisted','Process going on positively'],
  ['HDFC Life','MBA III','4.75 LPA + incentives','', 'Process in progress'],
  ['HIKE Education','MBA III','7.5 LPA','1','Complete process, selections done / offer letters released'],
  ['Himalaya Wellness','MBA III','4.5 LPA','', 'Process in progress'],
  ['ICICI Bank','MBA III','Not specified','', 'Placement process yet to start'],
  ['Intelorides','MBA III','13.5 LPA','', 'Placement process yet to start'],
  ['Learning routes','BBA V, MBA III','6.06 LPA PG, 5.70 UG','', 'Placement process yet to start'],
  ['Learningshala','BBA V, MBA III','8 LPA','2','Complete process, selections done / offer letters released'],
  ['Manipal Signa','MBA III','4 LPA','', 'Placement process yet to start'],
  ['Naukri.com','MBA III','6.02 LPA','', 'Placement process yet to start'],
  ['Realty Assistant','BBA V, B.Com Hons.V, MBA III','7.2 LPA PG, 5.5 UG','', 'Process in progress'],
  ['Revvlocity','BBA V, B.Com Hons.V, MBA III','3.5 LPA','', 'Done, no selection'],
  ['Safety Circle','BBA V, MBA III','4–5.5 LPA','7','Complete process, selections done / offer letters released'],
  ['SBI General','MBA III','3.5 LPA','', 'Process going on positively'],
  ['STPL3D','MBA III','3–6 LPA','', 'Placement process yet to start'],
].map(([name, programs, packageText, selections, status]) => ({ id: makeSeedId(name), name, programs, packageText, selections, status, remarks: name === 'Eclerx' ? '9 shortlisted for final operations round after main exams' : '' }))
function makeSeedId(name) { return `seed-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
const STATUS_OPTIONS = ['Complete process, selections done / offer letters released','Process going on positively','Process in progress','Done, no selection','Placement process yet to start']

function mapCompanyRow(row) { return { id: String(row.Company_ID || makeSeedId(row.Company_Name || 'company')), name: String(row.Company_Name || ''), programs: String(row.Programs_Included || ''), packageText: String(row.Pay_Package || ''), selections: String(row.Selections || ''), status: String(row.Status || 'Placement process yet to start'), remarks: String(row.Remarks || ''), website: String(row.Website || '') } }
function mapDriveRow(row) { return { id: String(row.Drive_ID || makeSeedId(row.Company_Name || 'drive')), company: String(row.Company_Name || ''), website: String(row.Website || ''), registrationLink: String(row.Registration_Link || ''), location: String(row.Job_Location || ''), programs: String(row.Eligible_Programs || ''), profile: String(row.Job_Profile || ''), specialization: String(row.Specialization || ''), vacancies: String(row.Vacancies || ''), selectionProcess: String(row.Selection_Process || ''), mode: String(row.Mode || ''), cutoff10: String(row.Cutoff_Class_X || ''), cutoff12: String(row.Cutoff_Class_XII || ''), cutoffGrad: String(row.Cutoff_Graduation || ''), cutoffPG: String(row.Cutoff_PG || ''), backlogs: String(row.Active_Backlogs || ''), packageText: String(row.CTC_Stipend || ''), graduationDetails: String(row.Graduation_Details || ''), createdAt: String(row.Created_At || '') } }

export default function App() {
  const [session, setSession] = useState(() => readStorage(SESSION_KEY, null))
  const [page, setPage] = useState('home')
  const [notice, setNotice] = useState('')
  const [students, setStudents] = useState([])
  // Student profiles are fetched from Google Sheets. Only same-browser login credentials remain local.
  const [studentCredentials, setStudentCredentials] = useState(() => loadStudentCredentials())
  const [results, setResults] = useState(() => readStorage(RESULTS_KEY, []))
  const [companies, setCompanies] = useState(() => readStorage(COMPANIES_KEY, DEFAULT_COMPANIES))
  const [drives, setDrives] = useState(() => readStorage(DRIVES_KEY, []))
  const [activeTest, setActiveTest] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [refreshingSheet, setRefreshingSheet] = useState(false);

  useEffect(() => {
    let active = true
    Promise.all([readSheet('students'), readSheet('results'), readSheet('companies').catch(() => []), readSheet('drives').catch(() => []), readSheet('technicalResults').catch(() => []), readSheet('programmingResults').catch(() => [])])
      .then(([studentRows, resultRows, companyRows, driveRows, technicalRows, programmingRows]) => {
        if (!active) return
        const remoteStudents = studentRows.map(mapStudent)
        const remoteResults = [...resultRows.map(mapResult), ...technicalRows.map(mapTechnicalResult), ...programmingRows.map(mapProgrammingResult)]
        setStudents(remoteStudents)
        setResults((local) => mergeById(remoteResults, local))
        if (companyRows.length) setCompanies(companyRows.map(mapCompanyRow))
        if (driveRows.length) setDrives(driveRows.map(mapDriveRow))
        setNotice('Google Sheets connected. Shared student records and test results loaded.')
      })
      .catch((error) => {
        if (active) setNotice(`Google Sheets connection issue: ${error.message}. Check the Apps Script deployment and setup guide.`)
      })
    return () => { active = false }
  }, [])

  async function refreshGoogleSheetData() {
    setRefreshingSheet(true)
    try {
      const [studentRows, resultRows, technicalRows, programmingRows] = await Promise.all([
        readSheet('students'), readSheet('results'),
        readSheet('technicalResults'), readSheet('programmingResults'),
      ])
      setStudents(studentRows.map(mapStudent))
      const sheetResults = [...resultRows.map(mapResult), ...technicalRows.map(mapTechnicalResult), ...programmingRows.map(mapProgrammingResult)]
      setResults((local) => mergeById(sheetResults, local))
      setNotice(`Google Sheet refreshed. ${studentRows.length} student rows and ${sheetResults.length} result rows loaded.`)
    } catch (error) {
      setNotice(`Could not refresh Google Sheet data: ${error.message}. Check that the Apps Script deployment is connected to the supplied spreadsheet.`)
    } finally {
      setRefreshingSheet(false)
    }
  }

  useEffect(() => { localStorage.removeItem(STUDENTS_KEY) }, [])
  useEffect(() => writeStorage(STUDENT_AUTH_KEY, studentCredentials), [studentCredentials])
  useEffect(() => writeStorage(RESULTS_KEY, results), [results])
  useEffect(() => writeStorage(COMPANIES_KEY, companies), [companies])
  useEffect(() => writeStorage(DRIVES_KEY, drives), [drives])
  useEffect(() => {
    if (session) writeStorage(SESSION_KEY, session)
    else localStorage.removeItem(SESSION_KEY)
  }, [session])

  const currentStudent = useMemo(
    () => session?.role === 'student' ? students.find((student) => student.id === session.studentId) : null,
    [session, students],
  )

  function logout() {
    setSession(null)
    setActiveTest(null)
    setPage('home')
    setNotice('You have been logged out.')
  }

  async function register(form) {
    const email = form.email.trim().toLowerCase()
    if (students.some((student) => student.email === email)) {
      setNotice('This email is already registered. Please log in.')
      return
    }
    const student = {
      id: makeId(), name: form.name.trim(), email,
      rollNumber: form.rollNumber.trim(), course: form.course.trim(),
      batch: form.batch.trim(), registeredAt: new Date().toISOString(),
    }
    setNotice('Saving student profile to Google Sheets…')
    try {
      await appendSheetRow('students', {
        Student_ID: student.id, Name: student.name, Roll_Number: student.rollNumber,
        Email: student.email, Course: student.course, Batch: student.batch,
        Phone: '', Created_At: student.registeredAt,
      })
      const rows = await readSheet('students')
      const remoteStudents = rows.map(mapStudent)
      const savedStudent = remoteStudents.find((item) => item.id === student.id || item.email === email)
      if (!savedStudent) throw new Error('Student row was not found after saving. Please verify the Students tab and Apps Script deployment.')
      setStudents(remoteStudents)
      setStudentCredentials((prev) => ({ ...prev, [email]: form.password }))
      setSession({ role: 'student', studentId: savedStudent.id })
      setPage('student')
      setNotice('Registration saved successfully in Google Sheets.')
    } catch (error) {
      setNotice(`Registration could not be confirmed in Google Sheets: ${error.message}. Please try again; no local student profile was created.`)
    }
  }

  function login(emailValue, password, role) {
    const email = emailValue.trim().toLowerCase()
    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setSession({ role: 'admin' })
        setPage('admin')
        setNotice('')
      } else setNotice('Admin credentials are incorrect.')
      return
    }
    const student = students.find((item) => item.email === email)
    if (!student || studentCredentials[email] !== password) {
      setNotice('Email or password is incorrect. If you are new, please register first. Student profiles are loaded from Google Sheets; this browser must have the matching login credential.')
      return
    }
    setSession({ role: 'student', studentId: student.id })
    setPage('student')
    setNotice('')
  }

  function startTest(testConfig = null) {
    const config = testConfig || { id: 'mca-aptitude-set-1', name: 'MCA Aptitude Test – Campus Placement Preparation (Set-1)', questions: aptitudeQuestions, sheet: 'results', durationMinutes: 60, type: 'aptitude' }
    const history = results.filter((result) => result.studentId === currentStudent?.id && result.testId === config.id)
    const latest = history.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0]
    if (latest) {
      const unlockAt = new Date(latest.submittedAt).getTime() + 6 * 60 * 60 * 1000
      if (Date.now() < unlockAt) {
        setNotice(`Retest for ${config.name} will be available after ${new Date(unlockAt).toLocaleString()}.`)
        return
      }
    }
    if (!config.questions?.length) {
      setNotice(`${config.name}: question bank is not loaded in this project yet. The test will be enabled once its original 50-question bank is added.`)
      return
    }
    setActiveTest({
      testId: config.id, testName: config.name, questions: config.questions, sheet: config.sheet || 'technicalResults',
      type: config.type || 'technical', startedAt: Date.now(), endsAt: Date.now() + (config.durationMinutes || 60) * 60 * 1000,
      answers: {}, currentQuestion: 0,
    })
    setPage('test')
    setNotice('')
  }

  function submitTest(answers, startedAt, autoSubmitted = false) {
    if (!currentStudent || !activeTest) return
    const questions = activeTest.questions
    const score = activeTest.type === 'programming' ? 0 : questions.reduce((total, question) => total + (Number(answers[question.id]) === question.answer ? 1 : 0), 0)
    const submittedAt = new Date().toISOString()
    const previousAttempts = results.filter((r) => r.studentId === currentStudent.id && r.testId === activeTest.testId).length
    const result = {
      id: makeId(), testId: activeTest.testId, testName: activeTest.testName, testType: activeTest.type,
      studentId: currentStudent.id, studentName: currentStudent.name, email: currentStudent.email,
      rollNumber: currentStudent.rollNumber, score, totalQuestions: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
      startedAt: new Date(startedAt).toISOString(), submittedAt,
      durationSeconds: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)), autoSubmitted,
      attemptNumber: previousAttempts + 1, answers,
    }
    setResults((prev) => [...prev, result])
    const row = {
      Result_ID: result.id, Student_ID: result.studentId, Student_Name: result.studentName,
      Email: result.email, Roll_Number: result.rollNumber, Test_ID: result.testId,
      Test_Name: result.testName, Test_Type: result.testType, Attempt_Number: result.attemptNumber,
      Score: result.score, Total_Questions: result.totalQuestions, Percentage: result.percentage,
      Started_At: result.startedAt, Submitted_At: result.submittedAt, Duration_Seconds: result.durationSeconds,
      Auto_Submitted: result.autoSubmitted ? 'Yes' : 'No', Answers_JSON: JSON.stringify(result.answers),
      Next_Retest_At: new Date(new Date(result.submittedAt).getTime() + 6 * 60 * 60 * 1000).toISOString(),
    }
    const sheetKey = activeTest.sheet || (activeTest.type === 'programming' ? 'programmingResults' : activeTest.type === 'technical' ? 'technicalResults' : 'results')
    appendSheetRow(sheetKey, row).then(() => readSheet(sheetKey)).then((rows) => {
      const mapper = sheetKey === 'technicalResults' ? mapTechnicalResult : sheetKey === 'programmingResults' ? mapProgrammingResult : mapResult
      setResults((prev) => mergeById(rows.map(mapper), prev))
    }).catch((error) => setNotice(`Result saved on this device, but Google Sheets sync failed: ${error.message}`))
    setActiveTest(null)
    setPage('result')
    setNotice(autoSubmitted ? 'Time is up. Your test was submitted. Syncing result to Google Sheets…' : 'Your test was submitted. Syncing result to Google Sheets…')
  }

function startProgrammingTest(track) {
  if (!track || !Array.isArray(track.questions) || track.questions.length === 0) {
    setNotice('Programming question bank is not available.');
    return;
  }

  const config = {
    id: `programming-${track.id}`,
    name: `${track.name} – Programming Test`,
    questions: track.questions,
    sheet: 'programmingResults',
    durationMinutes: track.durationMinutes || 60,
    type: 'programming'
  };

  startTest(config);
}
  function exportResults() {
    const headings = ['Student Name', 'Email', 'Roll Number', 'Test', 'Score', 'Total', 'Percentage', 'Started At', 'Submitted At', 'Duration Seconds', 'Auto Submitted']
    const rows = results.map((r) => [
      r.studentName, r.email, r.rollNumber, r.testName, r.score, r.totalQuestions, r.percentage,
      r.startedAt, r.submittedAt, r.durationSeconds, r.autoSubmitted ? 'Yes' : 'No',
    ])
    const csv = [headings, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'placement-lms-results.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage(session?.role === 'admin' ? 'admin' : session?.role === 'student' ? 'student' : 'home')}>
          <span className="brand-mark">P</span>
          <span><strong>Placement LMS</strong><small>Aspire. Achieve. Ascend.</small></span>
        </button>
        <div className="top-actions">
          {session && <span className="role-pill">{session.role === 'admin' ? 'Administrator' : 'Student Portal'}</span>}
          {session && <button className="button button-quiet button-small" onClick={logout}>Log out</button>}
        </div>
      </header>

      <main className="main-content">
        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}

        {!session && page === 'home' && <Home onNavigate={setPage} />}
        {!session && page === 'register' && <Register onRegister={register} onBack={() => { setPage('home'); setNotice('') }} />}
        {!session && page === 'login' && <Login onLogin={login} onBack={() => { setPage('home'); setNotice('') }} />}
        {!session && page === 'admin-login' && <AdminLogin onLogin={login} onBack={() => { setPage('home'); setNotice('') }} />}

        {session?.role === 'student' && page !== 'test' && (
          <StudentDashboard
            student={currentStudent}
            results={results.filter((result) => result.studentId === currentStudent?.id)}
            onStartTest={startTest}
            onStartProgrammingTest={startProgrammingTest}
            onNavigate={setPage}
          />
        )}
        {session?.role === 'student' && page === 'test' && activeTest && currentStudent && (
          <TestRunner
            key={activeTest.startedAt}
            activeTest={activeTest}
            onSubmit={submitTest}
          />
        )}
        {session?.role === 'student' && page === 'test' && !activeTest && (
          <StudentDashboard student={currentStudent} results={results.filter((result) => result.studentId === currentStudent?.id)} onStartTest={startTest} onNavigate={setPage} />
        )}
        {session?.role === 'admin' && <AdminDashboard students={students} results={results} companies={companies} drives={drives} onCompaniesChange={setCompanies} onDrivesChange={setDrives} onExport={exportResults} onRefreshGoogleSheet={refreshGoogleSheetData} refreshingSheet={refreshingSheet} />}
      </main>

      <footer className="footer">Placement LMS <span>•</span> Student assessment portal</footer>
    </div>
  )
}

function Home({ onNavigate }) {
  return (
    <section className="hero-layout">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> CAREER READINESS PLATFORM</div>
        <h1>Prepare today.<br /><span>Place tomorrow.</span></h1>
        <p className="hero-description">A central place for students to take placement assessments and for administrators to review registrations and results.</p>
        <div className="hero-buttons">
          <button className="button button-primary" onClick={() => onNavigate('register')}>Create student account <span>→</span></button>
          <button className="button button-secondary" onClick={() => onNavigate('login')}>Student login</button>
        </div>
        <button className="text-link" onClick={() => onNavigate('admin-login')}>Administrator login →</button>
        <div className="feature-strip">
          <div><strong>01</strong><span>Register</span></div>
          <div><strong>02</strong><span>Take assessment</span></div>
          <div><strong>03</strong><span>View results</span></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="visual-card main-visual-card">
          <div className="visual-card-top"><span className="mini-icon">✓</span><span className="visual-label">ASSESSMENT READY</span><span className="status-dot" /></div>
          <div className="visual-title">MCA Aptitude<br />Test – Set-1</div>
          <div className="visual-subtitle">Build confidence through practice.</div>
          <div className="progress-label"><span>Test readiness</span><strong>Start here</strong></div>
          <div className="progress-track"><span /></div>
          <div className="visual-meta"><span>◷ 60 minutes</span><span>▤ Timed test</span></div>
        </div>
        <div className="floating-note note-top"><span className="note-icon">↗</span><span><strong>Track progress</strong><small>Review your results</small></span></div>
        <div className="floating-note note-bottom"><span className="note-icon note-green">✓</span><span><strong>Auto-submit</strong><small>When time runs out</small></span></div>
        <div className="visual-decoration deco-a" /><div className="visual-decoration deco-b" />
      </div>
    </section>
  )
}

function Register({ onRegister, onBack }) {
  const [form, setForm] = useState({ name: '', email: '', rollNumber: '', course: 'BCA', batch: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  function submit(event) {
    event.preventDefault()
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (!form.name.trim() || !form.email.trim() || !form.rollNumber.trim() || !form.batch.trim()) return setError('Please fill in all required fields.')
    setError('')
    onRegister(form)
  }
  return (
    <section className="form-layout">
      <div className="form-aside"><div className="aside-symbol">✦</div><div className="eyebrow">STUDENT ONBOARDING</div><h2>Your next opportunity starts here.</h2><p>Create your profile to access placement assessments and track your performance.</p><div className="aside-foot">Aspire. Achieve. Ascend.</div></div>
      <div className="form-panel">
        <button className="back-link" onClick={onBack}>← Back to home</button>
        <h2>Create account</h2><p className="muted">Enter your details to register as a student.</p>
        {error && <div className="inline-error">{error}</div>}
        <form onSubmit={submit} className="form-grid">
          <Field label="Full name" name="name" value={form.name} onChange={update} placeholder="Enter full name" required />
          <Field label="Email address" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
          <Field label="Roll number" name="rollNumber" value={form.rollNumber} onChange={update} placeholder="Enter roll number" required />
          <label className="field"><span>Course</span><select name="course" value={form.course} onChange={update}><option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option><option>Other</option></select></label>
          <Field label="Batch / Passing year" name="batch" value={form.batch} onChange={update} placeholder="e.g. 2024–2027" required />
          <div />
          <Field label="Password" name="password" type="password" value={form.password} onChange={update} placeholder="At least 8 characters" required />
          <Field label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} placeholder="Re-enter password" required />
          <button className="button button-primary form-submit" type="submit">Register account <span>→</span></button>
        </form>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, placeholder, type = 'text', required = false }) {
  return <label className="field"><span>{label}</span><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} autoComplete={type === 'password' ? 'new-password' : 'on'} /></label>
}

function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function submit(event) { event.preventDefault(); onLogin(email, password, 'student') }
  return <LoginShell title="Welcome back" subtitle="Log in to your student account." onBack={onBack} onSubmit={submit} email={email} setEmail={setEmail} password={password} setPassword={setPassword} buttonText="Log in to student portal" />
}
function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState(ADMIN_PASSWORD)
  function submit(event) { event.preventDefault(); onLogin(email, password, 'admin') }
  return <LoginShell title="Administrator login" subtitle="Access student registrations and assessment results." onBack={onBack} onSubmit={submit} email={email} setEmail={setEmail} password={password} setPassword={setPassword} buttonText="Open admin dashboard" admin />
}
function LoginShell({ title, subtitle, onBack, onSubmit, email, setEmail, password, setPassword, buttonText, admin = false }) {
  return <section className="login-wrap"><div className="login-card"><button className="back-link" onClick={onBack}>← Back to home</button><div className="login-symbol">{admin ? '⌘' : '↗'}</div><h2>{title}</h2><p className="muted">{subtitle}</p><form onSubmit={onSubmit} className="login-form"><label className="field"><span>Email address</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button className="button button-primary form-submit">{buttonText} <span>→</span></button></form>{admin && <div className="demo-credentials"><strong>Demo credentials</strong><span>Email: {ADMIN_EMAIL}</span><small>Change these before using with real students. This starter uses browser storage, not secure production authentication.</small></div>}</div></section>
}

function StudentDashboard({ student, results, onStartTest, onStartProgrammingTest }) {
  const [view, setView] = useState('assessments')
  if (!student) return <div className="empty-state"><h2>Student profile not found</h2><p>Please log out and register or log in again.</p></div>
  const latestFor = (testId) => results.filter(r => r.testId === testId).sort((a,b) => new Date(b.submittedAt)-new Date(a.submittedAt))[0]
  const aptitudeResult = latestFor('mca-aptitude-set-1')
  const getStatus = (testId) => {
    const latest = latestFor(testId)
    if (!latest) return { label: 'Available', ready: true }
    const unlockAt = new Date(latest.submittedAt).getTime() + 6 * 60 * 60 * 1000
    return Date.now() >= unlockAt ? { label: 'Retest available', ready: true } : { label: `Retest after ${new Date(unlockAt).toLocaleString()}`, ready: false }
  }
  const technicalConfigs = technicalTracks.map(track => ({ ...track, testId: `technical-${track.id}` }))
  return <section className="dashboard">
    <div className="dashboard-heading"><div><div className="eyebrow">STUDENT PORTAL</div><h1>Welcome, {student.name.split(' ')[0]}.</h1><p className="muted">Here is your placement assessment workspace.</p></div><div className="avatar">{student.name.slice(0, 1).toUpperCase()}</div></div>
    <div className="student-profile-card"><div><span className="detail-label">STUDENT PROFILE</span><h3>{student.name}</h3><p>{student.email}</p></div><div className="profile-details"><div><span>Roll number</span><strong>{student.rollNumber}</strong></div><div><span>Course</span><strong>{student.course}</strong></div><div><span>Batch</span><strong>{student.batch}</strong></div></div></div>
    <div className="student-view-tabs"><button className={view==='assessments'?'active':''} onClick={()=>setView('assessments')}>Available Tests</button><button className={view==='history'?'active':''} onClick={()=>setView('history')}>My Test Results</button></div>
    {view === 'assessments' ? <>
      <div className="section-heading"><div><h2>Available assessments</h2><p className="muted">Select a test. Each test has its own 6-hour retest cooldown.</p></div><span className="count-label">ASSESSMENTS</span></div>
      <div className="assessment-grid">
        <article className="assessment-card assessment-active"><div className="assessment-top"><div className="assessment-icon">∑</div><span className="status-chip active-chip">{aptitudeResult?'Attempted':'Available'}</span></div><div className="eyebrow">ASSESSMENT 01</div><h3>MCA Aptitude Test – Set-1</h3><p>Campus Placement Preparation assessment.</p><div className="assessment-meta"><span>◷ 60 minutes</span><span>▤ {aptitudeQuestions.length} questions</span></div><button className="button button-primary full-button" onClick={()=>onStartTest()}> {aptitudeResult?'Retake / Continue':'Start assessment'} →</button></article>
        <article className="assessment-card assessment-active"><div className="assessment-top"><div className="assessment-icon">⌘</div><span className="status-chip active-chip">6 tracks</span></div><div className="eyebrow">ASSESSMENT 02</div><h3>Technical MCQ Test</h3><p>Choose a technical track from the six available categories.</p><div className="assessment-meta"><span>◷ 60 minutes</span><span>▤ 50 questions per track</span></div><button className="button button-primary full-button" onClick={()=>setView('technical')}>Select technical test →</button></article>
       <article className="assessment-card assessment-active">
  <div className="assessment-top">
    <div className="assessment-icon">{'{ }'}</div>
    <span className="status-chip active-chip">6 tracks</span>
  </div>
  <div className="eyebrow">ASSESSMENT 03</div>
  <h3>Programming Test</h3>
  <p>Select a programming domain and solve 10 subjective questions.</p>
  <div className="assessment-meta">
    <span>◷ 60 minutes per track</span>
    <span>▤ 10 questions per domain</span>
  </div>
  <button
    className="button button-primary full-button"
    onClick={() => setView('programming')}
  >
    Select Programming Test →
  </button>
</article>
      </div>
    </> : view === 'technical' ? <section><button className="back-link" onClick={()=>setView('assessments')}>← Back to assessments</button><TechnicalTrackSelection tracks={technicalConfigs} results={results} onStart={(track)=>onStartTest({id:track.testId,name:track.name,questions:track.questions,sheet:'technicalResults',durationMinutes:60,type:'technical'})} /></section> : view === 'programming' ? (
  <section>
    <button
      className="back-link"
      onClick={() => setView('assessments')}
    >
      ← Back to assessments
    </button>

    <ProgrammingTrackSelection
      tracks={programmingTracks}
      results={results}
      onStart={onStartProgrammingTest}
    />
  </section>
) : (
  <section className="history-card"><div className="section-heading"><div><h2>My results</h2><p className="muted">Every submission and retest is retained in your profile.</p></div></div><ResultsTable results={results} /></section>
)}
  </section>
}

function TechnicalTrackSelection({ tracks, results, onStart }) {
  return <section className="technical-track-section"><div className="section-heading"><div><h2>Technical MCQ Test</h2><p className="muted">Select the test name exactly as listed. Each track contains 50 MCQs.</p></div></div><div className="technical-track-grid">{tracks.map(track=>{
    const history=results.filter(r=>r.testId===`technical-${track.id}`).sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));
    const latest=history[0]; const unlock=latest?new Date(latest.submittedAt).getTime()+6*60*60*1000:0; const ready=!latest||Date.now()>=unlock;
    return <article className={`technical-track-card track-${track.color}`} key={track.id}><div className="track-icon">{track.icon}</div><div className="track-card-copy"><h3>{track.name}</h3><p>{track.questions.length} MCQs · Domain-specific questions</p><small>{latest?`Last score: ${latest.score}/${latest.totalQuestions} · Attempt ${latest.attemptNumber||history.length}`:'No attempt yet'}</small></div><button
  className="button button-primary"
  disabled={!ready || !track.questions?.length}
  onClick={() => onStart(track)}
>
  {!track.questions?.length
    ? 'Question bank pending'
    : latest
      ? 'Retest now'
      : 'Start test'}
</button>{!ready&&<small className="cooldown-text">Available: {new Date(unlock).toLocaleString()}</small>}</article>
  })}</div></section>
}
function ProgrammingTrackSelection({ tracks, results, onStart }) {
  return (
    <section className="technical-track-section">
      <div className="section-heading">
        <div>
          <h2>Programming Questions</h2>
          <p className="muted">
            Select a domain. Each domain has 10 subjective questions.
          </p>
        </div>
      </div>

      <div className="technical-track-grid">
        {tracks.map((track) => {
          const testId = `programming-${track.id}`;
          const history = results
            .filter((r) => r.testId === testId)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

          const latest = history[0];
          const unlockAt = latest
            ? new Date(latest.submittedAt).getTime() + 6 * 60 * 60 * 1000
            : 0;
          const ready = !latest || Date.now() >= unlockAt;

          return (
            <article
              className={`technical-track-card track-${track.color}`}
              key={track.id}
            >
              <div className="track-icon">{track.icon}</div>

              <div className="track-card-copy">
                <h3>{track.name}</h3>
                <p>{track.questions.length} Programming Questions</p>
                <small>
                  {latest ? 'Previously attempted' : 'No attempt yet'}
                </small>
              </div>

              <button
                className="button button-primary"
                disabled={!ready || !track.questions?.length}
                onClick={() => onStart(track)}
              >
                {!track.questions?.length
                  ? 'Question bank pending'
                  : latest
                    ? 'Retest now'
                    : 'Start test'}
              </button>

              {!ready && (
                <small className="cooldown-text">
                  Available: {new Date(unlockAt).toLocaleString()}
                </small>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
function TestRunner({ activeTest, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil((activeTest.endsAt - Date.now()) / 1000)))
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const questions = activeTest.questions || aptitudeQuestions
  const question = questions[current]
  const [writtenAnswer, setWrittenAnswer] = useState('')
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, Math.ceil((activeTest.endsAt - Date.now()) / 1000))), 250)
    return () => window.clearInterval(timer)
  }, [activeTest.endsAt])
  useEffect(() => {
    if (remaining <= 0 && !submitted) {
      setSubmitted(true)
      onSubmit(activeTest.type === 'programming' ? { ...answers, writtenAnswer } : answers, activeTest.startedAt, true)
    }
  }, [remaining, submitted, answers, activeTest.startedAt, onSubmit])
  useEffect(() => {
    function warn(event) { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [])
  const answeredCount = Object.keys(answers).length + (writtenAnswer.trim() ? 1 : 0)
  function finish(auto = false) {
    if (submitted) return
    setSubmitted(true)
    onSubmit(activeTest.type === 'programming' ? { ...answers, writtenAnswer } : answers, activeTest.startedAt, auto)
  }
  return <section className="test-page">
    <div className="test-header"><div><div className="eyebrow">PLACEMENT ASSESSMENT</div><h1>{activeTest.testName || 'MCA Aptitude Test – Set-1'}</h1><p className="muted">{question.subjective ? 'Enter your code and explanation below.' : 'Choose one answer for each question.'} Your progress is saved for submission in this session.</p></div><div className={`timer-card ${remaining < 300 ? 'timer-warning' : ''}`}><span>TIME REMAINING</span><strong>◷ {formatTime(remaining)}</strong><small>Auto-submit at zero</small></div></div>
    <div className="test-layout"><aside className="question-sidebar"><div className="sidebar-title"><strong>Questions</strong><span>{answeredCount}/{questions.length} answered</span></div><div className="question-numbers">{questions.map((q, index) => <button key={q.id} className={`question-number ${current === index ? 'selected' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`} onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><div className="legend"><span><i className="legend-answered" /> Answered</span><span><i className="legend-current" /> Current</span><span><i className="legend-empty" /> Not answered</span></div></aside>
      <div className="question-panel"><div className="question-panel-top"><span>QUESTION {current + 1} OF {questions.length}</span><span className="question-tag">{question.subjective ? 'Written response' : 'Single choice'}</span></div><div className="question-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div><h2>{question.question}</h2>
      {question.subjective ? (
  <textarea
    className="programming-answer"
    value={answers[question.id] || ''}
    onChange={(e) =>
      setAnswers((prev) => ({
        ...prev,
        [question.id]: e.target.value
      }))
    }
    placeholder="Write your code and explanation here..."
    rows={14}
  />
) : <div className="options-list">
        
        {question.options.map((option, index) => <button key={option} className={`option-button ${answers[question.id] === index ? 'option-selected' : ''}`} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: index }))}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span><span className="option-radio">{answers[question.id] === index ? '●' : '○'}</span></button>)}</div>}<div className="question-actions"><button className="button button-secondary" disabled={current === 0} onClick={() => setCurrent((n) => n - 1)}>← Previous</button><div className="question-actions-right">{current < questions.length - 1 ? <button className="button button-primary" onClick={() => setCurrent((n) => n + 1)}>Next question →</button> : <button className="button button-primary" onClick={() => setConfirmSubmit(true)}>Submit test ✓</button>}</div></div></div></div>
    {confirmSubmit && <div className="modal-backdrop"><div className="confirm-modal"><div className="login-symbol">?</div><h2>Submit your assessment?</h2><p className="muted">You have answered {answeredCount} of {questions.length} questions. Unanswered questions will be marked incorrect.</p><div className="modal-actions"><button className="button button-secondary" onClick={() => setConfirmSubmit(false)}>Continue test</button><button className="button button-primary" onClick={() => finish(false)}>Submit now</button></div></div></div>}
  </section>
}

function AdminDashboard({ students, results, companies, drives, onCompaniesChange, onDrivesChange, onExport, onRefreshGoogleSheet, refreshingSheet }) {
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')
  
  const [companyForm, setCompanyForm] = useState(null)
  const [driveForm, setDriveForm] = useState(null)
  const [companyFilter, setCompanyFilter] = useState('All')
  const filteredStudents = students.filter((student) => `${student.name} ${student.email} ${student.rollNumber} ${student.course} ${student.batch}`.toLowerCase().includes(search.toLowerCase()))
  const filteredResults = results.filter((result) => `${result.studentName} ${result.email} ${result.rollNumber}`.toLowerCase().includes(search.toLowerCase()))
  const filteredCompanies = companies.filter(c => (companyFilter === 'All' || c.status === companyFilter) && `${c.name} ${c.programs} ${c.status}`.toLowerCase().includes(search.toLowerCase()))
  const counts = STATUS_OPTIONS.map(status => ({ status, count: companies.filter(c => c.status === status).length }))
  function saveCompany(event) {
    event.preventDefault()
    const form = companyForm
    const updated = { ...form, id: form.id || `company-${Date.now()}` }
    onCompaniesChange(prev => form.id ? prev.map(c => c.id === form.id ? updated : c) : [...prev, updated])
    const row = { Company_ID: updated.id, Company_Name: updated.name, Programs_Included: updated.programs, Pay_Package: updated.packageText, Selections: updated.selections, Status: updated.status, Remarks: updated.remarks, Website: updated.website || '', Created_At: updated.createdAt || new Date().toISOString() }
    saveSheetRecord('companies', row, Boolean(form.id))
    setCompanyForm(null)
  }
  function removeCompany(company) {
    if (!window.confirm(`Delete ${company.name} from the placement report?`)) return
    onCompaniesChange(prev => prev.filter(c => c.id !== company.id))
    deleteSheetRecord('companies', company.id)
  }
  function saveDrive(event) {
    event.preventDefault()
    const form = driveForm
    const updated = { ...form, id: form.id || `drive-${Date.now()}`, createdAt: form.createdAt || new Date().toISOString() }
    onDrivesChange(prev => form.id ? prev.map(d => d.id === form.id ? updated : d) : [...prev, updated])
    const row = { Drive_ID: updated.id, Company_Name: updated.company, Website: updated.website, Registration_Link: updated.registrationLink, Job_Location: updated.location, Eligible_Programs: updated.programs, Job_Profile: updated.profile, Specialization: updated.specialization, Vacancies: updated.vacancies, Selection_Process: updated.selectionProcess, Mode: updated.mode, Cutoff_Class_X: updated.cutoff10, Cutoff_Class_XII: updated.cutoff12, Cutoff_Graduation: updated.cutoffGrad, Cutoff_PG: updated.cutoffPG, Active_Backlogs: updated.backlogs, CTC_Stipend: updated.packageText, Graduation_Details: updated.graduationDetails, Created_At: updated.createdAt }
    saveSheetRecord('drives', row, Boolean(form.id))
    setDriveForm(null)
  }
  function removeDrive(drive) {
    if (!window.confirm(`Delete placement drive for ${drive.company}?`)) return
    onDrivesChange(prev => prev.filter(d => d.id !== drive.id))
    deleteSheetRecord('drives', drive.id)
  }
  const mailList = [...new Set(students.map(s => s.email).filter(Boolean))].join(',')
  return <section className="dashboard admin-dashboard">
    <div className="dashboard-heading"><div><div className="eyebrow">GJIMT PLACEMENT MANAGEMENT</div><h1>Admin dashboard</h1><p className="muted">Manage placement companies, drives, student registrations and assessment performance.</p></div><div className="avatar admin-avatar">⌘</div></div>
    <div className="stats-grid"><Stat label="Registered students" value={students.length} detail="Student profiles" icon="♙" /><Stat label="Test attempts" value={results.length} detail="Submitted assessments" icon="✓" /><Stat label="Placement companies" value={companies.length} detail="Companies in report" icon="▣" /><Stat label="Active placement drives" value={drives.length} detail="Created by coordinator" icon="↗" /></div>
    <div className="admin-nav-tabs">
      {[['overview','Overview'],['companies','Company placement report'],['drives','Placement drives'],['students','Student registrations'],['results','Assessment results']].map(([key,label]) => <button key={key} className={tab===key?'selected':''} onClick={()=>{setTab(key);setSearch('')}}>{label}</button>)}
    </div>
    {tab === 'overview' && <>
      <div className="status-summary-grid">{counts.map(item=><article className="status-summary-card" key={item.status}><strong>{item.count}</strong><span>{item.status}</span></article>)}</div>
      <div className="admin-shortcuts"><button className="button button-primary" onClick={()=>{setTab('companies');setCompanyForm(emptyCompany())}}>+ Add company</button><button className="button button-secondary" onClick={()=>{setTab('drives');setDriveForm(emptyDrive())}}>+ Create placement drive</button><a className="button button-secondary" href={mailList ? `mailto:?bcc=${encodeURIComponent(mailList)}&subject=${encodeURIComponent('GJIMT Placement Opportunity')}` : '#'} onClick={e=>{if(!mailList){e.preventDefault();window.alert('No registered student email addresses are available yet.')}}}>Email registered students ↗</a></div>
      <section className="admin-table-card"><div className="table-toolbar"><strong>Recent placement companies</strong><button className="button button-secondary button-small" onClick={()=>setTab('companies')}>View full report →</button></div><div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>PROGRAMS</th><th>PACKAGE</th><th>SELECTIONS</th><th>STATUS</th></tr></thead><tbody>{companies.slice(0,6).map(c=><tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.programs}</td><td>{c.packageText}</td><td>{c.selections || '—'}</td><td><span className="status-chip active-chip">{c.status}</span></td></tr>)}</tbody></table></div></section>
    </>}
    {tab === 'companies' && <section className="admin-table-card"><div className="table-toolbar"><div><strong>Company placement report</strong><p className="muted">18 companies · edit status and selection information to update the summary.</p></div><div className="table-actions"><input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company / program"/><button className="button button-primary button-small" onClick={()=>setCompanyForm(emptyCompany())}>+ Add company</button></div></div><div className="company-filter-row"><select value={companyFilter} onChange={e=>setCompanyFilter(e.target.value)}><option>All</option>{STATUS_OPTIONS.map(x=><option key={x}>{x}</option>)}</select><span>{filteredCompanies.length} companies shown</span></div><div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>PROGRAMS</th><th>PACKAGE / CTC</th><th>SELECTIONS</th><th>STATUS</th><th>REMARKS</th><th>ACTIONS</th></tr></thead><tbody>{filteredCompanies.map(c=><tr key={c.id}><td><strong>{c.name}</strong>{c.website&&<small className="table-subline">{c.website}</small>}</td><td>{c.programs}</td><td>{c.packageText}</td><td>{c.selections || '—'}</td><td><span className="status-chip active-chip">{c.status}</span></td><td>{c.remarks || '—'}</td><td><div className="row-actions"><button onClick={()=>setCompanyForm({...c})}>Edit</button><button className="danger-link" onClick={()=>removeCompany(c)}>Delete</button></div></td></tr>)}</tbody></table>{filteredCompanies.length===0&&<EmptyTable text="No companies match this search."/>}</div></section>}
    {tab === 'drives' && <section className="admin-table-card"><div className="table-toolbar"><div><strong>Placement drives / job opportunities</strong><p className="muted">Create a drive and share its registration link or email students.</p></div><div className="table-actions"><input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company / role"/><button className="button button-primary button-small" onClick={()=>setDriveForm(emptyDrive())}>+ Create drive</button></div></div><div className="table-wrap"><table><thead><tr><th>COMPANY / ROLE</th><th>ELIGIBLE PROGRAMS</th><th>LOCATION</th><th>PACKAGE</th><th>MODE</th><th>REGISTRATION</th><th>ACTIONS</th></tr></thead><tbody>{drives.filter(d=>`${d.company} ${d.profile} ${d.programs}`.toLowerCase().includes(search.toLowerCase())).map(d=><tr key={d.id}><td><strong>{d.company}</strong><small className="table-subline">{d.profile}</small></td><td>{d.programs}</td><td>{d.location}</td><td>{d.packageText}</td><td>{d.mode}</td><td>{d.registrationLink?<a href={d.registrationLink} target="_blank" rel="noreferrer">Open link ↗</a>:'—'}</td><td><div className="row-actions"><button onClick={()=>setDriveForm({...d})}>Edit</button><button className="danger-link" onClick={()=>removeDrive(d)}>Delete</button><a href={`mailto:?bcc=${encodeURIComponent(mailList)}&subject=${encodeURIComponent(`Placement Drive: ${d.company}`)}&body=${encodeURIComponent(`Company: ${d.company}\nRole: ${d.profile}\nEligible programs: ${d.programs}\nLocation: ${d.location}\nPackage: ${d.packageText}\nRegistration: ${d.registrationLink}`)}`}>Email</a></div></td></tr>)}</tbody></table>{drives.length===0&&<EmptyTable text="No placement drives created yet."/>}</div></section>}
    {tab === 'students' && <section className="admin-table-card"><div className="table-toolbar"><div className="tab-heading"><strong>Student registrations</strong><span>{students.length} students</span></div><div className="table-actions"><input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, roll no., batch"/><a className="button button-secondary button-small" href={mailList?`mailto:?bcc=${encodeURIComponent(mailList)}`:'#'}>Email students ↗</a></div></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ROLL NUMBER</th><th>COURSE</th><th>BATCH</th><th>REGISTERED</th></tr></thead><tbody>{filteredStudents.map(student=><tr key={student.id}><td><div className="table-person"><span className="table-avatar">{student.name.slice(0,1).toUpperCase()}</span><span><strong>{student.name}</strong><small>{student.email}</small></span></div></td><td>{student.rollNumber}</td><td>{student.course}</td><td>{student.batch}</td><td>{student.registeredAt?new Date(student.registeredAt).toLocaleDateString():'—'}</td></tr>)}</tbody></table>{filteredStudents.length===0&&<EmptyTable text="No student registrations found."/>}</div></section>}
    {tab === 'results' && <section className="admin-table-card"><div className="table-toolbar"><strong>Assessment results · {results.length} submissions</strong><div className="table-actions"><input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student / email / roll no."/><button className="button button-secondary button-small" onClick={onRefreshGoogleSheet} disabled={refreshingSheet}>{refreshingSheet ? "Refreshing…" : "Refresh from Google Sheet ↻"}</button><a className="button button-secondary button-small" href={GOOGLE_RESULT_SHEET_URL} target="_blank" rel="noreferrer">Open Google Sheet ↗</a><a className="button button-secondary button-small" href={GOOGLE_RESULT_SHEET_DOWNLOAD_URL} target="_blank" rel="noreferrer">Download Sheet ↓</a><button className="button button-primary button-small" onClick={onExport}>Download Results CSV ↓</button></div></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ASSESSMENT</th><th>SCORE</th><th>DURATION</th><th>SUBMITTED</th><th>STATUS</th></tr></thead><tbody>{filteredResults.map(result=><tr key={result.id}><td><div className="table-person"><span className="table-avatar">{result.studentName.slice(0,1).toUpperCase()}</span><span><strong>{result.studentName}</strong><small>{result.email}</small></span></div></td><td>{result.testName}</td><td><strong>{result.score}/{result.totalQuestions}</strong><small className="table-subline">{result.percentage}%</small></td><td>{formatTime(result.durationSeconds)}</td><td>{new Date(result.submittedAt).toLocaleString()}</td><td><span className={`status-chip ${result.autoSubmitted?'soon-chip':'active-chip'}`}>{result.autoSubmitted?'Auto-submitted':'Submitted'}</span></td></tr>)}</tbody></table>{filteredResults.length===0&&<EmptyTable text="No assessment results found."/>}</div></section>}
    {companyForm && <div className="modal-backdrop"><form className="admin-edit-modal" onSubmit={saveCompany}><div className="modal-title-row"><div><h2>{companyForm.id?'Edit company':'Add company'}</h2><p className="muted">Company details and placement progress</p></div><button type="button" onClick={()=>setCompanyForm(null)}>×</button></div><div className="admin-form-grid"><label>Company name<input required value={companyForm.name} onChange={e=>setCompanyForm({...companyForm,name:e.target.value})}/></label><label>Website<input value={companyForm.website||''} onChange={e=>setCompanyForm({...companyForm,website:e.target.value})} placeholder="https://"/></label><label>Eligible programs<input required value={companyForm.programs} onChange={e=>setCompanyForm({...companyForm,programs:e.target.value})} placeholder="MBA III, BBA V"/></label><label>Package / CTC<input value={companyForm.packageText} onChange={e=>setCompanyForm({...companyForm,packageText:e.target.value})}/></label><label>Selections<input value={companyForm.selections} onChange={e=>setCompanyForm({...companyForm,selections:e.target.value})}/></label><label>Status<select value={companyForm.status} onChange={e=>setCompanyForm({...companyForm,status:e.target.value})}>{STATUS_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></label><label className="wide-field">Remarks<textarea value={companyForm.remarks} onChange={e=>setCompanyForm({...companyForm,remarks:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={()=>setCompanyForm(null)}>Cancel</button><button className="button button-primary">Save company</button></div></form></div>}
    {driveForm && <div className="modal-backdrop"><form className="admin-edit-modal wide-modal" onSubmit={saveDrive}><div className="modal-title-row"><div><h2>{driveForm.id?'Edit placement drive':'Create placement drive'}</h2><p className="muted">Complete job details and eligibility criteria</p></div><button type="button" onClick={()=>setDriveForm(null)}>×</button></div><div className="admin-form-grid"><label>Company name<input required value={driveForm.company} onChange={e=>setDriveForm({...driveForm,company:e.target.value})}/></label><label>Company website<input value={driveForm.website} onChange={e=>setDriveForm({...driveForm,website:e.target.value})}/></label><label>Registration link<input value={driveForm.registrationLink} onChange={e=>setDriveForm({...driveForm,registrationLink:e.target.value})}/></label><label>Job location<input value={driveForm.location} onChange={e=>setDriveForm({...driveForm,location:e.target.value})}/></label><label>Eligible programs<input required value={driveForm.programs} onChange={e=>setDriveForm({...driveForm,programs:e.target.value})} placeholder="MBA, MCA, BCA"/></label><label>Job profile / JD<input value={driveForm.profile} onChange={e=>setDriveForm({...driveForm,profile:e.target.value})}/></label><label>Specialization<input value={driveForm.specialization} onChange={e=>setDriveForm({...driveForm,specialization:e.target.value})} placeholder="Marketing, HR, Finance"/></label><label>Vacancies<input value={driveForm.vacancies} onChange={e=>setDriveForm({...driveForm,vacancies:e.target.value})}/></label><label>Selection process<input value={driveForm.selectionProcess} onChange={e=>setDriveForm({...driveForm,selectionProcess:e.target.value})} placeholder="Aptitude test, GD, interview"/></label><label>Mode<select value={driveForm.mode} onChange={e=>setDriveForm({...driveForm,mode:e.target.value})}>{['On Campus','Off Campus','Company premises','Virtual','Hybrid'].map(x=><option key={x}>{x}</option>)}</select></label><label>Class X cutoff %<input value={driveForm.cutoff10} onChange={e=>setDriveForm({...driveForm,cutoff10:e.target.value})}/></label><label>Class XII cutoff %<input value={driveForm.cutoff12} onChange={e=>setDriveForm({...driveForm,cutoff12:e.target.value})}/></label><label>Graduation cutoff %<input value={driveForm.cutoffGrad} onChange={e=>setDriveForm({...driveForm,cutoffGrad:e.target.value})}/></label><label>PG cutoff %<input value={driveForm.cutoffPG} onChange={e=>setDriveForm({...driveForm,cutoffPG:e.target.value})}/></label><label>Active backlogs allowed<input value={driveForm.backlogs} onChange={e=>setDriveForm({...driveForm,backlogs:e.target.value})}/></label><label>Pay package / CTC / stipend<input value={driveForm.packageText} onChange={e=>setDriveForm({...driveForm,packageText:e.target.value})}/></label><label className="wide-field">Graduation details / other eligibility<textarea value={driveForm.graduationDetails} onChange={e=>setDriveForm({...driveForm,graduationDetails:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={()=>setDriveForm(null)}>Cancel</button><button className="button button-primary">Save and publish drive</button></div></form></div>}
  </section>
}
function emptyCompany() { return { name:'', website:'', programs:'', packageText:'', selections:'', status:STATUS_OPTIONS[4], remarks:'' } }
function emptyDrive() { return { company:'', website:'', registrationLink:'', location:'', programs:'', profile:'', specialization:'', vacancies:'', selectionProcess:'', mode:'On Campus', cutoff10:'', cutoff12:'', cutoffGrad:'', cutoffPG:'', backlogs:'', packageText:'', graduationDetails:'' } }
async function saveSheetRecord(sheet, row, update) {
  try { await fetch(GOOGLE_SHEETS_API_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({ action:update?'upsert':'append', sheet, row }) }) }
  catch (e) { console.warn(`Could not sync ${sheet} record`, e) }
}
async function deleteSheetRecord(sheet, id) {
  try { await fetch(GOOGLE_SHEETS_API_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({ action:'delete', sheet, id }) }) }
  catch (e) { console.warn(`Could not delete ${sheet} record`, e) }
}

function Stat({ label, value, detail, icon }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><i>{icon}</i></div><strong className="stat-value">{value}</strong><small>{detail}</small></article>
}
function ResultsTable({ results }) {
  return <div className="table-wrap"><table><thead><tr><th>ASSESSMENT</th><th>ATTEMPT</th><th>SCORE / STATUS</th><th>DURATION</th><th>SUBMITTED</th><th>PRINT</th></tr></thead><tbody>{[...results].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).map((r) => <tr key={r.id}><td>{r.testName}</td><td>{r.attemptNumber || 1}</td><td>{r.testType==='programming'?'Submitted · Review required':<><strong>{r.score}/{r.totalQuestions}</strong> ({r.percentage}%)</>}</td><td>{formatTime(r.durationSeconds)}</td><td>{new Date(r.submittedAt).toLocaleString()}</td><td><button className="button button-secondary button-small no-print" onClick={()=>window.print()}>Print</button></td></tr>)}</tbody></table></div>
}
function EmptyTable({ text }) {
  return <div className="empty-table"><span>⌕</span><strong>{text}</strong><small>New records will appear here.</small></div>
}
