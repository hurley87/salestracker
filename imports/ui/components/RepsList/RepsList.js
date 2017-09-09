import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const RepsList = ({ repsStats }) => (
  <div>
  	<Table  striped bordered condensed hover>
	    <thead>
	      <tr>
	        <th>#</th>
	        <th>Name</th>
	        <th>Dials</th>
	        <th>Booked</th>
	        <th>Held</th>
	        <th>Talk Time</th>
	        <th>Points</th>
	      </tr>
	    </thead>
	    <tbody>
		    {repsStats.reverse().slice(0, 5).map((rep, i) => (
		      <tr key={ i } >
		        <td>{i + 1}</td>
		        <td>{rep.name}</td>
		        <td>{rep.connectionCount}</td>
		        <td>{rep.bookedCount}</td>
		        <td>{rep.heldCount}</td>
		        <td>{rep.timeOnPhone}</td>
		        <td>{rep.score}</td>
		      </tr>
		    ))}
	    </tbody>
  	</Table>
  </div>
);

export default RepsList;