import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src="https://surveygizmolibrary.s3.amazonaws.com/library/455879/futureofwork.png"
      alt="Clever Beagle"
    />
    <h4>SalesTracker</h4>
    <div>
      <Button href="/login">Login</Button>
    </div>
  </div>
);

export default Index;
