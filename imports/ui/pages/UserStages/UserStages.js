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
import ActivitiesList from '../../components/ActivitiesList/ActivitiesList';
import _ from 'lodash';

const renderUser = (user, stats, match, history) => (user ? (
  <div className="UserStages">
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
  </div>
) : <NotFound />);

const UserStages = ({ loading, user, stats, match, history }) => (
  !loading ? renderUser(user, stats, match, history) : <Loading />
);

UserStages.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default createContainer(({ user, match, history }) => {
  const subscription = Meteor.subscribe('stages.list');
  let stats = {}
  const name = user.profile.name.first + " " + user.profile.name.last

  if(subscription.ready()){
	  let stages = Stages.find().fetch();

		function add(a, b) {
		  return a + b;
		}


		repStages = stages[stages.length - 1].stats
		console.log(repStages)
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
	 
  return {
    loading: !subscription.ready(),
    stats: stats
  };
}, UserStages);
