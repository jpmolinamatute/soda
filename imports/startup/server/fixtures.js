// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { STUDENTS, HISTORY } from '../both/index.js';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];

function allBalance() {
    let list = false;
    function getStudentBalance(studentID) {
        check(studentID, String);
        let balance = 0;
        HISTORY.find({ studentID }, { fields: { _id: 0, charge: 1 } }).forEach((doc) => {
            if (typeof doc.charge === 'number') {
                balance += doc.charge;
            }
        });
        return balance;
    }
    function getDate(someDate) {
        let str = false;
        if (someDate instanceof Date) {
            let day = someDate.getDate();
            let month = someDate.getMonth() + 1;
            const year = someDate.getFullYear();
            let hour = someDate.getHours();
            let min = someDate.getMinutes();
            const sec = someDate.getSeconds();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            let defaultTime = true;
            if (hour === 0 && min === 0 && sec === 0) {
                defaultTime = false;
            }
            day = day < 10 ? `0${day}` : day;
            month = month < 10 ? `0${month}` : month;
            min = min < 10 ? `0${min}` : min;

            if (hour > 12) {
                hour -= 12;
            } else if (hour === 0) {
                hour = 12;
            } else if (hour < 10) {
                hour = `0${hour}`;
            }
            if (defaultTime) {
                str = `${day}/${month}/${year}  ${hour}:${min} ${ampm}`;
            } else {
                str = `${day}/${month}/${year}`;
            }
        }

        return str;
    }
    function getStudentHistory(studentID) {
        check(studentID, String);
        let rows = '';
        HISTORY.find({ studentID }, { fields: { _id: 0 }, sort: { studentID: 1, date: 1 } }).forEach((doc) => {
            rows += '<tr>\n';
            rows += `<td>${getDate(doc.date)}</td><td>${doc.concept}</td><td>${doc.charge}</td>\n`;
            rows += '</tr>\n';
        });
        return rows;
    }

    STUDENTS.find({}, { sort: { grade: 1 } }).forEach((student) => {
        const balance = getStudentBalance(student._id);
        if (balance > 0) {
            if (!list) {
                const when = new Date();
                let dia = when.getDate();
                let month = when.getMonth();
                month = MONTHS[month];
                dia = dia < 10 ? `0${dia}` : dia;
                list = `<!doctype html>
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

                            <title>Historial de transacciones al</title>
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
                                tfoot td {
                                    text-align: right;
                                }
                            </style>
                        </head>

                        <body>
                            <div id="main" class="container">
                            <h1> Historial de transacciones al ${dia}/${month}/${when.getFullYear()}</h1>
                    `;
            }

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

            const historial = getStudentHistory(student._id);
            list += `
            <span class="tag">Estudiante: </span><span class="student">${fullName}</span><br />
            <span class="tag">Grado: </span><span class="student">${student.grade}</span><br />
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
        <hr />
        `;
        }
    });
    if (typeof list === 'string') {
        list += `
                
                </div>
            </body>
        </html>
        `;

        // <script>
        //         window.onload = () => {
        //             window.print();
        //         };
        //         </script>
        list = list.replace(/ {2,}|[\n\r]/g, ' ');
    }
    return list;
}

Meteor.methods({
    allBalance
});
