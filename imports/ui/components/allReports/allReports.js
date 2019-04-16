import './allReports.html';
import '../gradelist/gradelist';
import { filterDate } from '../../../startup/both/index.js';

function getSelectValues(select) {
    const result = [];
    const options = select && select.options;
    let opt;

    for (let i = 0, iLen = options.length; i < iLen; i += 1) {
        opt = options[i];

        if (opt.selected && opt.value.length > 0) {
            result.push(opt.value);
        }
    }
    return result.sort();
}


Template.allreports.events({
    'click button#print-all-history': (event) => {
        const radio = document.querySelector('div#right-panel div.right-bottom input[name="report-type"]:checked');
        const stringDate = filterDate(false, false);
        let inputSelect;
        let InputSelectValue;
        let reportType;
        if (radio.value === 'students' || radio.value === 'grades') {
            reportType = radio.value === 'students' ? 'detail' : 'summary';
            inputSelect = document.getElementById('report-filtered-grade');
            InputSelectValue = getSelectValues(inputSelect);
        } else {
            inputSelect = document.getElementById('top-number');
            InputSelectValue = inputSelect.value;
            if (InputSelectValue.length > 0) {
                reportType = 'top';
                InputSelectValue = parseInt(InputSelectValue, 10);
            }
        }

        if (typeof reportType === 'string') {
            Meteor.call('getReport', stringDate, reportType, InputSelectValue, (error, htmlString) => {
                if (error) {
                    console.error(error);
                } else {
                    const w = window.outerWidth;
                    const h = window.outerHeight;
                    const mywindow = window.open('', 'Print', `width=${w},height=${h}`, false);
                    mywindow.document.write(htmlString);
                    mywindow.document.close();
                    mywindow.focus();
                    if (radio.value === 'students' || radio.value === 'grades') {
                        inputSelect.value = '';
                    } else {
                        inputSelect.value = '5';
                    }
                }
            });
        }
        event.stopPropagation();
    },
    'change input[name="report-type"]': (event, templateInstance) => {
        const value = event.currentTarget.value;
        let active = false;
        if (value === 'students' || value === 'grades') {
            active = true;
        }
        templateInstance.studentgrade.set(active);
    }
});

Template.allreports.helpers({
    studentGrade() {
        return Template.instance().studentgrade.get();
    }
});

Template.allreports.onCreated(function allreportsonCreated() {
    this.studentgrade = new ReactiveVar(true);
});
