
/* global
db: false,
printjson: false
*/
const group = { $group: { _id: '$studentID', charge: { $sum: '$charge' } } };
const match = { $match: { charge: { $ne: 0 } } };
const sort = { $sort: { charge: 1 } };
const list = db.history.aggregate([{ $group: { '_id': '$studentID', balance: { $sum: '$charge' } } }, { $match: { 'balance': { $ne: 0 } } }]).toArray();
printjson(list);
