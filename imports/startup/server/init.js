import { Meteor } from 'meteor/meteor';
import { HISTORY } from '../both/index.js';

Meteor.startup(() => {
    if (Meteor.isDevelopment) {
        const pro = new Mongo.Collection('history');
        HISTORY.remove({});
        pro.find({}).forEach((doc) => {
            HISTORY.insert(doc);
        });
    }
});
