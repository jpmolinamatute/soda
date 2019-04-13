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
    const list = ['student-fullname', 'student-grade', 'student-phone', 'student-email'];
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
        const fullname = getName('student-fullname');
        let phone = getName('student-phone');
        let email = getName('student-email');
        const grade = document.getElementById('student-grade').value;
        const fieldset = event.currentTarget.closest('div.needs-validation');
        phone = phone.length > 0 ? phone : undefined;
        email = email.length > 0 ? email : undefined;

        if (fullname.length > 0
            && grade.length > 0) {
            const wasFound = STUDENTS.findOne({
                fullname,
                grade
            });

            if (typeof wasFound === 'undefined') {
                STUDENTS.insert({
                    fullname,
                    phone,
                    email,
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
});

Template.addStudent.onRendered(function () {
    this.find('input#student-fullname').focus();
});
