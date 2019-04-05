import { Meteor } from 'meteor/meteor';
import './runBackup.html';

Template.runbackup.events({
    'click button': (event) => {
        Meteor.call('runBackups');
        event.stopPropagation();
    }
});
