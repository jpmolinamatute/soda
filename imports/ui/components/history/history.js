import './history.html';
import { HISTORY } from '../../../startup/both/index.js';

export function filterDate(somedate) {
    let str = false;
    if (somedate instanceof Date) {
        let day = somedate.getDate();
        let month = somedate.getMonth() + 1;
        const year = somedate.getFullYear();
        let hour = somedate.getHours();
        let min = somedate.getMinutes();
        const sec = somedate.getSeconds();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        let defaultTime = true;
        if (hour === 0 && min === 0 && sec === 0) {
            defaultTime = false;
        }
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        min = min < 10 ? `0${min}` : min;

        if (hour > 12) {
            hour -= 12;
        } else if (hour === 0) {
            hour = 12;
        } else if (hour < 10) {
            hour = `0${hour}`;
        }
        if (defaultTime) {
            str = `${day}/${month}/${year}  ${hour}:${min} ${ampm}`;
        } else {
            str = `${day}/${month}/${year}`;
        }
    }

    return str;
}

Template.history.helpers({
    history() {
        const studentID = this.studentID;
        return HISTORY.find({ studentID }, { sort: { date: 1 } });
    },
    filterCharge(sign, charge) {
        let label = ' - ';
        if ((charge > 0 && sign === '+') || (charge < 0 && sign === '-')) {
            label = charge;
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
    filterDate
});

Template.history.onCreated(function () {
    this.subscribe('history', this.data.studentID);
});

Template.history.onRendered(() => {
    document.getElementById('student-history').style.display = 'block';
});
