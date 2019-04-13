import './home.html';
import '../../components/StudentHeader/StudentHeader.js';
import '../../components/addCharge/addCharge.js';
import '../../components/studentDetailHistory/studentDetailHistory.js';
import '../../components/allReports/allReports.js';
import '../../components/searchStudent/searchStudent.js';
import '../../components/allStudents/allStudents.js';
import { Blaze } from 'meteor/blaze';
import { studentInfo } from '../../components/studentInfo.js';
import { HISTORY } from '../../../startup/both/index.js';

Template.appHome.events({
    'click button#display-student-history': (event) => {
        const body = document.getElementById('app-home');
        Blaze.render(Template.studentdetailhistory, body);
        event.stopPropagation();
    }
});

Template.appHome.helpers({
    displayStudent() {
        return typeof studentInfo.get() === 'object';
    },
    saldo() {
        let balance = 0;
        HISTORY.find({}, { fields: { charge: 1 } }).forEach((doc) => {
            if (typeof doc.charge === 'number') {
                balance += doc.charge;
            }
        });

        return balance.toLocaleString();
    },
    studentList() {
        return studentInfo.get();
    }
});

Template.appHome.onCreated(function appHomeonCreated() {
    Meteor.subscribe('balance');
});
