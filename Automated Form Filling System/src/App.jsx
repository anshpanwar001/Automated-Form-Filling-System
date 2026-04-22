import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const formOptions = [
  'Passport Renewal',
  'Scholarship Application',
  'Exam Registration',
  'Driving License',
]

const firstHistory = [
  { time: '22 Apr 2026, 10:30 AM', form: 'Scholarship Application', status: 'Generated' },
  { time: '20 Apr 2026, 04:15 PM', form: 'Passport Renewal', status: 'Reviewed' },
]

function App() {
  const [activeStep, setActiveStep] = useState('form')
  const [accountMode, setAccountMode] = useState('login')
  const [formMode, setFormMode] = useState('existing')
  const [selectedForm, setSelectedForm] = useState('Scholarship Application')
  const [customFormName, setCustomFormName] = useState('')
  const [documents, setDocuments] = useState({
    aadhaar: '',
    photo: '',
    signature: '',
    extra: '',
  })
  const [profile, setProfile] = useState({
    fullName: 'Ansh Panwar',
    dob: '2005-11-25',
    gender: 'male',
    phone: '9876543210',
    email: 'ansh@example.com',
    address: 'New Delhi, India',
  })
  const [history, setHistory] = useState(firstHistory)
  const [message, setMessage] = useState('Ready to review extracted details.')

  const currentForm = formMode === 'custom' && customFormName ? customFormName : selectedForm
  const uploadedCount = Object.values(documents).filter(Boolean).length

  function updateDocument(event) {
    const { name, files } = event.target
    setDocuments({ ...documents, [name]: files[0]?.name || '' })
  }

  function updateProfile(event) {
    const { name, value } = event.target
    setProfile({ ...profile, [name]: value })
  }

  function saveSection(nextStep, nextMessage) {
    setActiveStep(nextStep)
    setMessage(nextMessage)
  }

  function generatePdf() {
    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    setHistory([{ time: now, form: currentForm, status: 'Generated' }, ...history])
    setActiveStep('output')
    setMessage('Final PDF preview generated successfully.')
  }

  function downloadFinalFile() {
    const content = [
      'CyberCafe AI - Filled Form Preview',
      `Form: ${currentForm}`,
      `Name: ${profile.fullName}`,
      `Date of birth: ${profile.dob}`,
      `Gender: ${profile.gender}`,
      `Phone: ${profile.phone}`,
      `Email: ${profile.email}`,
      `Address: ${profile.address}`,
    ].join('\n')
    const file = new Blob([content], { type: 'text/plain' })
    const link = document.createElement('a')

    link.href = URL.createObjectURL(file)
    link.download = 'filled-form-preview.txt'
    link.click()
    URL.revokeObjectURL(link.href)
    setMessage('Final file downloaded with the current preview details.')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Automated Form Filling System</p>
          <h1>CyberCafe AI</h1>
        </div>
        <nav aria-label="Primary navigation">
          <a href="#auth">Account</a>
          <a href="#workflow">Workflow</a>
          <a href="#history">History</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Simple document to form workflow</p>
          <h2>Upload documents, review details, and prepare a filled form.</h2>
          <p>
            A clean frontend for selecting forms, collecting user documents,
            editing extracted data, and viewing the final generated output.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#workflow">Start filling</a>
            <a className="secondary-button" href="#preview">See preview</a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Current project status">
          <img src={heroImg} alt="" />
          <div>
            <span className="status-dot"></span>
            <p>{message}</p>
          </div>
          <ul>
            <li><strong>{currentForm}</strong><span>Selected form</span></li>
            <li><strong>{uploadedCount}/4</strong><span>Documents added</span></li>
            <li><strong>{history.length}</strong><span>Saved records</span></li>
          </ul>
        </div>
      </section>

      <section id="auth" className="panel auth-panel">
        <div className="section-heading">
          <p className="eyebrow">Account</p>
          <h2>{accountMode === 'login' ? 'Login' : 'Create account'}</h2>
        </div>

        <div className="mode-switch" role="group" aria-label="Account mode">
          <button
            className={accountMode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => setAccountMode('login')}
          >
            Login
          </button>
          <button
            className={accountMode === 'signup' ? 'active' : ''}
            type="button"
            onClick={() => setAccountMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault()
            setMessage(accountMode === 'login' ? 'Login details checked locally.' : 'Account details saved locally.')
          }}
        >
          {accountMode === 'signup' && (
            <label>
              Full name
              <input type="text" placeholder="Enter full name" />
            </label>
          )}
          <label>
            Email
            <input type="email" placeholder="user@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Minimum 6 characters" minLength="6" />
          </label>
          <button className="primary-button" type="submit">
            {accountMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>

      <section id="workflow" className="workflow-layout">
        <aside className="step-list" aria-label="Form filling steps">
          {[
            ['form', '1', 'Select form'],
            ['docs', '2', 'Upload documents'],
            ['review', '3', 'Review fields'],
            ['output', '4', 'Generate output'],
          ].map(([id, number, label]) => (
            <button
              key={id}
              className={activeStep === id ? 'active' : ''}
              type="button"
              onClick={() => setActiveStep(id)}
            >
              <span>{number}</span>
              {label}
            </button>
          ))}
        </aside>

        <div className="workflow-content">
          {activeStep === 'form' && (
            <section className="panel">
              <div className="section-heading">
                <p className="eyebrow">Step 1</p>
                <h2>Select or upload form</h2>
              </div>

              <div className="radio-row">
                <label>
                  <input
                    checked={formMode === 'existing'}
                    name="formMode"
                    type="radio"
                    onChange={() => setFormMode('existing')}
                  />
                  Existing form
                </label>
                <label>
                  <input
                    checked={formMode === 'custom'}
                    name="formMode"
                    type="radio"
                    onChange={() => setFormMode('custom')}
                  />
                  Custom PDF
                </label>
              </div>

              <div className="form-grid two-columns">
                <label>
                  Existing government form
                  <select
                    disabled={formMode === 'custom'}
                    value={selectedForm}
                    onChange={(event) => setSelectedForm(event.target.value)}
                  >
                    {formOptions.map((form) => (
                      <option key={form}>{form}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Upload custom PDF
                  <input
                    disabled={formMode === 'existing'}
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setCustomFormName(event.target.files[0]?.name || '')}
                  />
                </label>
              </div>

              <button
                className="primary-button"
                type="button"
                onClick={() => saveSection('docs', 'Form selection saved. Add required documents next.')}
              >
                Save form selection
              </button>
            </section>
          )}

          {activeStep === 'docs' && (
            <section className="panel">
              <div className="section-heading">
                <p className="eyebrow">Step 2</p>
                <h2>Upload required documents</h2>
              </div>

              <div className="upload-list">
                {[
                  ['aadhaar', 'Aadhaar Card', 'image/*,application/pdf'],
                  ['photo', 'Passport Photo', 'image/*'],
                  ['signature', 'Signature', 'image/*'],
                  ['extra', 'Additional Documents', 'image/*,application/pdf'],
                ].map(([name, label, accept]) => (
                  <label key={name} className="upload-box">
                    <span>{label}</span>
                    <small>{documents[name] || 'No file selected'}</small>
                    <input name={name} type="file" accept={accept} onChange={updateDocument} />
                  </label>
                ))}
              </div>

              <button
                className="primary-button"
                type="button"
                onClick={() => saveSection('review', 'Documents uploaded. Review extracted fields.')}
              >
                Upload documents
              </button>
            </section>
          )}

          {activeStep === 'review' && (
            <section className="panel">
              <div className="section-heading">
                <p className="eyebrow">Step 3</p>
                <h2>Review and edit extracted fields</h2>
              </div>

              <div className="form-grid two-columns">
                <label>
                  Full name
                  <input name="fullName" value={profile.fullName} onChange={updateProfile} />
                </label>
                <label>
                  Date of birth
                  <input name="dob" type="date" value={profile.dob} onChange={updateProfile} />
                </label>
                <label>
                  Gender
                  <select name="gender" value={profile.gender} onChange={updateProfile}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" value={profile.phone} onChange={updateProfile} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={profile.email} onChange={updateProfile} />
                </label>
                <label className="wide">
                  Address
                  <textarea name="address" rows="4" value={profile.address} onChange={updateProfile} />
                </label>
              </div>

              <button
                className="primary-button"
                type="button"
                onClick={() => saveSection('output', 'Extracted details saved. Generate the final form.')}
              >
                Save form data
              </button>
            </section>
          )}

          {activeStep === 'output' && (
            <section id="preview" className="panel preview-panel">
              <div className="section-heading">
                <p className="eyebrow">Step 4</p>
                <h2>Final form generation</h2>
              </div>

              <div className="preview-card">
                <div>
                  <p className="eyebrow">Final preview</p>
                  <h3>{currentForm}</h3>
                </div>
                <dl>
                  <div><dt>Name</dt><dd>{profile.fullName}</dd></div>
                  <div><dt>Date of birth</dt><dd>{profile.dob}</dd></div>
                  <div><dt>Phone</dt><dd>{profile.phone}</dd></div>
                  <div><dt>Email</dt><dd>{profile.email}</dd></div>
                  <div><dt>Address</dt><dd>{profile.address}</dd></div>
                </dl>
              </div>

              <div className="button-row">
                <button className="primary-button" type="button" onClick={generatePdf}>
                  Generate final PDF
                </button>
                <button className="secondary-button" type="button" onClick={downloadFinalFile}>
                  Download final file
                </button>
              </div>
            </section>
          )}
        </div>
      </section>

      <section id="history" className="panel history-panel">
        <div className="section-heading">
          <p className="eyebrow">Dashboard</p>
          <h2>Submission history</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Form</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={`${item.time}-${index}`}>
                  <td>{item.time}</td>
                  <td>{item.form}</td>
                  <td><span className="status-pill">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
