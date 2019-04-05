import './addStudent.html';
import '../gradelist/gradelist';
import { Blaze } from 'meteor/blaze';
import { STUDENTS } from '../../../startup/both/index.js';

function getName(elementID) {
    let name = document.getElementById(elementID).value;
    name = name.trim();
    return name.toLowerCase();
}

function clearAllFields(templateInstance) {
    const list = ['student-name', 'student-middle', 'student-last1', 'student-last2', 'student-grade'];
    list.forEach((e) => {
        const field = document.getElementById(e);
        if (field !== null) {
            field.value = '';
            field.classList.remove('is-invalid');
        }
    });
    Blaze.remove(templateInstance.view);
}

Template.addStudent.events({
    'blur input, blur select': (event) => {
        const value = event.currentTarget.value.trim();

        if (event.currentTarget.required) {
            if (value.length > 0) {
                event.currentTarget.classList.remove('is-invalid');
            } else {
                event.currentTarget.classList.add('is-invalid');
            }
        }
    },
    'click button#student-save': (event, templateInstance) => {
        const name = getName('student-name');
        const middle = getName('student-middle');
        const last1 = getName('student-last1');
        const last2 = getName('student-last2');
        const grade = document.getElementById('student-grade').value;
        const fieldset = event.currentTarget.closest('div.needs-validation');
        if (name.length > 0
            && last1.length > 0
            && grade.length > 0) {
            const wasFound = STUDENTS.findOne({
                name,
                middle,
                last1,
                last2
            });
            if (typeof wasFound === 'undefined') {
                STUDENTS.insert({
                    name,
                    middle,
                    last1,
                    last2,
                    grade
                });
            }
            fieldset.classList.remove('was-validated');
            clearAllFields(templateInstance);
        } else {
            fieldset.classList.add('was-validated');
        }
        event.stopPropagation();
    },
    'click button#student-close': (event, templateInstance) => {
        const fieldset = event.currentTarget.closest('div.needs-validation');
        fieldset.classList.remove('was-validated');
        clearAllFields(templateInstance);
        event.stopPropagation();
    }
    // 'keyup input#student-search': (event, templateInstance) => {
    //     const name = event.currentTarget.value;
    //     Meteor.subscribe('studentsList', name);
    // }
});

Template.addStudent.onRendered(function () {
    this.find('input#student-name').focus();
});
