import './home.html';
import '../../components/addStudent/addStudent.js';
import '../../components/history/history.js';
import { Mongo } from 'meteor/mongo';
import { STUDENTS, HISTORY } from '../../../startup/both/index.js';

const isGrade = /(^[0-9]{1,2}[a-d]$)|preparatorio|prekinder|maternal/;

function getToday() {
    const todayDate = new Date();
    let day = todayDate.getDate();
    let month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}`;
}

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
                document.getElementById('student-history'), document.getElementById('print-history'));
        }
        event.stopPropagation();
    },
    'blur div#right-panel input': (event) => {
        const value = event.currentTarget.value.trim();
        if (value.length > 0) {
            event.currentTarget.classList.remove('is-invalid');
        } else {
            event.currentTarget.classList.add('is-invalid');
        }
    },
    'click button#save-item': (event, templateInstance) => {
        const form = event.currentTarget.closest('div.needs-validation');
        const concept = document.getElementById('item-concept');
        const charge = document.getElementById('item-charge');
        const radios = document.getElementsByName('type');
        const inputDate = document.getElementById('datepicker');


        let type = '';
        radios.forEach((r) => {
            if (r.checked) {
                type = r.value;
            }
        });
        if (concept.value.length > 0
            && charge.value.length > 0
            && charge.value !== '0'
            && type.length > 0) {
            const studentID = templateInstance.studentID.get();
            let date = new Date();
            const arrayDate = inputDate.value.split('-');
            const inputDay = parseInt(arrayDate[2], 10);
            const inputMonth = parseInt(arrayDate[1], 10);
            const inputYear = parseInt(arrayDate[0], 10);
            if (inputYear !== date.getFullYear()
                || inputMonth !== date.getMonth() + 1
                || inputDay !== date.getDate()) {
                date = new Date(inputYear, inputMonth - 1, inputDay, 0, 0, 0, 0);
            }

            let chargenum = parseInt(charge.value, 10);

            if (type === 'pay') {
                chargenum *= -1;
            }

            HISTORY.insert({
                studentID,
                date,
                charge: chargenum,
                concept: concept.value
            });

            charge.value = '';
            concept.value = '';
            inputDate.value = getToday();
            radios.forEach((r) => {
                r.checked = false;
            });
            form.classList.remove('was-validated');
        } else {
            form.classList.add('was-validated');
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
                    grade: new RegExp(name, 'i')
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
        return balance;
    },
    getToday
});

// Template.appHome.onRendered(function () {
//     console.log(this.find('input#datepicker'));
//     const picker = new Pikaday({
//         field: this.find('input#datepicker') // ,
//         firstDay: 1,
//         minDate: new Date(year, 0, 1),
//         maxDate: new Date(year, 12, 31),
//         yearRange: [year - 1, year + 1]
//     });
// });
Template.appHome.onCreated(function appHomeonCreated() {
    this.studentName = new ReactiveVar(false);
    this.studentID = new ReactiveVar(false);
    this.customDate = false;
    this.hasStudentHistory = false;
    Meteor.subscribe('studentsList');
    Meteor.subscribe('balance');
});
