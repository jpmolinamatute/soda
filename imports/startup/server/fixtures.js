// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { STUDENTS, HISTORY, filterDate } from '../both/index.js';

const GRADES = ['10A',
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

function getSubHistory(query, options) {
    let rows = '';
    HISTORY.find(query, options).forEach((doc) => {
        rows += '<tr>\n';
        rows += `<td>${filterDate(doc.date)}</td><td>${doc.concept}</td><td>${doc.charge.toLocaleString()}</td>\n`;
        rows += '</tr>\n';
    });
    return rows;
}

function getTotalBalance(query) {
    let balance = 0;

    HISTORY.find(query, { fields: { _id: 0, charge: 1 } }).forEach((doc) => {
        if (typeof doc.charge === 'number') {
            balance += doc.charge;
        }
    });
    return balance.toLocaleString();
}

function getHTMLHeaderFooter(stringDate, queryType) {
    const tipo = queryType === 'students' ? 'Estudiantes' : 'Grados';
    return {
        header: `<!doctype html>
                <html lang="es">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
                    crossorigin="anonymous" />

                    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                        crossorigin="anonymous"></script>

                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
                        crossorigin="anonymous"></script>

                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
                        crossorigin="anonymous"></script>

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
                            text
                        }
                    </style>
                </head>

                <body>
                    <div id="main" class="container">
                    <h1>Historial de transacciones al ${stringDate}</h1>
                    <h5>Reporte ordenado por ${tipo}</h5>
                    <button type="button" class="btn btn-primary btn-md" onclick="window.print();">
                        Imprimir
                    </button>
                    <br>
            `,
        footer: `</div>
            </body>
        </html>`
    };
}


function allBalance(stringDate, queryType) {
    check(stringDate, String);
    check(queryType, String);
    const { header, footer } = getHTMLHeaderFooter(stringDate, queryType);
    let list = header;

    function balanceByStudent(student) {
        const query = { studentID: student._id };
        const balance = getTotalBalance(query);
        if (balance > 0) {
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

            const historial = getSubHistory(query, { fields: { _id: 0 }, sort: { studentID: 1, date: 1 } });
            list += `
            <span class="tag">Estudiante: </span><span class="student">${fullName}</span><br>
            <span class="tag">Grado: </span><span class="student">${student.grade}</span><br>
            <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Concepto</th>
                    <th scope="col">Monto</th>
                </tr>
            </thead>
            <tbody>
                ${historial}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">Debe ${balance} Colones</td>
                </tr>
            </tfoot>
        </table>
        <hr>
        `;
        }
    }


    function balanceByGrade(grade) {
        const query = { studentID: { $in: [] } };
        STUDENTS.find({ grade }, { fields: { _id: 1 } }).forEach((doc) => {
            query.studentID.$in.push(doc._id);
        });
        const balance = getTotalBalance(query);

        if (balance > 0) {
            const historial = getSubHistory(query, { fields: { _id: 0, studentID: 0 }, sort: { grade: 1, date: 1 } });
            list += `
            <span class="tag">Grado: </span><span class="student">${grade}</span><br>
            <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Concepto</th>
                    <th scope="col">Monto</th>
                </tr>
            </thead>
            <tbody>
                ${historial}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">Debe ${balance} Colones</td>
                </tr>
            </tfoot>
        </table>
        <hr>
        `;
        }
    }

    if (queryType === 'students') {
        STUDENTS.find({}, { sort: { grade: 1 } }).forEach(balanceByStudent);
    } else if (queryType === 'grades') {
        GRADES.forEach(balanceByGrade);
    }

    list += footer;
    list = list.replace(/ {2,}|[\n\r]/g, ' ');
    return list;
}

Meteor.methods({
    allBalance
});
