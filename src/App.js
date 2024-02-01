import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Signin from "./components/authentication/Signin";
import OperationCenter from "./components/interfaces/OperationCenter";
import Events from "./components/interfaces/Events";
import Communication from "./components/interfaces/Communication";
import Analysis from "./components/interfaces/Analysis";
import Assessment from "./components/interfaces/Assessment";
import MainHeader from "./components/utils/MainHeader";
import CommunityRiskAssessment from "./components/interfaces/CommunityRiskAssessment";
import GroundData from "./components/interfaces/GroundData";
import CapacityAndVulnerability from "./components/interfaces/CapacityAndVulnerability";
import Rainfall from "./components/interfaces/Rainfall";
import Subsurface from "./components/interfaces/Subsurface";
import Surficial from "./components/interfaces/Surficial";
import Earthquake from "./components/interfaces/Earthquake";
import SurficialMarkers from "./components/interfaces/SurficialMarkers";
import Moms from "./components/interfaces/Moms";
import Feedback from "./components/interfaces/Feedback";
import ChangePassword from "./components/utils/ChangePassword";
import ProfileSettings from "./components/utils/ProfileSettings";
import Bulletin from "./components/utils/Bulletin";
import "./components/interfaces/css/sandbox.css";
import "./components/interfaces/css/embla.css";

import { CBEWSL_SITE_NAME } from "./host";

const App = (props) => {
  const [nav, setNav] = useState(null);
  const Header = () => {
    let location = window.location.pathname;
    if (
      location !== `${CBEWSL_SITE_NAME}/signin` &&
      location !== `/${CBEWSL_SITE_NAME}`
    ) {
      return <MainHeader />;
    }
  };

  useEffect(() => {
    Header();
    setNav(Header());
  }, [props]);

  return (
    <Fragment>
      <SnackbarProvider>
        <Router>
          {nav}
          <Routes>
            <Route exact path={`${CBEWSL_SITE_NAME}`} element={<Signin />} />
            <Route
              exact
              path={`${CBEWSL_SITE_NAME}/signin`}
              element={<Signin />}
            />
            <Route
              exact
              path={`${CBEWSL_SITE_NAME}/feedback`}
              element={<Feedback />}
            />
          </Routes>

          {localStorage.getItem("credentials") != null ? (
            <Routes>
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/opcen`}
                element={<OperationCenter />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/bulletin`}
                element={<Bulletin />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/events`}
                element={<Events />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/communication`}
                element={<Communication />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/analysis`}
                element={<Analysis />}
              />
              {/* <Route
                exact
                path={`${CBEWSL_SITE_NAME}/assessment`}
                element={<Assessment />}
              /> */}
              {/* <Route exact path={`${CBEWSL_SITE_NAME}/cra`} element={<CRA />} /> */}
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/ground_data`}
                element={<GroundData />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/cav`}
                element={<CapacityAndVulnerability />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/rainfall`}
                element={<Rainfall />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/subsurface`}
                element={<Subsurface />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/surficial`}
                element={<Surficial />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/earthquake`}
                element={<Earthquake />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/change-password`}
                element={<ChangePassword />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/profile-settings`}
                element={<ProfileSettings />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/surficial_markers`}
                element={<SurficialMarkers />}
              />
              <Route
                exact
                path={`${CBEWSL_SITE_NAME}/moms`}
                element={<Moms />}
              />
            </Routes>
          ) : (
            window.location.pathname != `/${CBEWSL_SITE_NAME}` &&
            window.location.pathname != `${CBEWSL_SITE_NAME}` &&
            window.location.pathname != `${CBEWSL_SITE_NAME}/signin` &&
            window.location.pathname != `${CBEWSL_SITE_NAME}/feedback` &&
            (window.location = `/${CBEWSL_SITE_NAME}`)
          )}
        </Router>
      </SnackbarProvider>
    </Fragment>
  );
};

export default App;
