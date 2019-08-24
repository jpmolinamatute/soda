import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { exec } from 'child_process';
import { STUDENTS, HISTORY, filterDate } from '../both/index.js';

let isBackupReady = true;
function runBackups() {
    this.unblock();
    if (isBackupReady) {
        isBackupReady = false;
        exec('/web/backup/export', (error, stdout, stderr) => {
            if (error === null) {
                isBackupReady = true;
            }
            console.info(stdout);
            console.info('-------');
            console.error(stderr);
        });
    }
}
function sortSecundaria(a, b) {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    let result = 0;

    if (numA > numB) {
        result = 1;
    } else if (numA < numB) {
        result = -1;
    }
    return result;
}

function getGradeList(divided) {
    let list = [];

    const cursor = STUDENTS.find({}, {
        fields: {
            _id: 0,
            grade: 1
        },
        sort: {
            grade: 1
        },
        reactive: false
    });
    if (divided) {
        const regexPrimaria = /^[0-6][A-C]$/;
        const regexSecundaria = /^[7-9][A-C]$|^1[0-2][A-C]$/;
        const regexPrescolar = /^P$|^PK$|^K$/;
        list = {
            prescolar: [],
            primaria: [],
            secundaria: []
        };
        cursor.forEach((doc) => {
            if (regexPrimaria.test(doc.grade)
                && !list.primaria.includes(doc.grade)) {
                list.primaria.push(doc.grade);
            } else if (regexSecundaria.test(doc.grade)
                && !list.secundaria.includes(doc.grade)) {
                list.secundaria.push(doc.grade);
            } if (regexPrescolar.test(doc.grade)
                && !list.prescolar.includes(doc.grade)) {
                list.prescolar.push(doc.grade);
            }
        });
        list.primaria.sort();
        list.prescolar.sort();
        list.secundaria.sort(sortSecundaria);
    } else {
        list = [];
        cursor.forEach((doc) => {
            if (!list.includes(doc.grade)) {
                list.push(doc.grade);
            }
        });
        list.sort(sortSecundaria);
    }
    return list;
}

function getHistoryAggregate() {
    const rawHistory = HISTORY.rawCollection();
    return Meteor.wrapAsync(rawHistory.aggregate, rawHistory);
}

function getPipeline(reportType, criteria) {
    let pipeline = false;

    if (reportType === 'detail' || reportType === 'summary') {
        const group = { $group: { _id: '$studentID', balance: { $sum: '$charge' } } };
        const match2 = { $match: { balance: { $ne: 0 } } };
        pipeline = [];
        if (Array.isArray(criteria) && criteria.length > 0) {
            const match1 = { $match: {} };
            if (criteria.length === 1) {
                match1.$match.studentID = criteria[0];
            } else {
                match1.$match.studentID = { $in: criteria };
            }
            pipeline.push(match1);
        }

        pipeline.push(group, match2);
    } else if (reportType === 'top' && criteria > 0) {
        const group = { $group: { _id: '$studentID', balance: { $sum: '$charge' } } };
        const match = { $match: { balance: { $gt: 0 } } };
        const sort = { $sort: { balance: -1 } };
        const limit = { $limit: criteria };
        pipeline = [group, match, sort, limit];
    } else if (reportType === 'singleStudent' && typeof criteria === 'string') {
        const match1 = { $match: { studentID: criteria } };
        const group = { $group: { _id: '$studentID', balance: { $sum: '$charge' } } };
        pipeline = [match1, group];
    }

    return pipeline;
}

async function getTotalBalance(reportType, info) {
    const aggregateQuery = getHistoryAggregate();
    const pipeline = getPipeline(reportType, info);
    const result = aggregateQuery(pipeline, { cursor: {} });
    return result.toArray();
}

