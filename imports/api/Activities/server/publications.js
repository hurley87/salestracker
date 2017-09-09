import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Activities from '../activities';

Meteor.publish('activities.list', () => Activities.find());
