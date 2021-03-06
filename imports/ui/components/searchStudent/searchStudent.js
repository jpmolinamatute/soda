import './searchStudent.html';
import '../addStudent/addStudent.js';
import '../runBackup/runBackup.js';
import { STUDENTS } from '../../../startup/both/index.js';
import { setStudentInfo } from '../studentInfo.js';

const isGrade = /(^[0-9]{1,2}[A-D]$)|P[A-C]|PK[A-C]|K[A-C]/;
const LIMIT = 30;

function resetSearch(templateInstance, id) {
    setStudentInfo(id);
    templateInstance.studentName.set(false);
    document.getElementById('search-student').value = '';
    templateInstance.indexSeleted.set(0);
}

Template.searchstudent.helpers({
    students() {
        let name = Template.instance().studentName.get();
        let list = false;
        if (typeof name === 'string' && name.length > 1) {
            let QUERY;

            if (isGrade.test(name)) {
                name = name.toUpperCase();
                QUERY = {
                    grade: name
                };
            } else {
                name = name.toLowerCase();
                QUERY = { fullname: { $regex: new RegExp(name) } };
            }

            list = STUDENTS.find(QUERY, { sort: { fullname: 1 }, limit: LIMIT });
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
    isActive(index) {
        const current = Template.instance().indexSeleted.get();
        return index === current;
    }
});

Template.searchstudent.events({
    'keyup input#search-student': (event, templateInstance) => {
        let name = event.currentTarget.value;
        name = name.trim();
        name = name.toLowerCase();
        templateInstance.studentName.set(name);
    },
    'keydown input#search-student': (event, templateInstance) => {
        let current = templateInstance.indexSeleted.get();
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (event.key === 'ArrowDown' && current < LIMIT) {
                current += 1;
            } else if (event.key === 'ArrowUp' && current > 0) {
                current -= 1;
            }
            templateInstance.indexSeleted.set(current);
            event.preventDefault();
        } else if (event.key === 'Enter') {
            const button = document.querySelector(`div#student-list button[data-index="${current}"]`);
            if (button == null) {
                resetSearch(templateInstance, false);
            } else {
                resetSearch(templateInstance, button.dataset.id);
            }

            event.preventDefault();
        }
    },
    'click div#student-list button[data-type="student"]': (event, templateInstance) => {
        resetSearch(templateInstance, event.currentTarget.dataset.id);
        event.stopPropagation();
    },
    'click button#clear-student': (event, templateInstance) => {
        resetSearch(templateInstance, false);
        event.stopPropagation();
    },
    'click button#display-new-student': (event) => {
        // document.getElementById('add-student').style.display = 'block';
        const parent = document.getElementsByTagName('body')[0];
        const nextNode = document.getElementById('app-home');
        Blaze.render(Template.addStudent, parent, nextNode);
        event.stopPropagation();
    },
    'change input#all-students': (event, templateInstance) => {
        const checked = event.currentTarget.checked;
        document.getElementById('search-student').disabled = checked;
        resetSearch(templateInstance, checked);
    }
});

Template.searchstudent.onRendered(function searchstudentonRendered() {
    this.find('input#search-student').focus();
});

Template.searchstudent.onCreated(function searchstudentonCreated() {
    this.indexSeleted = new ReactiveVar(0);
    this.studentName = new ReactiveVar(false);
    Meteor.subscribe('studentsList');
});