function getReportHeaderFooter(reportType, stringDate, gradeFilter) {
    let gradesInList = '';
    let title;
    switch (reportType) {
        case 'detail':
            title = '<h5>Reporte detallado</h5>';
            break;
        case 'summary':
            title = '<h5>Reporte resumido</h5>';
            break;
        case 'top':
            title = `<h5>Reporte top ${gradeFilter}</h5>`;
            break;
        case 'singleStudent':
            title = `<h5>Reporte de <span class="student">${gradeFilter}</span></h5>`;
            break;
        default:
            title = '';
            break;
    }

    if (Array.isArray(gradeFilter)
        && gradeFilter.length > 0) {
        gradesInList = '<h5>Este reporte contiene los siguientes grados: ';
        const filterLen = gradeFilter.length - 1;
        gradeFilter.forEach((grade, index) => {
            gradesInList += grade;
            if (index < filterLen) {
                gradesInList += ', ';
            }
        });
        gradesInList += '</h5>';
    }

    return {
        header: `
        <!doctype html>
        <html lang="es">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="initial-scale=1, shrink-to-fit=no" />
                <link rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
                crossorigin="anonymous" />
                <title>Historial de transacciones</title>
                <style>
                    span.tag {
                        font-weight: bold;
                    }
                    .student {
                        text-transform: capitalize;
                    }
                    hr {
                        border-top: 2px dashed black;
                        margin-left: 0;
                    }
                    tfoot td {
                        font-size: 20px;
                        font-weight: bolder;
                    }
                    div#main {
                        padding-top: 20px;
                    }
                    div#main button.btn{
                        margin:15px;
                    }
                    .fifty {
                        width: 50%;
                        margin: 0 auto;
                    }
                    .aligned-right {
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <div id="main" class="container">
                    <h1>Historial de transacciones al ${stringDate}</h1>
                    ${title}
                    ${gradesInList}
                    <br>
                    <button type="button" class="btn btn-primary btn-md" onclick="window.print();">
                        Imprimir
                    </button>
                    <br>
        `,
        footer: '</div></body></html>'
    };
}

function getSubtableBody(reportType, data) {
    let body = '<tbody>';

    if (reportType === 'detail' || reportType === 'singleStudent') {
        data.forEach((doc) => {
            body += `
            <tr>
                <td>${filterDate(doc.date, false)}</td>
                <td>${doc.concept}</td>
            `;

            if (doc.charge > 0) {
                body += `
                    <td class="aligned-right">${doc.charge.toLocaleString()}</td>
                    <td>&#32;</td>
                `;
            } else {
                body += `
                    <td>&#32;</td>
                    <td class="aligned-right">${(doc.charge * -1).toLocaleString()}</td>
                `;
            }

            body += '</tr>';
        });
    } else if (reportType === 'summary') {
        data.forEach((doc) => {
            body += `
            <tr>
                <td class="student">${doc.fullname}</td>
                <td style="color: ${doc.balance < 0 ? 'green' : 'red'};">${doc.balance.toLocaleString()}</td>
            </tr>
            `;
        });
    } else if (reportType === 'top') {
        data.forEach((doc) => {
            body += `
            <tr>
                <td class="student">${doc.fullname}</td>
                <td>${doc.grade}</td>
                <td>${doc.balance.toLocaleString()}</td>
            </tr>
            `;
        });
    }

    body += '</tbody>';
    return body;
}

function getSubtableHeader(reportType, data) {
    let head = '';
    if (reportType === 'detail') {
        head += `
            <br>
            <span class="tag">Estudiante: </span>
            <span class="student">${data.fullname}</span>
            <br>
            <span class="tag">Grado: </span>
            <span class="student">${data.grade}</span>
            <br>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Concepto</th>
                        <th scope="col" class="aligned-right">Gasto</th>
                        <th scope="col" class="aligned-right">Pago</th>
                    </tr>
                </thead>
        `;
    } else if (reportType === 'summary') {
        head += `
            <br>
            <div class="fifty">
                <span class="tag">Grado: </span>
                <span class="student">${data.grade}</span>
            </div>
            <br>
            <table class="table table-striped fifty">
                <thead>
                    <tr>
                        <th scope="col">Estudiante</th>
                        <th scope="col">Balance</th>
                    </tr>
                </thead>
        `;
    } else if (reportType === 'top') {
        head += `
            <br>
            <table class="table table-striped fifty">
                <thead>
                    <tr>
                        <th scope="col">Estudiante</th>
                        <th scope="col">Grado</th>
                        <th scope="col">Balance</th>
                    </tr>
                </thead>
        `;
    } else if (reportType === 'singleStudent') {
        head += `
            <br>
            <span class="tag">Grado: </span>
            <span class="student">${data.grade}</span>
            <br>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Concepto</th>
                        <th scope="col" class="aligned-right">Gasto</th>
                        <th scope="col" class="aligned-right">Pago</th>
                    </tr>
                </thead>
        `;
    }

    return head;
}

