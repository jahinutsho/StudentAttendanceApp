import { useState, useEffect } from "react";

const App = () => {
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editableStudent, setEditableStudent] = useState(null);

  // Load students from localStorage on component mount
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  // Save students to localStorage whenever the students array changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (studentName.trim() === "") {
      alert("Please enter a student name");
      return;
    }
    editMode ? updateHandler() : createHandler();
  };

  const changeHandler = (e) => {
    setStudentName(e.target.value);
  };

  const createHandler = () => {
    const newStudent = {
      id: Date.now(),
      name: studentName,
      isPresent: undefined,
    };
    setStudents([...students, newStudent]);
    setStudentName("");
  };

  const updateHandler = () => {
    const updatedStudents = students.map((student) =>
      student.id === editableStudent.id ? { ...student, name: studentName } : student
    );
    setStudents(updatedStudents);
    setStudentName("");
    setEditMode(false);
    setEditableStudent(null);
  };

  const deleteHandler = (studentId) => {
    const updatedStudents = students.filter((student) => student.id !== studentId);
    setStudents(updatedStudents);
  };

  const editStudentHandler = (student) => {
    setEditMode(true);
    setStudentName(student.name);
    setEditableStudent(student);
  };

  const toggleAttendance = (studentId) => {
    const updatedStudents = students.map((student) =>
      student.id === studentId ? { ...student, isPresent: !student.isPresent } : student
    );
    setStudents(updatedStudents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-pink-500 flex items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-5xl bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 md:p-10">
        <form
          onSubmit={submitHandler}
          className="mb-8 flex flex-wrap gap-4 items-center justify-center"
        >
          <input
            type="text"
            value={studentName}
            onChange={changeHandler}
            placeholder="Enter student name"
            className="w-full sm:w-2/3 p-3 rounded-lg bg-white/50 backdrop-blur-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-300"
          >
            {editMode ? "Update Student" : "Add Student"}
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* All Students */}
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
              All Students
            </h2>
            <ul className="space-y-3">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/70 rounded-lg shadow-sm"
                >
                  <span className="text-gray-800">{student.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editStudentHandler(student)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(student.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      {student.isPresent ? "Mark Absent" : "Mark Present"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Present Students */}
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
              Present Students
            </h2>
            <ul className="space-y-3">
              {students
                .filter((student) => student.isPresent === true)
                .map((student) => (
                  <li
                    key={student.id}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/70 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-800">{student.name}</span>
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Move to Absent
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          {/* Absent Students */}
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
              Absent Students
            </h2>
            <ul className="space-y-3">
              {students
                .filter((student) => student.isPresent === false)
                .map((student) => (
                  <li
                    key={student.id}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/70 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-800">{student.name}</span>
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Move to Present
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
