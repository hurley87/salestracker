import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const ActivitiesList = ({ activities }) => (
  activities.length > 0 ? 
  <div>
  	<h4>{activities.length} activities were completed</h4>
	<ListGroup className="DocumentsList">
	    {activities.reverse().slice(0, 100).map((activity, i) => (
	      <ListGroupItem key={ i } >
	        <span className='pull-right'>{activity.time}</span> { activity.name }: { activity.type  } <span dangerouslySetInnerHTML={{ __html: activity.note }} />
	      </ListGroupItem>
	    ))}
	</ListGroup>
  </div> :
  <Alert bsStyle="warning">No activities yet today.</Alert>
);


export default ActivitiesList;