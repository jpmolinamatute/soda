/* global
db: false
*/
const list = [
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
    '7A',
    '7B',
    '7C',
    '8A',
    '8B',
    '8C',
    '9A',
    '9B',
    '9C',
    '10A',
    '10B',
    '10C',
    '11A',
    '11B',
    '11C',
    'KA',
    'KB',
    'PB',
    'PC',
    'PKB'
];

list.forEach((l) => {
    const count = db.students.count({ grade: l });
    print(`${l} has ${count} students`);
});
