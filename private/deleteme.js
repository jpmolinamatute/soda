// Fill the DB with example data on startup


// function getTotalBalance(query) {
//     let balance = 0;
//     HISTORY.find(query, {
//         fields: {
//             _id: 0,
//             charge: 1
//         }
//     }).forEach((doc) => {
//         if (typeof doc.charge === 'number') {
//             balance += doc.charge;
//         }
//     });
//     return balance;
// }

function studentBalance(stringDate, student) {
    check(stringDate, String);

    const { header, footer } = getHTMLHeaderFooter(stringDate, 'singleStudent');
    let list = header;
    list += balanceByStudent(student);
    list += footer;
    list = list.replace(/ {2,}|[\n\r]/g, ' ');
    return list;
}

// function allBalance(stringDate, queryType, gradeFilter) {
//     check(stringDate, String);
//     check(queryType, String);
//     check(gradeFilter, Array);
//     const { header, footer } = getHTMLHeaderFooter(stringDate, queryType, gradeFilter);
//     let list = header;

//     if (queryType === 'students') {
//         const query = {};
//         if (gradeFilter.length > 0) {
//             query.grade = { $in: gradeFilter };
//         }
//         STUDENTS.find(query, { sort: { grade: 1 } }).forEach((student) => {
//             list += balanceByStudent(student);
//         });
//     } else if (queryType === 'grades') {
// if (gradeFilter.length > 0) {
//     gradeFilter.forEach((grade) => {
//         list += balancesumarized(grade);
//     });
// } else {
//     const GRADES = getGradeList(false);
//     GRADES.forEach((grade) => {
//         list += balancesumarized(grade);
//     });
// }
//     }
//     list += footer;
//     list = list.replace(/ {2,}|[\n\r]/g, ' ');
//     return list;
// }


async function balancePerTop(stringDate, gradeFilter = []) {
    check(stringDate, String);
    const { header, footer } = getHTMLHeaderFooter(stringDate, 'top', gradeFilter);
}
