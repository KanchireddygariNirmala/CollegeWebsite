import clf from './ColleageLogo.png';
import './App.css';
import React, { useState } from 'react';

// Backend base URL: set REACT_APP_API_URL in production (e.g. your Render
// backend URL); falls back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Header layout holding the logo (left) and welcome text (right)

// This component is responsible for LOGO.
function MyLogo() {
  return (
    <header className="Header-Bar">
      <img src={clf} className="App-logo" alt="New Horizon College Logo" />
      <h1 className="HTag">Welcome to New Horizon College of Polytechnic</h1>
    </header>
  );
}

// This component is resposible for college information.
function MyCollegeInfo() {
  return (
    <div>
      <strong>
        New Horizon College of Polytechnic of Engineering is an autonomous institution
        permanently affiliated with Visvesvaraya Technological University (VTU) and approved
        by the All India Council for Technical Education (AICTE) as well as the University
        Grants Commission (UGC). It is accredited by NAAC with an &lsquo;A&rsquo; grade and by
        the National Board of Accreditation (NBA). The college is located in the heart of
        India&rsquo;s IT capital, Bangalore. The campus is surrounded by multinational corporations.
      </strong>
    </div>
  );
}

// This component is begin rendered on UI is  when student clicked on register component
function ApplicationForm({ onCancel }) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentPhoneNumber, setStudentPhoneNumber] = useState("");
  const [studentCourse, setStudentCourse] = useState("");

   //THE PACKAGING and converting the data into js readable format
  async function handleSubmit(e) {
    e.preventDefault(); // Intercept submit and stop the browser from performing a full page reload

    //Collect current RAM values into a local JavaScript object
    const studentPayload = {
      name: studentName,
      email: studentEmail,
      age: studentAge,
      phone_number: studentPhoneNumber,
      course: studentCourse,
    };

    try {
      
      // Now we need to send this data into localhost bt using fecth-post method 
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST", // Specifies we are writing/creating data
        headers: { "Content-Type": "application/json" }, // Alerts the server to expect JSON text
        body: JSON.stringify(studentPayload),  // Hereconverting  the object into a raw, standardized plain text JSON string and assigning it . and  // The actual string payload being shipped

      });

      if (response.ok) {
        await response.json();
        alert("Success! Student data submitted.");
      } else {
        alert(`Server Error: Received status code ${response.status}`);
      }
    } catch (networkError) {
      console.error("Could not reach the server:", networkError);
      alert(`Network Error: Could not connect to ${API_URL}. Is the backend server running?`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Student Application Form</h3>

        <label>Student Name: </label>
        <input type="text" placeholder="Enter your name" value={studentName} onChange={(e) => setStudentName(e.target.value)} /><br />

        <label>Email Address: </label>
        <input type="email" placeholder="Enter your email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} /><br />

        <label>Age: </label>
        <input type="number" placeholder="Enter your age" value={studentAge} onChange={(e) => setStudentAge(e.target.value)} /><br />

        <label>Phone number: </label>
        <input type="number" placeholder="Enter your phone number" value={studentPhoneNumber} onChange={(e) => setStudentPhoneNumber(e.target.value)} /><br />

        <label>Branch/Course: </label>
        <input type="text" placeholder="Enter your branch name" value={studentCourse} onChange={(e) => setStudentCourse(e.target.value)} /><br />

        <button type="submit">Submit Application</button>
        <button type="button" onClick={onCancel}>Cancel Application</button>
      </form>
    </div>
  );
}

// Visual template to render individual student profile cards on the screen
// This function is rendered when student clicked on Student data button in My button component.
function StudentDirectory({ studentList, onClose }) {
  if (studentList.length === 0) {
    return (
      <div style={{ marginTop: '20px' }}>
        <p>No student applications found in the database.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Registered Students Directory</h3>
        <button onClick={onClose} style={{ padding: '5px 12px' }}>Close List</button>
      </div>

      {studentList.map((student) => (
        <div key={student.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '15px 0', borderRadius: '5px' }}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Phone:</strong> {student.phone_number}</p>
          <p><strong>Course/Branch:</strong> {student.course}</p>
        </div>
      ))}
    </div>
  );
}

// This is resonsible for MyButton component.
function MyButton() {
  const [studentForm, setStudentForm] = useState(false);
  const [aboutCollege, setAboutCollege] = useState("");
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);

  function handleStudentForm() {
    setStudentForm(true);
  }

  function handleAboutUs() {
    if (aboutCollege === "") {
      setAboutCollege("The students are given utmost encouragement in their areas of interest by providing hi-tech facilities backed by faculty support. The institute places top priority on innovative programs that include both traditional classroom theory and professional skills training. There is a strong emphasis on overall personality development of the students, including soft skills. Students are supported through mentoring and counselling systems. The management offers scholarships to meritorious students. NHCE has a unique distinction of achieving 100% admissions in all its courses year after year.");
    } else {
      setAboutCollege("");
    }
  }

  async function handleStudentData() {
    try {
      const response = await fetch(`${API_URL}/api/students`);

      if (response.ok) {
        const result = await response.json();
        setStudents(result.data);
        setShowStudents(true);
        setAboutCollege("");
      } else {
        alert(`Server Error: Received status code ${response.status}`);
      }
    } catch (networkError) {
      console.error("Could not reach the server:", networkError);
      alert(`Network Error: Could not connect to ${API_URL}. Is the backend server running?`);
    }
  }

  if (studentForm) {
    return (
      <div>
        <ApplicationForm onCancel={() => setStudentForm(false)} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleStudentForm}>Register</button>
      <button onClick={handleStudentData}>Student Data</button>
      <button onClick={handleAboutUs}>{aboutCollege ? "Hide About" : "About Us"}</button>

      {aboutCollege && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p>{aboutCollege}</p>
        </div>
      )}

      {showStudents && (
        <StudentDirectory
          studentList={students}
          onClose={() => setShowStudents(false)}
        />
      )}
    </div>
  );
}


// This is main componens list these component only we seeing on the GUI. (Remember we calling component inside another component )
function App() {
  return (
    <div className="App-Container">
      <MyLogo />
      <MyCollegeInfo />
      <MyButton />
    </div>
  );
}

export default App;
