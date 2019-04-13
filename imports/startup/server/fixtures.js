// Fill the DB with example data on startup
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { exec } from 'child_process';
import { STUDENTS, HISTORY, filterDate } from '../both/index.js';

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

function getTableBody(query, options) {
    let rows = '<tbody>';
    HISTORY.find(query, options).forEach((doc) => {
        rows += `
        <tr>
            <td>${filterDate(doc.date, false)}</td>
            <td>${doc.concept}</td>
            <td>${doc.charge.toLocaleString()}</td>
        </tr>
        `;
    });
    rows += '</tbody>';
    return rows;
}

function getTableFooter(balance) {
    let balanceStr;
    let color;
    if (balance < 0) {
        const positive = (balance * -1).toLocaleString();
        balanceStr = `Tiene un saldo a su favor de ${positive} Colones`;
        color = 'green';
    } else {
        balanceStr = `Debe ${balance.toLocaleString()} Colones`;
        color = 'red';
    }
    return `<tfoot>
                <tr>
                    <td colspan="3" style="color: ${color};">${balanceStr}</td>
                </tr>
            </tfoot>`;
}

function getTable(balance, query, grade) {
    const historial = getTableBody(query, {
        fields: {
            _id: 0
        },
        sort: {
            studentID: 1, date: 1
        }
    });
    const tableFooter = getTableFooter(balance);
    return `
    <span class="tag">Grado: </span>
    <span class="student">${grade}</span>
    <br>
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Concepto</th>
                <th scope="col">Monto</th>
            </tr>
        </thead>
        ${historial}
        ${tableFooter}
    </table>
    <hr style="width: 100%;">`;
}

function getTotalBalance(query) {
    let balance = 0;
    HISTORY.find(query, {
        fields: {
            _id: 0,
            charge: 1
        }
    }).forEach((doc) => {
        if (typeof doc.charge === 'number') {
            balance += doc.charge;
        }
    });
    return balance;
}

function getHTMLHeaderFooter(stringDate, queryType, gradeFilter = []) {
    let gradesInList = '<h5>Reporte por estudiante</h5>';
    if (queryType !== 'singleStudent') {
        const tipo = queryType === 'students' ? 'Estudiantes' : 'Grados';
        gradesInList = `<h5>Este reporte contiene todos los ${tipo} y esta ordenado por ${tipo}</h5>`;
        if (gradeFilter.length > 0) {
            gradesInList = '<h5>Este reporte contiene los siguientes grados: ';
            const filterLen = gradeFilter.length - 1;
            gradeFilter.forEach((grade, index) => {
                gradesInList += grade;
                if (index < filterLen) {
                    gradesInList += ', ';
                }
            });
            gradesInList += ` y esta ordenado por ${tipo}</h5>`;
        }
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
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                crossorigin="anonymous">
                </script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
                integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
                crossorigin="anonymous">
                </script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
                integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
                crossorigin="anonymous">
                </script>
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
                    tfoot td,
                    table tr td:last-child,
                    table tr th:last-child {
                        text-align: right;
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
                </style>
            </head>
            <body>
                <div id="main" class="container">
                    <h1>Historial de transacciones al ${stringDate}</h1>
                    ${gradesInList}
                    <button type="button" class="btn btn-primary btn-md" onclick="window.print();">
                        Imprimir
                    </button>
        `,
        footer: '</div></body></html>'
    };
}

function balanceByStudent(student) {
    const query = { studentID: student._id };
    const balance = getTotalBalance(query);
    let list = '';
    if (balance) {
        const table = getTable(balance, query, student.grade);
        list = `
            <br>
            <span class="tag">Estudiante: </span>
            <span class="student">${student.fullname}</span>
            <br>
            ${table}
        `;
    }
    return list;
}

function balanceByGrade(grade) {
    const query = { studentID: { $in: [] } };
    STUDENTS.find({ grade }, { fields: { _id: 1 }, sort: { grade: 1 }, reactive: false }).forEach((doc) => {
        query.studentID.$in.push(doc._id);
    });
    return getTotalBalance(query);
}

function balancesumarized(grade) {
    let list = '';
    const gradeBalance = balanceByGrade(grade);
    if (gradeBalance !== 0) {
        const tableArray = [];
        STUDENTS.find({ grade }, { sort: { grade: 1 }, reactive: false }).forEach((student) => {
            const balance = getTotalBalance({ studentID: student._id });
            if (balance !== 0) {
                const color = balance > 0 ? 'red' : 'green';
                tableArray.push({
                    student,
                    balance,
                    color
                });
            }
        });
        tableArray.sort((a, b) => b.balance - a.balance);
        list += `
            <br>
            <div class="fifty">
                <span class="tag">Grado: </span>
                <span class="student">${grade}</span>
            </div>
            <br>
            <table class="table table-striped fifty">
                <thead>
                    <tr>
                        <th scope="col">Estudiante</th>
                        <th scope="col">Balance</th>
                    </tr>
                </thead>
                <tbody>
        `;
        tableArray.forEach((item) => {
            list += `
                <tr>
                    <td class="student">${item.student.fullname}</td>
                    <td style="color: ${item.color};">${item.balance.toLocaleString()}</td>
                </tr>
            `;
        });
        list += `
                </tbody>
            </table>
            <hr class="fifty">
        `;
    }

    return list;
}

function studentBalance(stringDate, student) {
    check(stringDate, String);

    const { header, footer } = getHTMLHeaderFooter(stringDate, 'singleStudent');
    let list = header;
    list += balanceByStudent(student);
    list += footer;
    list = list.replace(/ {2,}|[\n\r]/g, ' ');
    return list;
}

function allBalance(stringDate, queryType, gradeFilter) {
    check(stringDate, String);
    check(queryType, String);
    check(gradeFilter, Array);
    const { header, footer } = getHTMLHeaderFooter(stringDate, queryType, gradeFilter);
    let list = header;

    if (queryType === 'students') {
        const query = {};
        if (gradeFilter.length > 0) {
            query.grade = { $in: gradeFilter };
        }
        STUDENTS.find(query, { sort: { grade: 1 } }).forEach((student) => {
            list += balanceByStudent(student);
        });
    } else if (queryType === 'grades') {
        if (gradeFilter.length > 0) {
            gradeFilter.forEach((grade) => {
                list += balancesumarized(grade);
            });
        } else {
            const GRADES = getGradeList(false);
            GRADES.forEach((grade) => {
                list += balancesumarized(grade);
            });
        }
    }
    list += footer;
    list = list.replace(/ {2,}|[\n\r]/g, ' ');
    return list;
}

let isBackupReady = true;
function runBackups() {
    this.unblock();
    if (isBackupReady) {
        isBackupReady = false;
        exec('/home/juanpa/Projects/soda/private/export', (error, stdout, stderr) => {
            if (error === null) {
                isBackupReady = true;
            }
            console.log(stdout);
            console.log('-------');
            console.error(stderr);
        });
    }
}


Meteor.methods({
    allBalance,
    studentBalance,
    runBackups,
    getGradeList
});
export { getGradeList as default };
