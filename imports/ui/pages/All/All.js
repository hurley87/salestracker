import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Activities from '../../../api/Activities/activities';
import ActivitiesList from '../../components/ActivitiesList/ActivitiesList';
import RepsList from '../../components/RepsList/RepsList';
import Loading from '../../components/Loading/Loading';
import _ from 'lodash';

const All = ({ activities, repsStats, loading, match, history }) => ( !loading ? (
  activities.length > 0 ? 
  <div>
  	<p><Link to="/today">Today</Link></p>
  	<RepsList repsStats={repsStats}/>
  	<ActivitiesList activities={activities}/>
  </div> :
  <Alert bsStyle="warning">No activities to show.</Alert>
): <Loading />);


All.propTypes = {
  activities: PropTypes.array,
};

export default createContainer(() => {

	const subscription = Meteor.subscribe('activities.list', '');

	let activities = Activities.find().fetch();

	console.log(activities[0])

	const reps = _.mapValues(_.groupBy(activities, 'current.owner_name'))

	console.log(reps)

	activities.map((act) =>{
		let note = act.current.note
		let minutes = 0
		if(note.includes('minute')) minutes = parseInt(note.split(" ")[2])

		act.current['add_date'] = act.current.add_time.split(" ")[0]
		act.current['minutes'] = minutes
	})

	let names = []
	for(var k in reps) names.push(k)

	let repsStats = []
	for(i in names){

		name = names[i]
		repActs = reps[name]

		connectionCount = repActs.filter((act) => { return act.current.note.length > 10 }).length;
		bookedCount = repActs.filter((act) => { return act.current.type == 'planpro_phone_appt' }).length;
		heldCount = repActs.filter((act) => { return act.current.minutes >= 15 }).length;
		timeOnPhone = _.reduce(repActs, function(sum, act){ return sum + act.current.minutes }, 0)
		score = connectionCount + 5*bookedCount + 10*heldCount + timeOnPhone

		let repStats = {
			name: names[i],
			connectionCount: connectionCount,
			bookedCount: bookedCount,
			heldCount: heldCount,
			timeOnPhone: timeOnPhone,
			score: score
		}

		repsStats.push(repStats)
	}

	repsStats = _.sortBy(repsStats , ['score']) 

	activities = activities.map((activity, i) =>{
		let time = new Date(activity.current.add_time)
		time.setHours(time.getHours() - 4);
		time = time.toString().split(" ")[4]
		return {
	    	name: activity.current.owner_name,
	    	type: activity.current.type,
	    	note: activity.current.note,
	    	time: time
		}
	}).filter((act, i) =>{
		return !(act.type == 'call_made' && act.note.length == 0)
	})

	loading = !subscription.ready()

	return { 
		activities:activities, 
		repsStats:repsStats, 
		loading:loading
	}
}, All);