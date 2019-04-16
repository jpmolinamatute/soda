import { ReactiveVar } from 'meteor/reactive-var';
import { STUDENTS, HISTORY } from '../../startup/both/index.js';

function studentEqual(currentStudent, newStudent) {
    return typeof currentStudent === 'object'
        && typeof newStudent === 'object'
        && currentStudent.studentID === newStudent.studentID
        && currentStudent.balance === newStudent.balance;
}

const studentInfo = new ReactiveVar(false, studentEqual);

function setStudentInfo(studentID) {
    let info = false;
    if (STUDENTS.find({ _id: studentID }).count() === 1) {
        info = STUDENTS.findOne({ _id: studentID });
        Meteor.subscribe('history', info._id, () => {
            info.balance = 0;
            HISTORY.find({ studentID }, { fields: { charge: 1 } }).forEach((doc) => {
                if (typeof doc.charge === 'number') {
                    info.balance += doc.charge;
                }
            });
            studentInfo.set(info);
        });
    } else if (typeof studentID === 'boolean') {
        info = studentID;
        studentInfo.set(info);
    }
}

export { studentInfo, setStudentInfo };
