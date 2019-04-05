import './studentDetailHistory.html';
import { studentInfo, validStudentInfo } from '../studentInfo.js';
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

Template.studentdetailhistory.helpers({
    history() {
        let cursor = false;
        const student = studentInfo.get();
        const total = Template.instance().total.get();
        if (typeof student === 'object'
            && total !== 0) {
            cursor = HISTORY.find({ studentID: student._id }, { sort: { date: 1 } });
        }

        return cursor;
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
    totalColor() {
        const total = Template.instance().total.get();
        let result = 'black';
        if (total > 0) {
            result = 'red';
        } else if (total < 0) {
            result = 'green';
        }
        return result;
    },
    totalString() {
        let result;
        const total = Template.instance().total.get();

        if (total > 0) {
            result = `Debe ${total.toLocaleString()} Colones`;
        } else if (total < 0) {
            result = `Tiene un saldo a su favor de  ${(total * -1).toLocaleString()} Colones`;
        } else {
            result = 'Tiene un balance en 0';
        }
        return result;
    },
    filterDate,
    getToday,
    onlyDate
});

Template.studentdetailhistory.events({
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
    },
    'click button#close-history': (event, templateInstance) => {
        document.getElementById('student-history').style.display = 'none';
        Blaze.remove(templateInstance.view);
        event.stopPropagation();
    },
    'click button#print-history': (event, templateInstance) => {
        const when = new Date();
        const stringDate = filterDate(when);
        const student = studentInfo.get();
        if (typeof student === 'object') {
            Meteor.call('studentBalance', stringDate, student, (error, htmlString) => {
                if (error) {
                    console.error(error);
                } else {
                    const w = window.outerWidth;
                    const h = window.outerHeight;
                    const mywindow = window.open('', 'Print', `width=${w},height=${h}`, false);
                    mywindow.document.write(htmlString);
                    mywindow.document.close();
                    mywindow.focus();
                    document.getElementById('student-history').style.display = 'none';
                    Blaze.remove(templateInstance.view);
                }
            });
        }
        event.stopPropagation();
    }
});

Template.studentdetailhistory.onCreated(function historyonCreated() {
    this.total = new ReactiveVar(0);
    this.autorun(() => {
        const student = studentInfo.get();
        if (typeof student === 'object') {
            this.subscribe('history', student._id, () => {
                let tmpTotal = 0;
                HISTORY.find({ studentID: student._id }, { fields: { charge: 1 } }).forEach((doc) => {
                    tmpTotal += doc.charge;
                });
                this.total.set(tmpTotal);
            });
        }
    });
});

Template.studentdetailhistory.onRendered(function studentdetailhistoryonRendered() {
    this.find('div#student-history').style.display = 'block';
});
