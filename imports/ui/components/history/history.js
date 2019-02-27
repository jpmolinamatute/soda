import './history.html';
import { HISTORY, filterDate } from '../../../startup/both/index.js';
import { getToday } from '../addCharge/addCharge.js';

function onlyDate(somedate) {
    return getToday(somedate);
}

function saveCharge(event, _id) {
    const form = event.currentTarget.closest('tr.needs-validation');
    const concept = document.getElementById('edit-item-concept');
    const charge = document.getElementById('edit-item-charge');
    const radioCharge = document.getElementById('edit-type-charge');
    const radioPay = document.getElementById('edit-type-pay');
    const inputDate = document.getElementById('edit-datepicker');
    const type = radioCharge.checked ? radioCharge.value : radioPay.value;

    if (concept.value.length > 0
        && charge.value.length > 0
        && charge.value !== '0'
        && type.length > 0) {
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

        HISTORY.update({ _id }, {
            $set: {
                date,
                charge: chargenum,
                concept: concept.value,
                editMode: false
            }
        });
        form.classList.remove('was-validated');
    } else {
        form.classList.add('was-validated');
    }
}
Template.history.helpers({
    history() {
        const studentID = this.studentID;
        return HISTORY.find({ studentID }, { sort: { date: 1 } });
    },
    isCharge(charge) {
        return charge > 0;
    },
    isPay(charge) {
        return charge < 0;
    },
    filterCharge(sign, charge) {
        let label = ' - ';
        if ((charge > 0 && sign === '+') || (charge < 0 && sign === '-')) {
            label = charge.toLocaleString();
        }
        return label;
    },
    total() {
        let result = 0;
        const studentID = this.studentID;
        HISTORY.find({ studentID }, { fields: { charge: 1 } }).forEach((doc) => {
            result += doc.charge;
        });
        if (result > 0) {
            result = `Debe ${result} Colones`;
        } else if (result < 0) {
            result = `Tiene un saldo a su favor de  ${result * -1} Colones`;
        } else {
            result = 'tiene un balance en 0';
        }
        return result;
    },
    filterDate,
    getToday,
    onlyDate
});

Template.history.onCreated(function () {
    this.subscribe('history', this.data.studentID);
});

Template.history.events({
    'click div#history-wrap table td button[data-type="save"]': function clickHistory(event) {
        const _id = this._id;
        saveCharge(event, _id);

        event.stopPropagation();
    },
    'click div#history-wrap table td button[data-type="edit"]': function clickHistory(event) {
        const _id = this._id;
        HISTORY.update({ _id }, { $set: { editMode: true } });
        event.stopPropagation();
    },
    'click div#history-wrap table td button[data-type="delete"]': function clickHistory(event) {
        const _id = this._id;
        HISTORY.remove({ _id });
        event.stopPropagation();
    }
});

Template.history.onRendered(() => {
    document.getElementById('student-history').style.display = 'flex';
});
