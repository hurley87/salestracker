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
import UserActivities from "../UserActivities/UserActivities"
import UserStages from "../UserStages/UserStages"
import _ from 'lodash';

const renderUser = (user, match, history) => (user ? (
  <div className="ViewUser">
    <div className="page-header clearfix">
    	<p><Link to='/today'>Back</Link></p>
      <h2 className="pull-left">{ user.profile.name.first } { user.profile.name.last }</h2>
    </div>
    <Row>
      <Col xs={12} sm={4} md={2}>
      	<UserStages user={user}/>
      </Col>
      <Col xs={12} sm={8} md={10}>
		<UserActivities user={user}/>
      </Col>
    </Row>
  </div>
) : <NotFound />);

const ViewUser = ({ loading, user, match, history }) => (
  !loading ? renderUser(user, match, history) : <Loading />
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
  const users = Meteor.users.find().fetch();
  const user = users.filter((u) => { 
  	return u.profile.id == userId
  })[0]

  return {
    loading: !subscription.ready(),
    user: user
  };
}, ViewUser);
