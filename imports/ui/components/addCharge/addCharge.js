import './addCharge.html';
import { HISTORY, filterDate } from '../../../startup/both/index.js';
import { studentInfo, setStudentInfo } from '../studentInfo.js';


function saveCharge(event) {
    const form = event.currentTarget.closest('div.needs-validation');
    const concept = document.getElementById('item-concept');
    const charge = document.getElementById('item-charge');
    const radioCharge = document.getElementById('type-charge');
    const radioPay = document.getElementById('type-pay');
    const inputDate = document.getElementById('datepicker');
    const type = radioCharge.checked ? radioCharge.value : radioPay.value;
    const student = studentInfo.get();
    if (typeof student === 'object'
        && concept.value.length > 0
        && charge.value.length > 0
        && charge.value !== '0') {
        const arrayDate = inputDate.value.split('-');
        const inputDay = parseInt(arrayDate[2], 10);
        const inputMonth = parseInt(arrayDate[1], 10);
        const inputYear = parseInt(arrayDate[0], 10);
        const date = new Date(inputYear, inputMonth - 1, inputDay, 0, 0, 0, 0);

        let chargenum = parseInt(charge.value, 10);

        if (type === 'pay') {
            chargenum *= -1;
        }
        HISTORY.insert({
            studentID: student._id,
            date,
            charge: chargenum,
            concept: concept.value,
            editMode: false
        }, () => {
            setStudentInfo(student._id);
        });

        charge.value = '';
        concept.value = '';
        concept.readOnly = false;
        inputDate.value = filterDate(false, true);
        radioCharge.checked = true;
        radioPay.checked = false;
        concept.focus();
        form.classList.remove('was-validated');
    } else {
        form.classList.add('was-validated');
    }
}


Template.addCharge.events({
    'blur div#right-panel div.right-top input': (event) => {
        const value = event.currentTarget.value.trim();
        if (value.length > 0) {
            event.currentTarget.classList.remove('is-invalid');
        } else {
            event.currentTarget.classList.add('is-invalid');
        }
    },
    'click button#save-item': (event) => {
        saveCharge(event);
        event.stopPropagation();
    },
    'keyup input#item-charge': (event) => {
        if (event.keyCode === 13) {
            saveCharge(event);
        }
    },
    'change input[type="radio"]:checked': (event) => {
        const value = event.currentTarget.value;
        const conceptInput = document.getElementById('item-concept');
        if (value === 'pay') {
            conceptInput.value = 'Estudiante pagó';
            conceptInput.readOnly = true;
        } else if (value === 'charge') {
            conceptInput.value = '';
            conceptInput.readOnly = false;
        }
    }
});


Template.addCharge.helpers({
    filterDate
});

Template.addCharge.onCreated(function addChargeonCreated() {
    this.studentName = new ReactiveVar(false);
});


Template.addCharge.onRendered(function () {
    this.find('input#item-concept').focus();
});
