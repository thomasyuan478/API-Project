import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from './components/LandingPage';
import GroupPage from "./components/GroupsPage";
import GroupDetail from "./components/GroupDetail";

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
        <Route exact path='/'>
          <LandingPage />
        </Route>
        <Route exact path='/groups'>
          <GroupPage />
        </Route>
        <Route exact path='/events'>
          <h1>Events Page</h1>
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetail />
        </Route>
      </Switch>
    </>
  );
}

export default App;
