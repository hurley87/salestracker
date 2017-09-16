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

const Leaderboard = ({ activities, repsStats, overall, today, loading, match, history }) => ( !loading ? (
  activities.length > 0 ? 
  <div>
  	<Row>
  		<Col xs={2}>
  			<h4>{today}</h4>
  			<p>TODO: add date picker here</p>
  		</Col>
  		<Col xs={2}>
  			<h4>Dials</h4>
  			<p>{overall.connectionCount}</p>
  		</Col>
  		<Col xs={2}>
  			<h4>Booked</h4>
  			<p>{overall.bookedCount}</p>
  		</Col>
  		<Col xs={2}>
  			<h4>Held</h4>
  			<p>{overall.heldCount}</p>
  		</Col>
  		<Col xs={2}>
  			<h4>Time</h4>
  			<p>{overall.timeOnPhone}</p>
  		</Col>
  		<Col xs={2}>
  			<h4>Points</h4>
  			<p>{overall.score}</p>
  		</Col>
  	</Row>
  	<RepsList repsStats={repsStats}/>
  	<ActivitiesList activities={activities}/>
  </div> :
  <div>
  	<p><Link to="/all">All Time</Link></p>
  	<Alert bsStyle="warning">No activities to show.</Alert>
  </div>
): <Loading />);


Leaderboard.propTypes = {
  activities: PropTypes.array,
};

export default createContainer(() => {

	var dateObj = new Date();
	dateObj.setHours(dateObj.getHours() - 4);
	var month = dateObj.getUTCMonth() + 1;
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	if(month.toString().length == 1){ month = '0' + month }
	if(day.toString().length == 1){ day = '0' + day }

	let today = year + "-" + month + '-' + day

	const subscription = Meteor.subscribe('activities.list', today);

	let activities = Activities.find().fetch();

	const reps = _.mapValues(_.groupBy(activities, 'current.owner_name'))

	activities.map((act) =>{
		let note = act.current.note
		let minutes = 0
		if(note.includes('minute')) minutes = parseInt(note.split(" ")[2])

		act.current['add_date'] = act.current.add_time.split(" ")[0]
		act.current['minutes'] = minutes
	})

	connectionCount = activities.filter((act) => { return act.current.note.length > 10 }).length;
	bookedCount = activities.filter((act) => { return act.current.type == 'planpro_phone_appt' || act.current.type == 'planpro_in_person_appt' }).length;
	heldCount = activities.filter((act) => { return act.current.minutes >= 10 }).length;
	timeOnPhone = _.reduce(activities, function(sum, act){ return sum + act.current.minutes }, 0)
	score = connectionCount + 5*bookedCount + 10*heldCount + timeOnPhone

	overall = {
		connectionCount: connectionCount,
		bookedCount: bookedCount,
		heldCount: heldCount,
		timeOnPhone: timeOnPhone,
		score: score
	}

	activities

	const actsByDay = _.mapValues(_.groupBy(activities, 'current.add_date'))

	let names = []
	for(var k in reps) names.push(k)

	let repsStats = []
	for(i in names){

		name = names[i]
		repActs = reps[name]
		id = repActs[0].current.created_by_user_id
		connectionCount = repActs.filter((act) => { return act.current.note.length > 10 }).length;
		bookedCount = repActs.filter((act) => { return act.current.type == 'planpro_phone_appt' || act.current.type == 'planpro_in_person_appt' }).length;
		heldCount = repActs.filter((act) => { return act.current.minutes >= 10 }).length;
		timeOnPhone = _.reduce(repActs, function(sum, act){ return sum + act.current.minutes }, 0)
		score = connectionCount + 5 *bookedCount + 10*heldCount + timeOnPhone

		let repStats = {
			name: names[i],
			connectionCount: connectionCount,
			bookedCount: bookedCount,
			heldCount: heldCount,
			timeOnPhone: timeOnPhone,
			score: score,
			id: id
		}

		repsStats.push(repStats)
	}

	repsStats = _.sortBy(repsStats , ['score']) 

	activities = activities.map((activity, i) =>{
		let time = new Date(activity.current.add_time)
		time.setHours(time.getHours() - 4);
		time = time.toString().split(" ")[4]

		let note = ''
		let newNote = activity.current.note.split('. ')
		if(newNote.length == 3) {
			note = newNote[0] + ' ' + newNote[1]
		} else {
			note = newNote[0]
		}

		return {
			deal_id: activity.current.deal_id,
	    	name: activity.current.owner_name,
	    	type: activity.current.type,
	    	note: note,
	    	time: time
		}
	}).filter((act, i) =>{
		return !((act.type == 'call_made' && act.note.length == 0) || 
			act.type == 'email' ||
			act.note.includes('Missed')
			)
	})

	loading = !subscription.ready()

	return { 
		activities:activities, 
		repsStats:repsStats, 
		loading:loading,
		overall: overall,
		today: today
	}
}, Leaderboard);