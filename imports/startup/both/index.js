// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.


import { Mongo } from 'meteor/mongo';

const STUDENTS = new Mongo.Collection('students');

let HISTORY;

if (Meteor.isDevelopment) {
    HISTORY = new Mongo.Collection('history-dev');
} else if (Meteor.isProduction) {
    HISTORY = new Mongo.Collection('history');
}

export { HISTORY, STUDENTS };
