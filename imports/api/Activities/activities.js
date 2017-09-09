import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Activities = new Mongo.Collection('added');
export default Activities;