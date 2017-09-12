import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const ActivitiesList = ({ activities }) => (
  activities.length > 0 ? 
  <div>
	<ListGroup className="DocumentsList">
	    {activities.reverse().slice(0, 100).map((activity, i) => (
	      <ListGroupItem key={ i } >
	        <span className='pull-right'>{activity.time}</span> { activity.name } ({ activity.deal_id }) - { activity.type  } <span dangerouslySetInnerHTML={{ __html: activity.note }} />
	      </ListGroupItem>
	    ))}
	</ListGroup>
  </div> :
  <Alert bsStyle="warning">No activities yet.</Alert>
);


export default ActivitiesList;