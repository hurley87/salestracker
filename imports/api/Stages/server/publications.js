import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Stages from '../Stages';

Meteor.publish('stages.list', function stagesList() {
  return Stages.find();
});
