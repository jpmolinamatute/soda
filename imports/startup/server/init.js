import { Meteor } from 'meteor/meteor';
import { HISTORY, STUDENTS } from '../both/index.js';

Meteor.startup(() => {
    if (Meteor.isDevelopment) {
        const proHistory = new Mongo.Collection('history');
        const proStudent = new Mongo.Collection('students');
        console.info('Removing data from historyDev');
        HISTORY.remove({});
        console.info('Removing data from studentDev');
        STUDENTS.remove({});
        proHistory.find({}).forEach((doc) => {
            HISTORY.insert(doc);
        });
        proStudent.find({}).forEach((doc) => {
            STUDENTS.insert(doc);
        });
    }
});
