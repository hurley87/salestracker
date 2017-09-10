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

const renderUser = (user, stats, activities, match, history) => (user ? (
  <div className="ViewUser">
  	<p><Link to='/today'>Back</Link></p>
    <div className="page-header clearfix">
      <h2 className="pull-left">{ user.profile.name.first } { user.profile.name.last }</h2>
    </div>
    <Row>
      <Col xs={12} sm={4} md={2}>
		    <h4>Leads</h4>
		    <p>{stats.leads}</p>
		    <h4>Booked</h4>
		    <p>{stats.booked}</p>
		    <h4>Held</h4>
		    <p>{stats.held}</p>
		    <h4>Implementation</h4>
		    <p>{stats.implementation}</p>
		    <h4>Clients</h4>
		    <p>{stats.clients}</p>
		    <hr />
		    <h4>Calls</h4>
		    <p>{activities.length}</p>
		    <h4>Time on Phone</h4>
		    <p>{stats.timeOnPhone} minutes</p>
		    <h4>Avg Call Length</h4>
		    <p>{ parseInt(stats.avgPhoneTime * 60)} seconds</p>
      </Col>
      <Col xs={12} sm={8} md={10}>
		    <ActivitiesList activities={activities}/>
      </Col>
    </Row>
  </div>
) : <NotFound />);

const ViewUser = ({ loading, user, stats, activities, match, history }) => (
  !loading ? renderUser(user, stats, activities, match, history) : <Loading />
);

ViewUser.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const userId = match.params._id;
  const subscription = Meteor.subscribe('users.view', userId);
  const stagesubscription = Meteor.subscribe('stages.list');

  const user = Meteor.users.findOne({'profile.id': userId});
  const name = user.profile.name.first + " " + user.profile.name.last

  let stages = Stages.find().fetch();
  let stats = {}
	

	function add(a, b) {
	  return a + b;
	}

  if(stagesubscription.ready()){
  	repStages = stages[stages.length - 1].stats
  	const funnel = repStages[name]


  	stats = {
  		leads: funnel.reduce(add, 0),
  		filtered: funnel.slice(1).reduce(add, 0),
  		booked: funnel.slice(2).reduce(add, 0),
  		held: funnel.slice(3).reduce(add, 0),
  		aggreement: funnel.slice(4).reduce(add, 0),
  		implementation: funnel.slice(5).reduce(add, 0),
  		clients: funnel.slice(6).reduce(add, 0)
  	}
  }

  const sub3 = Meteor.subscribe('activities.user', user.profile.id);

  let activities = Activities.find().fetch();

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
	    	name: activity.current.owner_name,
	    	type: activity.current.type,
	    	note: activity.current.note,
	    	time: time
		}
	}).filter((act, i) =>{
		return !(act.type == 'call_made' && act.note.length == 0)
	})

	stats['timeOnPhone'] = timeOnPhone
	if(activities.length == 0) {
		stats['avgPhoneTime'] = 0
	} else {
		stats['avgPhoneTime'] = timeOnPhone / activities.length
	}
	

  return {
    loading: !stagesubscription.ready() && !sub3.ready(),
    user: user,
    stats: stats,
    activities: activities
  };
}, ViewUser);
