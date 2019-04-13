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
        const stringDate = filterDate(false, false);
        const element = document.querySelector('div#right-panel div.right-bottom input[name="report-type"]:checked');
        const select = document.getElementById('report-filtered-grade');
        const selectValues = getSelectValues(select);


        Meteor.call('allBalance', stringDate, element.value, selectValues, (error, htmlString) => {
            if (error) {
                console.error(error);
            } else {
                const w = window.outerWidth;
                const h = window.outerHeight;
                const mywindow = window.open('', 'Print', `width=${w},height=${h}`, false);
                mywindow.document.write(htmlString);
                mywindow.document.close();
                mywindow.focus();
                select.value = '';
            }
        });
        event.stopPropagation();
    }
});
