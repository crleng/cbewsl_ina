import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { releaseAlert } from "../../../apis/MoMs";

function AlertReleaseFormModal(props) {
  const {
    isOpen,
    trigger,
    setOpenModal,
    handleSubmitRelease,
    monitoringReleases,
    setMonitoringReleases,
    setTriggers,
    triggers,
    generateDashboardData,
    capitalizeFirstLetter,
  } = props;

  const { trigger_list_arr, public_alert_level } = trigger;
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const releaseWarning = () => {
    setOpenBackdrop(!openBackdrop);
    if (public_alert_level !== 0) {
      trigger.release_details.release_time = moment().format("HH:mm");
      trigger.release_details.with_retrigger_validation = false;
      trigger.release_details.comments = "";
    } else {
      try {
        trigger.release_details.release_time = moment().format("HH:mm");
        trigger.release_details.with_retrigger_validation = false;
        trigger.release_details.comments = "";
      } catch (e) {
        trigger.release_time = moment().format("HH:mm");
        trigger.with_retrigger_validation = false;
      }
    }
    releaseAlert(trigger, (return_data) => {
      const { status, message } = return_data;
      setOpenModal(false);
      if (status) {
        generateDashboardData();
        handleSubmitRelease(message, status ? "success" : "error");
      } else {
        handleSubmitRelease(message, status ? "success" : "error");
      }
      setOpenBackdrop(false);
    });
  };
  return (
    <Dialog
      fullWidth
      fullScreen={false}
      open={isOpen}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Release Warning</DialogTitle>
      <DialogContent>
        {trigger_list_arr && trigger_list_arr.length > 0 ? (
          trigger_list_arr.map((row, index) => {
            const { tech_info, trigger_type, ts_updated, validating_status } =
              row;
            return (
              <Grid container style={{ textAlign: "center" }}>
                <Grid item md={12}>
                  <Typography variant="h6">
                    Alert level {public_alert_level} Triggers
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="body1">Trigger</Typography>
                  <Typography variant="body2">
                    {capitalizeFirstLetter(trigger_type)}
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1">Trigger timestamp</Typography>
                  <Typography variant="body2">
                    {moment(ts_updated).format("MMMM D, YYYY, h:mm A")}
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Technical Information</Typography>
                  <Typography variant="body2">{tech_info}</Typography>
                </Grid>
              </Grid>
            );
          })
        ) : (
          <Grid container style={{ textAlign: "center" }}>
            <Grid item md={12}>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                No new triggers
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => setOpenModal(false)}
          color="error"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={releaseWarning}
          color="primary"
        >
          Release Warning
        </Button>
      </DialogActions>
      <Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Dialog>
  );
}

export default AlertReleaseFormModal;
