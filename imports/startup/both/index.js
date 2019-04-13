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

function filterDate(somedate, input = false) {
    let str = false;
    let myDate;

    if (typeof somedate === 'number' || typeof somedate === 'string') {
        myDate = new Date(somedate);
    } else if (somedate instanceof Date) {
        myDate = somedate;
    } else {
        myDate = new Date();
    }
    let day = myDate.getDate();
    let month = myDate.getMonth();
    const year = myDate.getFullYear();
    day = day < 10 ? `0${day}` : day;

    if (input) {
        month += 1;
        month = month < 10 ? `0${month}` : month;
        str = `${year}-${month}-${day}`;
    } else {
        month = MONTHS[month];
        str = `${day}/${month}/${year}`;
    }

    return str;
}


export { HISTORY, STUDENTS, filterDate };
