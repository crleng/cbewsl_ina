import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FabMuiTable from "../utils/MuiTable";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  sendMeasurement,
  deletePrevMeasurement,
  getStaffs,
  getTableSurficial,
} from "../../apis/SurficialMeasurements";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import PromptModal from "./modals/PromptModal";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";

import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { CBEWSL_SITE_CODE } from "../../host";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 255,
      width: 250,
    },
  },
};

const SurficialMarkers = (props) => {
  const [open, setOpen] = useState(false);

  const [staffs, setStaffs] = useState([]);

  const [markersTable, setMarkersTable] = useState([]);
  const [tableColumns, setTableColumns] = useState([
    { accessorKey: "date", header: "Date" },
    { accessorKey: "time", header: "Time" },
    { accessorKey: "measurer", header: "Measurer" },
  ]);
  const [markers, setMarkers] = useState([]);

  const [openPrompt, setOpenPrompt] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedMoId, setSelectedMoId] = useState(null);

  const [measurement, setMeasurement] = useState({
    date: new Date(),
    time: new Date(),
    reporter: [],
  });
  const [newName, setNewName] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchAll();
    }, 60000);
  }, []);

  const initialize = () => {
    setMeasurement({
      date: new Date(),
      time: new Date(),
      reporter: [],
    });
    setConfirmation(false);
  };

  const fetchAll = () => {
    let endDate = moment(new Date()).format("YYYY-MM-DD HH:mm:00");
    let startDate = moment(new Date("2020-10-25")).format(
      "YYYY-MM-DD HH:mm:00"
    );

    let submitData = {
      startDate: startDate,
      endDate: endDate,
    };

    getTableSurficial(submitData, (response) => {
      if (response.status) {
        let tempColumns = [
          { name: "date", label: "Date" },
          { name: "time", label: "Time" },
        ];

        response.data.markers.map((col) => {
          tempColumns.push({
            name: col,
            label: `${col.toUpperCase()} (CM)`,
          });
        });

        tempColumns.push({ name: "weather", label: "Weather" });
        tempColumns.push({ name: "measurer", label: "Measurer" });

        setMarkers(response.data.markers);
        setTableColumns(tempColumns);

        let tempMarkers = [];

        response.data.table_data.map((marker) => {
          tempMarkers.push({
            ...marker,
            date: moment(marker.date).format("LL"),
            time: moment(new Date(marker.time)).format("LT"),
          });
        });
        setMarkersTable(tempMarkers);
      }
    });

    getStaffs((response) => {
      if (response.status) {
        setStaffs(response.data);
      }
    });
  };

  const [incomplete, setIncomplete] = useState(false);
  const [atleastOne, setAtleastOne] = useState(true);

  const checkAtleastOne = () => {
    let valid = false;

    markers.forEach((marker) => {
      if (measurement.hasOwnProperty(marker) && measurement[marker] != "")
        valid = true;
    });
    return valid;
  };

  const checkRequired = () => {
    let valid = true;
    if (
      measurement.date != "" &&
      measurement.time != "" &&
      (measurement.hasOwnProperty("weather")
        ? measurement.weather != ""
        : false)
    ) {
      valid = checkAtleastOne();
    } else valid = false;

    return valid;
  };

  const reporterCheck = () => {
    return measurement.hasOwnProperty("reporter")
      ? measurement.reporter.length > 0
        ? true
        : measurement.hasOwnProperty("reporterOther")
        ? measurement.reporterOther != ""
          ? true
          : false
        : false
      : measurement.hasOwnProperty("reporterOther")
      ? measurement.reporterOther != ""
        ? true
        : false
      : false;
  };

  const isAlpha = (str) => {
    return /^[a-zA-Z ]*$/.test(str);
  };

  const submitMeasurements = () => {
    let tempMarkers = {};
    let reporterStr = measurement.reporter.join(" ");
    if (measurement.reporterOther != undefined) {
      reporterStr += measurement.reporterOther;
    }

    markers.map((marker) => {
      tempMarkers[marker.toUpperCase()] = measurement[marker];
    });

    let dateString = `${moment(measurement.date).format("LL")} ${moment(
      new Date(measurement.time)
    ).format("hh:mm A")}`;
    let submitData = {
      date: dateString,
      marker: tempMarkers,
      panahon: measurement.weather,
      reporter: reporterStr.toUpperCase(),
      type: "EVENT",
      site_code: CBEWSL_SITE_CODE.toLocaleUpperCase(),
    };

    if (isUpdate) {
      deletePrevMeasurement(selectedMoId, (response) => {
        sendMeasurement(submitData, (response) => {
          if (response.status == true) {
            setOpen(false);

            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Successfully saved ground measurements",
            });
            fetchAll();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Error saving ground measurements. Please contact developers",
            });
          }
        });
      });
    } else {
      sendMeasurement(submitData, (response) => {
        if (response.status == true) {
          setOpen(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully saved ground measurements",
          });
          fetchAll();
          initialize();
        } else {
          initialize();
          setOpen(false);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error sending ground measurements. Please contact developers",
          });
        }
      });
    }
  };

  const handleSubmit = () => {
    let valid = checkRequired() && reporterCheck();

    if (valid) {
      let promptMsg = `Date ${moment(measurement.date).format("LL")}`;
      promptMsg += `Time ${moment(new Date(measurement.time)).format(
        "hh:mm A"
      )}\n`;
      promptMsg += "Measurements:\n";

      markers.map((marker) => {
        if (measurement.hasOwnProperty(marker) && measurement[marker] != "")
          promptMsg += `${marker.toUpperCase()}: ${measurement[marker]}\n`;
      });
      promptMsg += `Weather: ${measurement.weather}\n`;
      promptMsg += `Reporter: ${measurement.reporter.join(" ")} `;
      if (measurement.reporterOther != undefined) {
        promptMsg += measurement.reporterOther;
      }

      setConfirmation(true);
      // setOpen(false);
      setOpenPrompt(true);
      setErrorPrompt(false);
      setPromptTitle("Please confirm ground measurement inputs: ");
      setNotifMessage(promptMsg);
    } else {
      setIncomplete(true);
      setAtleastOne(checkAtleastOne());
    }
  };

  useEffect(() => {
    if (incomplete) setAtleastOne(checkAtleastOne());
  }, [measurement]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    initialize();
  };

  const options = {
    print: false,
    filter: true,
    // selectableRowsHideCheckboxes: true,
    selectableRows: false,
    filterType: "dropdown",
    responsive: "vertical",
    downloadOptions: {
      filename: `surficial_marker_data_${moment().format("YYYY-MM-DD")}`,
    },
    setCellProps: () => ({ style: { textAlignLast: "center" } }),
    // onRowsDelete: rowsDeleted => {
    // const idsToDelete = rowsDeleted.data.map (item => item.dataIndex)
    // handleMuiTableBatchDelete(idsToDelete.sort());
    // },
    // onRowClick: handleRowClick,
  };

  return (
    <Grid sx={{ mx: 10 }}>
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        title={promptTitle}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        confirmation={confirmation}
        callback={(response) => {
          if (response) {
            submitMeasurements();
          }
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isUpdate ? "Update " : "Enter new "}surficial marker measurements
        </DialogTitle>
        <DialogContent>
          {/* <FormControl
            error={incomplete == true && measurement.type == "" ? true : false}
          >
            <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => {
                setMeasurement({
                  ...measurement,
                  type: e.target.value,
                });
              }}
            >
              <FormControlLabel
                value="ROUTINE"
                control={<Radio />}
                label="Routine"
              />
              <FormControlLabel
                value="EVENT"
                control={<Radio />}
                label="Event"
              />
            </RadioGroup>
            <FormHelperText>
              {incomplete && measurement.type == ""
                ? "This field is required"
                : ""}
            </FormHelperText>
          </FormControl> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box flexDirection={"row"} style={{ paddingTop: 10 }}>
              <DatePicker
                label="Date"
                value={measurement.date}
                onChange={(e) => {
                  setMeasurement({
                    ...measurement,
                    date: moment(new Date(e)).format("YYYY-MM-DD"),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    style={{ width: "49%", marginRight: "2%" }}
                    {...params}
                  />
                )}
              />
              <TimePicker
                label="Time of measurement"
                value={measurement.time}
                onChange={(e) => {
                  setMeasurement({
                    ...measurement,
                    time: e,
                  });
                }}
                renderInput={(params) => (
                  <TextField style={{ width: "49%" }} {...params} />
                )}
              />
            </Box>
          </LocalizationProvider>
          <Typography
            style={{ paddingTop: 15, color: atleastOne ? "black" : "red" }}
          >
            Marker measurements:{" "}
            <Typography
              style={{
                fontStyle: "italic",
                color: atleastOne ? "gray" : "red",
                margin: 0,
                fontSize: "12px",
              }}
            >
              please input atleast one marker measurement
            </Typography>
          </Typography>
          <Box
            container
            flexDirection={"row"}
            paddingTop={1}
            paddingBottom={2}
            align="center"
            justifyContent={"space-around"}
          >
            {markers.map((marker) => (
              <TextField
                autoFocus
                label={marker.toUpperCase()}
                error={incomplete && !atleastOne}
                variant="outlined"
                defaultValue={measurement[marker]}
                style={{ width: "23%", margin: "1%" }}
                onChange={(e) => {
                  let temp = { ...measurement };
                  temp[marker] = e.target.value;
                  setMeasurement(temp);
                }}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
              />
            ))}
          </Box>

          <FormControl
            fullWidth
            style={{ width: "100%", paddingBottom: 15 }}
            error={
              incomplete &&
              (measurement.weather == "" || measurement.weather == undefined)
                ? true
                : false
            }
          >
            <InputLabel id="demo-simple-select-label">Weather</InputLabel>
            <Select
              error={
                incomplete &&
                (measurement.weather == "" || measurement.weather == undefined)
                  ? true
                  : false
              }
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Weather"
              value={measurement.weather}
              onChange={(e) => {
                setMeasurement({
                  ...measurement,
                  weather: e.target.value,
                });
              }}
            >
              <MenuItem value={"Maaraw"}>Maaraw</MenuItem>
              <MenuItem value={"Maulap"}>Maulap</MenuItem>
              <MenuItem value={"Maulan"}>Maulan</MenuItem>
              <MenuItem value={"Makulimlim"}>Makulimlim</MenuItem>
              <MenuItem value={"Maambon"}>Maambon</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <FormControl
            fullWidth
            style={{ width: "100%", paddingBottom: 15 }}
            error={
              incomplete &&
              (measurement.reporter == "" ||
                measurement.reporter == undefined) &&
              (measurement.reporterOther == "" ||
                measurement.reporterOther == undefined)
                ? true
                : false
            }
          >
            <InputLabel id="demo-simple-select-label">Measurer</InputLabel>
            <Select
              error={
                incomplete &&
                (measurement.reporter.length <= 0 ||
                  measurement.reporter == undefined) &&
                (measurement.reporterOther == "" ||
                  measurement.reporterOther == undefined)
                  ? true
                  : false
              }
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Measurer"
              multiple
              value={measurement.reporter}
              onChange={(e) => {
                const {
                  target: { value },
                } = e;

                setMeasurement({
                  ...measurement,
                  reporter:
                    typeof value === "string" ? value.split(", ") : value,
                });
              }}
              MenuProps={MenuProps}
            >
              {staffs.map((staff) => (
                <MenuItem
                  key={staff.user_id}
                  value={`${staff.first_name} ${staff.last_name}`}
                >
                  {`${staff.first_name} ${staff.last_name}`}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={newName}
                onChange={(e) => {
                  setNewName(e.target.checked);
                }}
              />
            }
            label="Add New Name"
            style={{ width: "100%" }}
          />
          {newName && (
            <TextField
              id="filled-helperText"
              label="Measurer not on the list"
              placeholder="Ex: Juan Dela Cruz"
              error={isAlpha(measurement.reporterOther) ? false : true}
              helpertext={
                isAlpha(measurement.reporterOther)
                  ? ""
                  : "Please input letters only"
              }
              variant="outlined"
              style={{ width: "100%" }}
              value={measurement.reporterOther}
              onChange={(e) => {
                setMeasurement({
                  ...measurement,
                  reporterOther: e.target.value,
                });
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              handleSubmit();
            }}
          >
            Save Measurements
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={4} sx={{ mt: 2, mb: 6, padding: "2%" }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Surficial Markers</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={handleClickOpen}
                style={{
                  backgroundColor: "#ffd400",
                  color: "black",
                  float: "right",
                }}
              >
                Add surficial marker measurement
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FabMuiTable
                data={{
                  columns: tableColumns,
                  rows: markersTable.sort((a, b) => b.ts - a.ts),
                }}
                options={options}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SurficialMarkers;
