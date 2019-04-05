import { ReactiveVar } from 'meteor/reactive-var';
import { STUDENTS } from '../../startup/both/index.js';

function studentEqual(currentStudent, newStudent) {
    return typeof currentStudent === 'object'
        && typeof newStudent.studentID === 'object'
        && currentStudent === newStudent.studentID;
}

const studentInfo = new ReactiveVar(false, studentEqual);

function setStudentInfo(studentID) {
    let info = false;
    if (STUDENTS.find({ _id: studentID }).count() === 1) {
        info = STUDENTS.findOne({ _id: studentID });
    }
    studentInfo.set(info);
}

export { studentInfo, setStudentInfo };
