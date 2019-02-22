import './addCharge.html';
import { HISTORY } from '../../../startup/both/index.js';

function getToday(somedate) {
    let todayDate;
    if (typeof somedate === 'undefined') {
        todayDate = new Date();
    } else {
        todayDate = new Date(somedate);
    }

    let day = todayDate.getDate();
    let month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}`;
}

function saveCharge(event, templateInstance) {
    const form = event.currentTarget.closest('div.needs-validation');
    const concept = document.getElementById('item-concept');
    const charge = document.getElementById('item-charge');
    const radioCharge = document.getElementById('type-charge');
    const radioPay = document.getElementById('type-pay');
    const inputDate = document.getElementById('datepicker');
    const type = radioCharge.checked ? radioCharge.value : radioPay.value;


    if (concept.value.length > 0
        && charge.value.length > 0
        && charge.value !== '0'
        && type.length > 0) {
        const studentID = templateInstance.data.studentID;


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
            concept: concept.value,
            editMode: false
        });

        charge.value = '';
        concept.value = '';
        inputDate.value = getToday();
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
    'click button#save-item': (event, templateInstance) => {
        saveCharge(event, templateInstance);
        event.stopPropagation();
    },
    'keyup input#item-charge': (event, templateInstance) => {
        if (event.keyCode === 13) {
            saveCharge(event, templateInstance);
        }
    }
});


Template.addCharge.helpers({
    getToday
});

Template.addCharge.onCreated(function addChargeonCreated() {
    this.studentName = new ReactiveVar(false);
});


Template.addCharge.onRendered(function () {
    this.find('input#item-concept').focus();
});

export { getToday };
