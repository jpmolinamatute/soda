import './home.html';
import '../../components/addStudent/addStudent.js';
import '../../components/addCharge/addCharge.js';
import { Mongo } from 'meteor/mongo';

import { STUDENTS, HISTORY } from '../../../startup/both/index.js';

const isGrade = /(^[0-9]{1,2}[a-d]$)|preparatorio|prekinder|maternal/;


Template.appHome.events({
    'click button#display-new-student': (event) => {
        document.getElementById('add-student').style.display = 'block';
        event.stopPropagation();
    },
    'keyup input#search-student': (event, templateInstance) => {
        let name = event.currentTarget.value;
        name = name.trim();
        name = name.toLowerCase();
        templateInstance.studentName.set(name);
    },
    'click div#student-list button[data-type="student"]': (event, templateInstance) => {
        templateInstance.studentID.set(event.currentTarget.dataset.id);
        templateInstance.studentName.set(false);
        document.getElementById('search-student').value = '';
        event.stopPropagation();
    },
    'click button#display-student-history': (event, templateInstance) => {
        const studentID = templateInstance.studentID.get();
        if (templateInstance.hasStudentHistory) {
            Blaze.remove(templateInstance.hasStudentHistory);
        }
        if (typeof studentID === 'string') {
            templateInstance.hasStudentHistory = Blaze.renderWithData(Template.history, { studentID },
                document.getElementById('student-history'), document.getElementById('student-history-controls'));
        }
        event.stopPropagation();
    },
    'click button#close-history': (event, templateInstance) => {
        document.getElementById('student-history').style.display = 'none';
        if (templateInstance.hasStudentHistory) {
            Blaze.remove(templateInstance.hasStudentHistory);
            templateInstance.hasStudentHistory = false;
        }
        event.stopPropagation();
    },
    'click button#print-all-history': (event) => {
        Meteor.call('allBalance', (error, htmlString) => {
            if (error) {
                console.error(error);
            } else if (typeof htmlString === 'string') {
                const w = window.outerWidth;
                const h = window.outerHeight;
                const mywindow = window.open('', 'Print', `width=${w},height=${h}`, false);
                mywindow.document.write(htmlString);
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
            }
        });
        event.stopPropagation();
    }
});

Template.appHome.helpers({
    students() {
        const name = Template.instance().studentName.get();
        let list = false;
        if (typeof name === 'string' && name.length > 1) {
            let QUERY;

            if (isGrade.test(name)) {
                QUERY = {
                    grade: name.toUpperCase()
                };
            } else {
                QUERY = {
                    $or: [
                        { name: { $regex: new RegExp(name) } },
                        { middle: { $regex: new RegExp(name) } },
                        { last1: { $regex: new RegExp(name) } },
                        { last2: { $regex: new RegExp(name) } }
                    ]
                };
            }

            list = STUDENTS.find(QUERY, { sort: { name: 1 } });
        }
        return list;
    },
    studentName() {
        const name = Template.instance().studentName.get();
        let valid = false;

        if (typeof name === 'string' && (name.length > 1 || isGrade.test(name))) {
            valid = name;
        }

        return valid;
    },
    hasStudent(cursor) {
        let valid = false;
        if (cursor instanceof Mongo.Cursor) {
            valid = cursor.fetch().length > 0;
        }
        return valid;
    },
    filter(txt, bold) {
        let filteredTXT = '';
        if (typeof txt === 'string' && txt !== 'na') {
            const name = Template.instance().studentName.get();
            if (bold === 'yes') {
                const regex = new RegExp(name);
                if (regex.test(txt)) {
                    filteredTXT = `<b>${txt.charAt(0).toUpperCase()}${txt.substring(1)}</b>`;
                } else {
                    filteredTXT = `${txt.charAt(0).toUpperCase()}${txt.substring(1)}`;
                }
            } else {
                filteredTXT = `${txt.charAt(0).toUpperCase()}${txt.substring(1)}`;
            }
        }
        return filteredTXT;
    },
    oneStudent() {
        const _id = Template.instance().studentID.get();
        return STUDENTS.findOne({ _id });
    },
    studentID() {
        return Template.instance().studentID.get();
    },
    displayStudent() {
        return typeof Template.instance().studentID.get() === 'string';
    },
    saldo() {
        let balance = 0;
        HISTORY.find({}, { fields: { charge: 1 } }).forEach((doc) => {
            if (typeof doc.charge === 'number') {
                balance += doc.charge;
            }
        });
        // return new Intl.NumberFormat('es-CR', { localeMatcher: 'best fit', style: 'currency', currency: 'CRC' })
        // .format(balance);
        return balance;
    },
    htmlString() {
        return Template.instance().htmlString.get();
    }
});

Template.appHome.onRendered(function () {
    this.find('input#search-student').focus();
});

Template.appHome.onCreated(function appHomeonCreated() {
    this.studentName = new ReactiveVar(false);
    this.studentID = new ReactiveVar(false);
    this.hasStudentHistory = false;
    Meteor.subscribe('studentsList');
    Meteor.subscribe('balance');
});
