import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Stages from '../../../api/Stages/Stages';
import Activities from '../../../api/Activities/activities';
import ActivitiesList from '../../components/ActivitiesList/ActivitiesList';
import _ from 'lodash';

const renderUser = (user, activities, match, history) => (user ? (
  <div className="UserActivities">
   <ActivitiesList activities={activities}/>
  </div>
) : <NotFound />);

const UserActivities = ({ loading, user, activities, match, history }) => (
  !loading ? renderUser(user, activities, match, history) : <Loading />
);

UserActivities.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default createContainer(({ user, match, history }) => {
  const subscription = Meteor.subscribe('activities.user', user.profile.id);

  let activities = Activities.find().fetch();
  if(subscription.ready()){
		activities.map((act) =>{
			let note = act.current.note
			let minutes = 0
			if(note.includes('minute')) minutes = parseInt(note.split(" ")[2])

			act.current['add_date'] = act.current.add_time.split(" ")[0]
			act.current['minutes'] = minutes
		})

		timeOnPhone = _.reduce(activities, function(sum, act){ return sum + act.current.minutes }, 0)

		activities = activities.map((activity, i) =>{
			let time = new Date(activity.current.add_time)
			time.setHours(time.getHours() - 4);
			time = time.toString().split(" ")[4]
			return {
				deal_id: activity.current.deal_id,
		    	name: activity.current.owner_name,
		    	type: activity.current.type,
		    	note: activity.current.note,
		    	time: time
			}
		}).filter((act, i) =>{
			return !(act.type == 'call_made' && act.note.length == 0)
		})
	
  }


  return {
    loading: !subscription.ready(),
    activities: activities
  };
}, UserActivities);
