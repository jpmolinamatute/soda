// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.


import { Mongo } from 'meteor/mongo';


const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
let HISTORY;
let STUDENTS;

if (Meteor.isDevelopment) {
    HISTORY = new Mongo.Collection('historyDev');
    STUDENTS = new Mongo.Collection('studentsDev');
} else if (Meteor.isProduction) {
    HISTORY = new Mongo.Collection('history');
    STUDENTS = new Mongo.Collection('students');
}

function filterDate(somedate) {
    let str = false;
    if (somedate instanceof Date) {
        let day = somedate.getDate();
        let month = somedate.getMonth();
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
        month = MONTHS[month];
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


export { HISTORY, STUDENTS, filterDate };
