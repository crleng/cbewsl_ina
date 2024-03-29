import React from "react";
import { Container, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import phivolcs_seal from "../../assets/phivolcs_seal.png";
import dynaslope_seal from "../../assets/dynaslope_seal.png";
import provincial_seal from "../../assets/Iloilo_logo.png"
import municipal_seal from "../../assets/Maasin_logo.png"
import brgy_seal from "../../assets/brgy_seal.png";
import lewc_seal from "../../assets/lewc_logo.png";

const useStyles = makeStyles((theme) => ({
  md_image: {
    length: "85px",
    width: "85px",
    [theme.breakpoints.down("sm")]: {
      length: "60px",
      width: "60px",
    },
  },
  sm_image: {
    length: "70px",
    width: "75px",
    marginLeft: "12px",
    [theme.breakpoints.down("sm")]: {
      length: "50px",
      width: "50px",
    },
  },
  s_image: {
    length: "70px",
    width: "75px",
    [theme.breakpoints.down("sm")]: {
      length: "50px",
      width: "50px",
    },
  },
  lg_image: {
    length: "100px",
    width: "100px",
    [theme.breakpoints.down("sm")]: {
      length: "70px",
      width: "70px",
    },
  },
}));

function SignInLogo(props) {
  const classes = useStyles();

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{ paddingTop: "2%", paddingBottom: "1%" }}
      >
        <Grid item xs={2}>
          <img
            className={classes.lg_image}
            src={phivolcs_seal}
            alt="phivolcs_seal"
          />
        </Grid>
        <Grid item xs={2}>
          <img
            className={classes.sm_image}
            src={dynaslope_seal}
            alt="dynaslope_seal"
          />
        </Grid>
        <Grid item xs={2}>
          <img
            className={classes.md_image}
            src={provincial_seal}
            alt="ina_province_seal"
          />
        </Grid>
        <Grid item xs={2}>
          <img
            className={classes.md_image}
            src={municipal_seal}
            alt="ina_municipality_seal"
          />
        </Grid>
        <Grid item xs={2}>
          <img
            className={classes.md_image}
            src={brgy_seal}
            alt="ina_brgy_seal"
          />
        </Grid>
        <Grid item xs={2}>
          <img
            className={classes.s_image}
            src={lewc_seal}
            alt="ina_lewc_seal"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export { SignInLogo };
