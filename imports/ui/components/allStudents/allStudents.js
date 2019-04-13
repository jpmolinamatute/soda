import './allStudents.html';
import '../gradelist/gradelist.js';
import { STUDENTS } from '../../../startup/both/index.js';

Template.allstudents.events({
    'change select#all-student-grade': (event, templateInstance) => {
        let grade = event.currentTarget.value;
        grade = grade.length > 0 ? grade : false;
        templateInstance.myGrade.set(grade);
    }
});

Template.allstudents.helpers({
    grade() {
        return Template.instance().myGrade.get();
    },
    list() {
        const grade = Template.instance().myGrade.get();

        return STUDENTS.find({ grade }, {
            fields: {
                fullname: 1
            },
            sort: {
                fullname: 1
            }
        });
    }
});

Template.allstudents.onCreated(function allstudentsonCreated() {
    this.myGrade = new ReactiveVar(false);
});
