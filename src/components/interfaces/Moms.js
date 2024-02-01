import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Button,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import FabMuiTable from "../utils/MuiTable";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { uploadMomsResources, getFilesFromFolder } from "../../apis/Misc";
import {
  getFeatures,
  getInstances,
  insertMomsEntry,
  getStaffs,
} from "../../apis/MoMs";
import moment from "moment";
import PromptModal from "./modals/PromptModal";
import { makeStyles } from "@material-ui/core/styles";
import MomsTable from "./MomsTable";
import ListItemText from "@mui/material/ListItemText";
import { CBEWSL_SITE_CODE } from "../../host";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  textarea: {
    resize: "both",
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 250,
    },
  },
};

const Moms = (props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [datetimestamp, setDateTimestamp] = useState(new Date());
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  // const [selectedFeatureName, setSelectedFeatureName] = useState("");
  const [selectedAlertLevel, setSelectedAlertLevel] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [featureDetails, setFeatureDetails] = useState("");
  const [featureLocation, setFeatureLocation] = useState("");
  // const [reporter, setReporter] = useState({
  //   user_id: "",
  //   first_name: "",
  //   last_name: "",
  // });
  const [featureName, setFeatureName] = useState({});
  const [featureNames, setFeatureNames] = useState([
    {
      name: "New Instance",
      instance_id: null,
    },
  ]);

  const [instances, setInstances] = useState([]);
  // const [instanceID, setInstanceID] = useState(null);
  const [staffs, setStaffs] = useState([]);

  // const [existingFeatureName, setExistingFeatureName] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    setUserId(credentials.user.user_id);
  }, []);

  const feature_list = [
    {
      feature_id: 1,
      feature: "Crack",
      details:
        "Ilang crack ang nakita?: " +
        "\nGaano kahaba?: " +
        "\nGaano kalapad?: " +
        "\nAno ang lalim nito?: " +
        "\nAno ang oryentasyon o direksyon?: " +
        "\nGaano kalaki ang pagbabago? (Kung luma): ",
    },
    {
      feature_id: 2,
      feature: "Scarp",
      details:
        "Ilang scarp ang nakita?: " +
        "\nGaano kahaba?: " +
        "\nGaano kalapad?: " +
        "\nAno ang taas nito?: " +
        "\nAno ang oryentasyon o direksyon?: " +
        "\nGaano kalaki ang pagbabago?(Kung luma): ",
    },
    {
      feature_id: 3,
      feature: "Seepage",
      details:
        "Gaano kabilis/kalakas ang daloy ng tubig?: " +
        "\nGaano karami ang tubig na umaagos?: " +
        "\nAno ang kulay ng tubig?: " +
        "\nBagong seepage o dati na?: ",
    },
    {
      feature_id: 4,
      feature: "Ponding",
      details:
        "Gaano kalaki ang ponding?: " +
        "\nMayroon bang kalapit na iba pang landslide feature?: " +
        "\nBagong ponding o dati pa?: ",
    },
    {
      feature_id: 5,
      feature: "Tilted/Split Trees",
      details:
        "Saang direksyon nakatagilid/nakatabingi/nahati ang puno?: " +
        "\nPara sa split trees, gaano kalaki ang hati?: ",
    },
    {
      feature_id: 6,
      feature: "Damaged Structures",
      details:
        "Mayroon bang mga paglubong sa sahig o pagtagilid nng mga dingding?: " +
        "\nSaan nakita ang crack at ano ang oryentasyon nito?: ",
    },
    {
      feature_id: 7,
      feature: "Slope Failure",
      details:
        "Saang bahagi ng slope ito na-obserbahan?: " +
        "\nGaano kalayo ang narating ng pagguho ng lupa?: " +
        "\nMayroon bang mga naapektuhang istruktura?: " +
        "\nGaano ito kataas at kalapad?: ",
    },
    {
      feature_id: 8,
      feature: "Bulging/Depression",
      details:
        "Ilan ang nakitang pag-umbok o paglubog ng lupa?: " +
        "\nGaano ito kalaki?: " +
        "\nMayroon bang kalapit na iba pang landslide feature?: ",
    },
  ];

  useEffect(() => {
    setFeatureName("");

    getFeatures((response) => {
      if (response.status) {
        let tempData = response.data;

        tempData.map((feature) => {
          if (feature.feature_id == selectedFeatureIndex) {
            let tempFeatureNames = [
              {
                name: "New Instance",
                instance_id: null,
              },
            ];

            if (feature.instances.length > 0) {
              feature.instances.map((instance) => {
                tempFeatureNames.push({
                  instance_id: instance.instance_id,
                  name: instance.feature_name,
                });
              });
            }

            setFeatureNames(tempFeatureNames);
          }
        });
      }
    });

    setFeatureDetails(
      selectedFeatureIndex != null
        ? feature_list.find((o) => o.feature_id == selectedFeatureIndex).details
        : ""
    );
  }, [selectedFeatureIndex]);

  useEffect(() => {
    reloadTable();
  }, [props]);

  const reloadTable = () => {
    getInstances((response) => {
      if (response) {
        setInstances(response);
      }
    });

    getStaffs((response) => {
      setStaffs(response.data);
    });
  };

  const handleUpload = (uploadImage) => {
    const formData = new FormData();
    formData.append("file", uploadImage);
    formData.append("folder", "moms_images");

    uploadMomsResources(formData, (data) => {
      const { status, message } = data;
      if (status) {
        getFilesFromFolder("moms_images", (response) => {
          // setFiles(response)
        });
      } else {
        console.log("Error upload", message);
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    initialize();
    setOpen(false);
  };

  useEffect(() => {
    if (selectedAlertLevel === 0) {
      setNarrative("No changes were observed.");
      setFeatureDetails("No changes were observed.");
    }
  }, [selectedAlertLevel]);

  const initialize = () => {
    setDateTimestamp(new Date());
    setSelectedFeatureIndex(null);
    // setSelectedFeatureName("");
    setSelectedAlertLevel(null);
    setFeatureDetails("");
    setNarrative("");
    setFeatureLocation("");
    // setReporter({
    //   user_id: "",
    //   first_name: "",
    //   last_name: "",
    // });
    setFeatureName({});
    setFeatureNames([
      {
        name: "New Instance",
        instance_id: null,
      },
    ]);
    setIncomplete(false);
  };

  const [incomplete, setIncomplete] = useState(false);
  const checkRequired = () => {
    if (selectedAlertLevel == null || selectedFeatureIndex == null)
      return false;
    else if (featureName.instance_id == null && featureLocation == "")
      return false;
    else if (!featureName.hasOwnProperty("instance_id")) return false;
    else return true;
  };

  const submitMoms = () => {
    let moms_entry = {
      site_code: CBEWSL_SITE_CODE,
      moms_list: [
        {
          alert_level: selectedAlertLevel,
          instance_id: featureName.instance_id,
          feature_name:
            featureName.instance_id == null ? null : featureName.name,
          feature_type: feature_list.find(
            (o) => o.feature_id == selectedFeatureIndex
          ).feature,
          report_narrative: featureDetails,
          observance_ts: moment(new Date(datetimestamp)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          remarks: narrative,
          reporter_id: 1, //default muna, need mag create ng general community account
          validator_id: userId,
          location: featureLocation,
          iomp: userId,
          file_name: "",
        },
      ],
      uploads: [],
    };
    console.log("moms_entry", moms_entry);

    insertMomsEntry(moms_entry, (response) => {
      if (response.status == true) {
        initialize();
        reloadTable();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Manifestations of movements saved!",
        });
        setOpen(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error on saving manifestations of movement, please contact developers",
        });
      }
    });
  };

  const handleSubmit = () => {
    let valid = checkRequired();

    if (valid) {
      let promptMsg = `Date: ${moment(new Date(datetimestamp)).format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n`;
      promptMsg += `Feature Type: ${
        feature_list.find((o) => o.feature_id == selectedFeatureIndex).feature
      }\n`;
      if (featureName.instance_id != null)
        promptMsg += `Feature Name: ${featureName.name}\n`;
      promptMsg += `Description: ${featureDetails}\n`;
      promptMsg += `Narratives: ${narrative}\n`;
      promptMsg += `Alert Level: ${selectedAlertLevel}`;

      setConfirmation(true);
      // setOpen(false);
      setOpenPrompt(true);
      setErrorPrompt(false);
      setPromptTitle("Please confirm inputs: ");
      setNotifMessage(promptMsg);
    } else {
      setIncomplete(true);
    }
  };

  const [openPrompt, setOpenPrompt] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

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
            submitMoms();
          }
        }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Enter new manifestation of movement</DialogTitle>
        <DialogContent>
          <Grid item xs={12} style={{ paddingTop: 10 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date"
                value={datetimestamp}
                onChange={(e) => {
                  setDateTimestamp(e);
                }}
                renderInput={(params) => (
                  <TextField
                    style={{ width: "100%", paddingBottom: 10 }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              style={{ width: "100%", paddingBottom: 15 }}
              error={incomplete && selectedFeatureIndex == null}
            >
              <InputLabel id="demo-simple-select-label">
                Feature Type
              </InputLabel>
              <Select
                error={incomplete && selectedFeatureIndex == null}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Feature Type"
                value={selectedFeatureIndex}
                onChange={(e) => {
                  setSelectedFeatureIndex(e.target.value);
                  // setSelectedFeatureName(
                  //   selectedFeatureIndex != null
                  //     ? feature_list.find(
                  //         (o) => o.feature_id == selectedFeatureIndex
                  //       ).feature
                  //     : ""
                  // );
                }}
              >
                {feature_list &&
                  feature_list.map((row, index) => (
                    <MenuItem key={index} value={row.feature_id}>
                      {row.feature}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>
                {incomplete && selectedFeatureIndex == null && "required"}
              </FormHelperText>
            </FormControl>
            {selectedFeatureIndex != null && (
              <FormControl
                fullWidth
                style={{ width: "100%", paddingBottom: 15 }}
                error={incomplete && !featureName.hasOwnProperty("instance_id")}
              >
                <InputLabel id="demo-simple-select-label">
                  Feature Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Feature Name"
                  value={featureName.name}
                  onChange={(e) => {
                    setFeatureName(e.target.value);
                  }}
                >
                  {featureNames.map((row, index) => (
                    <MenuItem key={index} value={row}>
                      {row.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {incomplete &&
                    !featureName.hasOwnProperty("instance_id") &&
                    "required"}
                </FormHelperText>
              </FormControl>
            )}
          </Grid>

          {/* {featureName.instance_id == 0 && (
            <Grid item xs={12}>
              <TextField
                error={existingFeatureName ? true : false}
                helperText={
                  existingFeatureName
                    ? `This feature name already exists for the same feature type`
                    : ""
                }
                id="outlined-required"
                label="Feature Name"
                variant="outlined"
                style={{ width: "100%", paddingBottom: 10 }}
                onChange={(e) => {
                  setFeatureName({
                    name: e.target.value,
                    instance_id: 0,
                  });
                }}
              />
            </Grid>
          )} */}
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Landslide Feature Description"
              variant="outlined"
              style={{ width: "100%", paddingBottom: 10 }}
              value={featureDetails}
              onChange={(e) => {
                setFeatureDetails(e.target.value);
              }}
              multiline
              rows={6}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Narratives"
              variant="outlined"
              style={{ width: "100%", paddingBottom: 10 }}
              value={narrative}
              onChange={(e) => {
                setNarrative(e.target.value);
              }}
              multiline
              rows={4}
            />
          </Grid>
          {featureName.hasOwnProperty("instance_id") &&
            featureName.instance_id == null && (
              <Grid item xs={12}>
                <TextField
                  error={incomplete && featureLocation == ""}
                  helperText={incomplete && featureLocation == "" && "required"}
                  id="outlined-required"
                  label="Location"
                  variant="outlined"
                  style={{ width: "100%", paddingBottom: 10 }}
                  value={featureLocation}
                  onChange={(e) => {
                    setFeatureLocation(e.target.value);
                  }}
                />
              </Grid>
            )}

          {/* <Grid item xs={12}>
            <FormControl fullWidth style={{ width: "100%", paddingBottom: 15 }}>
              <InputLabel id="demo-simple-select-label">Reporter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Reporter"
                value={`${reporter.first_name} ${reporter.last_name}`}
                onChange={(e) => {
                  setReporter(e.target.value);
                }}
                renderValue={(selected) => selected}
                MenuProps={MenuProps}
              >
                {staffs.map((staff) => (
                  <MenuItem
                    key={staff.user_id}
                    // value={`${staff.first_name} ${staff.last_name}`}
                    value={staff}
                  >
                    <ListItemText
                      primary={`${staff.first_name} ${staff.last_name}`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          <FormControl
            fullWidth
            style={{ width: "100%", paddingBottom: 15 }}
            error={incomplete && selectedAlertLevel == null}
          >
            <InputLabel id="demo-simple-select-label">Alert Levels</InputLabel>
            <Select
              error={incomplete && selectedAlertLevel == null}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Alert level"
              onChange={(e) => {
                setSelectedAlertLevel(e.target.value);
              }}
            >
              <MenuItem key={0} value={0}>
                Alert level 0
              </MenuItem>
              <MenuItem key={2} value={2}>
                Alert level 2
              </MenuItem>
              <MenuItem key={3} value={3}>
                Alert level 3
              </MenuItem>
            </Select>
            <FormHelperText>
              {incomplete && selectedAlertLevel == null && "required"}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth style={{ width: "100%", paddingBottom: 15 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              multiple
              onChange={(e) => {
                console.log(e.target.files);
                // handleUpload(e.target.files[0]);
              }}
            />

            <label htmlFor="raised-button-file" style={{ textAlign: "center" }}>
              <Button variant="contained" component="span" sx={{ mx: 1 }}>
                Upload MoMs Images
              </Button>
            </label>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={4} sx={{ mt: 2, mb: 6, padding: "2%" }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Manifestations of Movement</Typography>
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
                Add manifestations of movement
              </Button>
            </Grid>
            <MomsTable instances={instances} />
            {/* <Grid item xs={12}>
              <Grid container align="center">
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    style={{ backgroundColor: "#ffd400", color: "black" }}
                  >
                    Add manifestations of movement
                  </Button>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Moms;
