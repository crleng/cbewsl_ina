import { Box, Grid, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { Fragment, useEffect } from "react";
import mdrrmc_logo from "../../assets/bakun_municipal_seal.png";
import moment from "moment";
import { CBEWSL_SITE_CODE, CBEWSL_SITE_LOCATION } from "../../host";
import { PDFExport } from "@progress/kendo-react-pdf";


const GeneratedBulletin = () => {
    const location = useLocation();
    const currentYear = moment().format("YYYY");
    const siteName = CBEWSL_SITE_CODE.toUpperCase();
    const pdfExportComponent = React.useRef(null);

    const PageTemplate = (props) => {
        return (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
            }}
          >
            Page {props.pageNum} of {props.totalPages}
          </div>
        );
      };

    return (
        <div>
        <PDFExport
            pageTemplate={PageTemplate}
            keepTogether="typography"
            avoidLinks
            paperSize="A4"
            scale={0.7}
            margin="5mm" 
            ref={pdfExportComponent} 
            fileName={`alert-bulletin-${moment().format(
                "YYYY-MM-DD HH:mm:ss"
              )}`}
            >
            <Grid
              container
              justifyContent="center"
              alignItems="flex-start"
              textAlign="center"
            >
              <Grid
                container
                spacing={3}
                alignItems="center"
                justifyContent="flex-center"
              >
                <Grid item xs={3} style={{ marginTop: 20, textAlign: "right" }}>
                  <img
                    src={mdrrmc_logo}
                    alt="letter-header"
                    style={{
                      objectFit: "contain",
                      width: 100,
                      height: 100,
                    }}
                  />
                </Grid>
                <Grid item xs={9} style={{ textAlign: "left", marginTop: 20 }}>
                  <Typography variant="body1">
                    <b>Republic of the Philippines</b>
                  </Typography>
                  <Typography variant="body1">
                    <b>Province of Benguet </b>
                  </Typography>
                  <Typography variant="body1">
                    <b>Municipality of Bakun</b>
                  </Typography>
                  <Typography variant="body1">
                    <b>Community-based Early Warning System for Landslides</b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ marginBottom: 20, marginTop: 20 }}
              >
                <Typography variant="h5">
                  <b>
                    CBEWS-L ALERT LEVEL INFORMATION: {siteName}-{currentYear}
                  </b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" style={{ marginBottom: 20 }}>
              <Box
                sx={{
                  width: 600,
                  height: "auto",
                  border: "2px solid black",
                  padding: 2,
                }}
              >
                <Typography variant="body1">
                  Location: <strong>{location.state.siteLocation}</strong>
                </Typography>
                <Typography variant="body1">
                  Date/Time:{" "}
                  <strong>
                    {moment(location.state.currentAlertTs).format(
                      "MMMM D, YYYY, h:mm A"
                    )}
                  </strong>
                </Typography>
                <Typography variant="body1">
                  Alert Level Released:{" "}
                  <strong>{location.state.alertLevel}</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ marginLeft: 50, marginRight: 50 }}
              >
                <Typography variant="body1">
                  <b>
                    <u>AREA SITUATION:</u>
                  </b>
                </Typography>
                {location.state.triggerSource.map((data) =>
                  data.source.toLowerCase() == "landslide features" ? (
                    <Fragment>
                      <Typography variant="subtitle1">
                        <b>LANDSLIDE FEATURES</b>
                      </Typography>
                      <Typography variant="subtitle1">
                        {data.info} {data.description}
                      </Typography>
                    </Fragment>
                  ) : data.source.toLowerCase() == "rainfall" ? (
                    <Fragment>
                      <Typography variant="subtitle1">
                        <b>RAINFALL</b>
                      </Typography>
                      <Typography variant="subtitle1">
                        {data.info} {data.description}
                      </Typography>
                    </Fragment>
                  ) : data.source.toLowerCase() == "earthquake" ||
                    data.source.toLowerCase() == "surficial" ||
                    data.source.toLowerCase() == "subsurface" ? (
                    <Fragment>
                      <Typography variant="subtitle1">
                        <b>GROUND MOVEMENT</b>
                      </Typography>
                      <Typography variant="subtitle1">
                        {data.info} {data.description}
                      </Typography>
                    </Fragment>
                  ) : (
                    <Typography variant="subtitle1">
                      No ground movement observed
                    </Typography>
                  )
                )}
                <Typography variant="subtitle1">
                  <b>ELEMENTS AT RISK</b>
                </Typography>
                <Typography variant="subtitle1">
                  At least 31 households, Roman Catholic Church
                </Typography>
                <Typography variant="body1" style={{ marginTop: 20 }}>
                  <b>
                    <u>OTHER RECOMMENDATIONS:</u>
                  </b>
                </Typography>
                {location.state.communityRP !== "" && (
                  <Typography variant="subtitle1">
                    <b>For the Community:</b> {location.state.communityRP}
                  </Typography>
                )}
                {location.state.lewcRP !== "" && (
                  <Typography variant="subtitle1">
                    <b>For the Landslide Early Warning Committee (LEWC):</b>{" "}
                    {location.state.lewcRP}
                  </Typography>
                )}
                {location.state.barangayRP !== "" && (
                  <Typography variant="subtitle1">
                    <b>For the Barangay:</b> {location.state.barangayRP}
                  </Typography>
                )}
                {location.state.municipalRP !== "" && (
                  <Typography variant="subtitle1">
                    <b>For the Municipal:</b> {location.state.municipalRP}
                  </Typography>
                )}
                {location.state.provincialRp !== "" && (
                  <Typography variant="subtitle1">
                    <b>For the Provincial:</b> {location.state.provincialRp}
                  </Typography>
                )}
                <Typography variant="subtitle1" style={{ marginTop: 20 }}>
                  <b>NOTE:</b> This bulletin contains the official Alert Level and
                  Recommended Response of the Bakun MDRRMO for {" "} {CBEWSL_SITE_LOCATION} and
                  will hold true until a new bulletin is released.
                </Typography>
              </Grid>
            </Grid>
        </PDFExport>

        <Grid
          item
          xs={12}
          style={{ justifyContent: "center", textAlign: "center", margin: 10 }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (pdfExportComponent.current) {
                pdfExportComponent.current.save();
              }
            }}
          >
            Download Bulletin
          </Button>
        </Grid>

        </div>
    )
  };

export default GeneratedBulletin;