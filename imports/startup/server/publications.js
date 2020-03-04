import { check, Match } from 'meteor/check';
import { STUDENTS, HISTORY } from '../both/index.js';

const NonEmptyString = Match.Where((x) => {
    check(x, String);
    return x.length > 0;
});

STUDENTS.allow({
    insert(id, doc) {
        const validGrade = Match.Where((x) => {
            check(x, String);
            const isGrade = /(^[0-9]{1,2}[A-C]$)|P[A-C]|PK[A-C]|K[A-C]/;

            return isGrade.test(x);
        });
        check(doc.fullname, NonEmptyString);
        check(doc.grade, validGrade);

        return true;
    } // ,
    // update(userId, doc) {
    //     return doc.owner === userId;
    // },
    // remove(userId, doc) {
    //     return doc.owner === userId;
    // }
});

HISTORY.allow({
    insert(id, doc) {
        check(doc.studentID, NonEmptyString);
        check(doc.date, Date);
        check(doc.charge, Number);
        check(doc.concept, NonEmptyString);

        return true;
    },
    update(userId, doc) {
        return typeof doc._id === 'string';
    },
    remove(userId, doc) {
        return typeof doc._id === 'string';
    }
});

Meteor.publish('studentsList', () => STUDENTS.find({}, { sort: { fullname: 1 } }));


Meteor.publish('history', (studentID) => {
    check(studentID, NonEmptyString);
    return HISTORY.find({ studentID }, { sort: { date: 1 } });
});

Meteor.publish('balance', () => HISTORY.find({}, { fields: { charge: 1 } }));
