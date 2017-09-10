import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ name, history }) => (
  <div>
    <Nav pullRight>
      <NavDropdown eventKey={2} title={name} id="user-nav-dropdown">
        <LinkContainer to={"/users/" + Meteor.user().profile.id }>
          <NavItem eventKey={2.0} href={"/users/" + Meteor.user().profile.id }>Profile</NavItem>
        </LinkContainer>
        <LinkContainer to="/settings">
          <NavItem eventKey={2.2} href="/settings">Settings</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={2.3} onClick={() => history.push('/logout')}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withRouter(AuthenticatedNavigation);