function getSubtableFooter(reportType, balance) {
    let foot = '';

    if (reportType === 'detail' || reportType === 'singleStudent') {
        let balanceStr;
        let color;
        if (balance < 0) {
            balanceStr = `Tiene un saldo a su favor de ${(balance * -1).toLocaleString()} Colones`;
            color = 'green';
        } else {
            balanceStr = `Debe ${balance.toLocaleString()} Colones`;
            color = 'red';
        }

        foot += `
                <tfoot>
                    <tr>
                        <td colspan="4" class="aligned-right" style="color: ${color};">${balanceStr}</td>
                    </tr>
                </tfoot>
            </table>
            <hr style="width: 100%;">
        `;
    } else if (reportType === 'summary') {
        foot += `
            </table>
            <hr class="fifty">
        `;
    } else if (reportType === 'top') {
        foot += '</table>';
    }


    return foot;
}

function getSubtable(reportType, content, headFootInfo = {}) {
    const tableHeader = getSubtableHeader(reportType, headFootInfo);
    const tableBody = getSubtableBody(reportType, content);
    const tableFooter = getSubtableFooter(reportType, headFootInfo.balance);

    return `
        ${tableHeader}
        ${tableBody}
        ${tableFooter}
    `;
}

function getContent(reportType, dataList) {
    let list = '';

    if (reportType === 'detail') {
        dataList.forEach((student) => {
            const content = HISTORY.find({ studentID: student._id }, { sort: { date: 1 } }).fetch();
            list += getSubtable(reportType, content, student);
        });
    } else if (reportType === 'summary') {
        let content;
        let reference;

        dataList.forEach((student) => {
            if (reference !== student.grade) {
                if (typeof reference === 'string') {
                    content.sort((a, b) => {
                        let valid = 0;
                        if (a.fullname < b.fullname) {
                            valid = -1;
                        } else if (a.fullname > b.fullname) {
                            valid = 1;
                        }
                        return valid;
                    });

                    list += getSubtable(reportType, content, { grade: reference });
                }
                reference = student.grade;
                content = [];
            }
            content.push(student);
        });
        content.sort((a, b) => {
            let valid = 0;
            if (a.fullname < b.fullname) {
                valid = -1;
            } else if (a.fullname > b.fullname) {
                valid = 1;
            }
            return valid;
        });
        list += getSubtable(reportType, content, { grade: reference });
    } else if (reportType === 'top') {
        list += getSubtable(reportType, dataList);
    }

    return list;
}

function getStudentList(gradeFilter) {
    const query = {};
    const studentList = [];
    let ids = false;
    if (Array.isArray(gradeFilter)
        && gradeFilter.length > 0) {
        ids = [];
        query.grade = { $in: gradeFilter };
    }

    STUDENTS.find(query, { sort: { grade: 1, fullname: 1 } }).forEach((doc) => {
        if (Array.isArray(ids)) {
            ids.push(doc._id);
        }
        studentList.push(doc);
    });

    return { studentList, ids };
}

function mergeBalanceStudents(reportType, balanceArray, studentList) {
    check(balanceArray, Array);
    check(studentList, Array);
    const outputArray = balanceArray.map((bal) => {
        const student = studentList.find(stu => stu._id === bal._id);
        student.balance = bal.balance;
        return student;
    });

    if (reportType === 'detail' || reportType === 'summary') {
        outputArray.sort((a, b) => {
            let valid = 0;
            if (a.grade < b.grade) {
                valid = -1;
            } else if (a.grade > b.grade) {
                valid = 1;
            }
            return valid;
        });
    }

    return outputArray;
}

function filterHTML(html) {
    let filtered = html.replace(/[\t\n\r]+/gm, '');
    filtered = filtered.replace(/> +</gm, '><');
    return filtered.replace(/ {2,}/g, ' ');
}

async function getReport(stringDate, reportType, gradeFilter) {
    check(stringDate, String);
    check(reportType, String);

    const { header, footer } = getReportHeaderFooter(reportType, stringDate, gradeFilter);
    let html = header;
    const { studentList, ids } = getStudentList(gradeFilter);
    const criteria = reportType === 'detail' || reportType === 'summary' ? ids : gradeFilter;
    const balanceArray = await getTotalBalance(reportType, criteria);
    const mergedBalStu = mergeBalanceStudents(reportType, balanceArray, studentList);
    html += getContent(reportType, mergedBalStu);
    html += footer;
    return filterHTML(html);
}

function studentReport(stringDate, student) {
    check(stringDate, String);
    check(student, Object);
    const reportType = 'singleStudent';
    const { header, footer } = getReportHeaderFooter(reportType, stringDate, student.fullname);
    let html = header;
    const content = HISTORY.find({ studentID: student._id }, { sort: { date: 1 } }).fetch();
    html += getSubtable(reportType, content, student);
    html += footer;
    return filterHTML(html);
}

Meteor.methods({
    getReport,
    studentReport,
    runBackups,
    getGradeList
});

export { getGradeList as default };
