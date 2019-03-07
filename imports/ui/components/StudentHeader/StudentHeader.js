import './StudentHeader.html';
import { STUDENTS } from '../../../startup/both/index.js';

Template.studentheader.helpers({
    student() {
        return STUDENTS.findOne({ _id: this.studentID });
    }
});
