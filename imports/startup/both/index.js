// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.


import { Mongo } from 'meteor/mongo';

export const STUDENTS = new Mongo.Collection('students');
export const HISTORY = new Mongo.Collection('history');
