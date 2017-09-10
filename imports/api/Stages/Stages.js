import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Stages = new Mongo.Collection('stats');
export default Stages;