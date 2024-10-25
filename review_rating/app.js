//references: Chatgpt: app.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SpotList from './review_rating/SpotList';
import SpotDetails from './review_rating/SpotDetail';
import EventList from './review_rating/EventList';
import EventDetails from './review_rating/EventDetail';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          {/* Routes for spots */}
          <Route exact path="/spots" component={SpotList} />
          <Route path="/spots/:id" component={SpotDetails} />

          {/* Routes for events */}
          <Route exact path="/events" component={EventList} />
          <Route path="/events/:id" component={EventDetails} />

          {/* Default or home route */}
          <Route path="/" exact>
            <h1>Welcome to the Park & Event Rating System</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
