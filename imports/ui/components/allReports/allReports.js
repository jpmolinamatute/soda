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
    'click button#print-all-history': (event, templateInstance) => {
        const reportType = templateInstance.studentgrade.get();
        const stringDate = filterDate(false, false);
        let reportValue;
        let elem1;
        let elem2;

        if (reportType === 'students' || reportType === 'grades') {
            elem1 = document.getElementById('report-filtered-grade');
            reportValue = getSelectValues(elem1);
        } else if (reportType === 'top') {
            elem1 = document.getElementById('top-number');
            const value = parseInt(elem1.value, 10);
            reportValue = isNaN(value) ? 5 : value;
        } else if (reportType === 'closing') {
            elem1 = document.getElementById('closing-number');
            elem2 = document.getElementById('closing-type');
            let num = parseInt(elem1.value, 10);
            num = isNaN(num) ? 1 : num;
            const type = elem2.value;
            const date = Date.now();
            reportValue = JSON.stringify({ num, type, date });
        }

        if (typeof reportType === 'string' && typeof reportValue !== 'undefined') {
            Meteor.call('getReport', stringDate, reportType, reportValue, (error, htmlString) => {
                if (error) {
                    console.error(error);
                } else {
                    const w = window.outerWidth;
                    const h = window.outerHeight;
                    const mywindow = window.open('', 'Print', `width=${w},height=${h}`, false);
                    mywindow.document.write(htmlString);
                    mywindow.document.close();
                    mywindow.focus();

                    if (reportType === 'students' || reportType === 'grades') {
                        elem1.value = '';
                    } else if (reportType === 'top') {
                        elem1.value = '5';
                    } else if (reportType === 'closing') {
                        elem1.value = '1';
                        elem2.value = 'h';
                    }
                }
            });
        } else {
            console.error('Error: no hay informacion suficiente para crear el reporte');
        }
        event.stopPropagation();
    },
    'change input[name="report-type"]': (event, templateInstance) => {
        const value = event.currentTarget.value;

        templateInstance.studentgrade.set(value);
    }
});

Template.allreports.helpers({
    isGrade() {
        const value = Template.instance().studentgrade.get();
        return value === 'students' || value === 'grades';
    },
    isTop() {
        const value = Template.instance().studentgrade.get();
        return value === 'top';
    },
    isClosing() {
        const value = Template.instance().studentgrade.get();
        return value === 'closing';
    }
});

Template.allreports.onCreated(function allreportsonCreated() {
    this.studentgrade = new ReactiveVar('students');
});
