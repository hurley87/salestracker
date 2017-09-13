import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Activities from '../activities';

Meteor.publish('activities.list', function activitiesList(date) {
  check(date, String);
  return Activities.find({"current.add_time" : { $regex: ".*" + date + ".*"}});
});

Meteor.publish('activities.user', function activitiesList(userId) {
  check(userId, String);
  return Activities.find({ 
  	"current.created_by_user_id" : parseInt(userId),
  	$where: 'this.current.note.length > 100',
  	"current.type": 'call_made'
  });
});
