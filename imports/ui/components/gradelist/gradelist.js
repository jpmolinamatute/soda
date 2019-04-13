import './gradelist.html';

Template.gradelist.helpers({
    list() {
        return Template.instance().list.get();
    }
});

Template.gradelist.onCreated(function gradelistonCreated() {
    this.list = new ReactiveVar(false);
    Meteor.call('getGradeList', true, (error, list) => {
        if (error) {
            console.error(error);
        } else {
            this.list.set(list);
        }
    });
});
