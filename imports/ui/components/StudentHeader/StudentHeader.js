import './StudentHeader.html';
import { studentInfo } from '../studentInfo.js';
import { HISTORY } from '../../../startup/both/index.js';

Template.studentheader.helpers({
    student() {
        return studentInfo.get();
    },
    saldo() {
        const student = studentInfo.get();
        let html = '<span class="value" ';

        if (typeof student === 'object') {
            let tmpTotal = 0;
            HISTORY.find({ studentID: student._id }, { fields: { charge: 1 } }).forEach((doc) => {
                tmpTotal += doc.charge;
            });
            if (tmpTotal > 0) {
                html += 'style="color: red;"';
            } else if (tmpTotal < 0) {
                html += 'style="color: green;"';
            }
            html += `> ${tmpTotal.toLocaleString()}`;
        } else {
            html += '>';
        }
        html += '</span>';
        return html;
    }
});
Template.studentheader.onCreated(function () {
    this.autorun(() => {
        const student = studentInfo.get();
        if (typeof student === 'object') {
            this.subscribe('history', student._id);
        }
    });
});
