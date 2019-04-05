// Fill the DB with example data on startup
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { exec } from 'child_process';
import { STUDENTS, HISTORY, filterDate } from '../both/index.js';

const GRADES = [
    '10A',
    '10B',
    '10C',
    '11A',
    '11B',
    '11C',
    '7B',
    '7C',
    '8A',
    '8B',
    '8C',
    '7A',
    '9A',
    '9B',
    '9C',
    '1A',
    '1B',
    '1C',
    '2A',
    '2B',
    '3A',
    '3B',
    '3C',
    '4A',
    '4B',
    '4C',
    '5A',
    '5B',
    '5C',
    '6A',
    '6B',
    '6C',
    'KA',
    'KB',
    'PB',
    'PC',
    'PKB'
];

function getTableBody(query, options) {
    let rows = '<tbody>';
    HISTORY.find(query, options).forEach((doc) => {
        rows += `
        <tr>
            <td>${filterDate(doc.date)}</td>
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
    <span class="tag">Grado: </span><span class="student">${grade}</span><br>
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
    <hr>`;
}

function getTotalBalance(query) {
    let balance = 0;
    HISTORY.find(query, {
        fields: {
            _id: 0, charge: 1
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
                    span.student {
                        text-transform: capitalize;
                    }
                    hr {
                        width: 100%;
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
        let fullName = student.name;
        if (typeof student.middle === 'string') {
            fullName += ` ${student.middle}`;
        }
        if (typeof student.last1 === 'string') {
            fullName += ` ${student.last1}`;
        }
        if (typeof student.last2 === 'string') {
            fullName += ` ${student.last2}`;
        }
        const table = getTable(balance, query, student.grade);
        list = `
            <br>
            <span class="tag">Estudiante: </span>
            <span class="student">${fullName}</span>
            <br>
            ${table}
        `;
    }
    return list;
}


function balanceByGrade(grade) {
    const query = { studentID: { $in: [] } };
    let list = '';
    STUDENTS.find({ grade }, { fields: { _id: 1 }, sort: { grade: 1 } }).forEach((doc) => {
        query.studentID.$in.push(doc._id);
    });
    const balance = getTotalBalance(query);
    if (balance) {
        list = `<br>${getTable(balance, query, grade)}`;
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
                list += balanceByGrade(grade);
            });
        } else {
            GRADES.forEach((grade) => {
                list += balanceByGrade(grade);
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
    runBackups
});
