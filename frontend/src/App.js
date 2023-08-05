import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupPage from "./components/GroupsPage";
import GroupDetail from "./components/GroupDetail";
import NewGroupForm from "./components/NewGroupForm";
import EventPage from "./components/EventsPage";
import EventDetail from "./components/EventDetail";
import NewEvent from "./components/NewEvent/NewEvent";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/groups">
          <GroupPage />
        </Route>
        <Route exact path="/groups/new">
          <NewGroupForm />
        </Route>
        <Route exact path="/events">
          <EventPage />
        </Route>
        <Route exact path="/groups/:groupId/events/new">
          <NewEvent />
        </Route>
        <Route exact path="/groups/:groupId">
          <GroupDetail />
        </Route>
        <Route exact path="/events/:eventId">
          <EventDetail />
        </Route>
      </Switch>
    </>
  );
}

export default App;
