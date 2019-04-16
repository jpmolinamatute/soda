import './StudentHeader.html';
import { studentInfo } from '../studentInfo.js';

Template.studentheader.helpers({
    student() {
        return studentInfo.get();
    },
    saldo() {
        const student = studentInfo.get();
        let html = '<span class="value" ';

        if (typeof student === 'object') {
            const balance = student.balance;

            if (balance > 0) {
                html += 'style="color: red;"';
            } else if (balance < 0) {
                html += 'style="color: green;"';
            }
            html += `> ${balance.toLocaleString()}`;
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
