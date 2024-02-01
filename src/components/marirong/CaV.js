import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Button,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Checkbox,
} from "@mui/material";
import FabMuiTable from "../utils/MuiTable";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  getAllHouseholds,
  getSummary,
  addHousehold,
  editHousehold,
  deleteHousehold,
  getPregnant,
  getComorbid,
  getDisabled,
  getSenior,
  getChildren,
  getToddler,
} from "../../apis/CapacityAndVulnerability";
import PromptModal from "./modals/PromptModal";

import { CBEWSL_SITE } from "../../host";
import Swal from "sweetalert2";

const CaV = () => {
  const [householdData, setHouseholdData] = useState([]);

  const [vulnerables, setVulnerables] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    let tempHouseholds = [];

    getAllHouseholds((response) => {
      if (response.status) {
        response.data.map((household) => {
          let tempMembers = [];

          household.members.map((member) => {
            tempMembers.push({
              ...member,
              disabled: member.disability != null ? true : false,
              comorbid: member.comorbidity != null ? true : false,
            });
          });
          tempHouseholds.push({
            ...household,
            count: household.members.length,
            disabled: household.disability != null ? true : false,
            comorbid: household.comorbidity != null ? true : false,
            members: tempMembers,
          });
        });
        setHouseholdData(tempHouseholds);
      }
    });

    getSummary((response) => {
      setVulnerables([
        {
          key: "pregnant",
          title: "Pregnant",
          label: "Pregnant",
          count: response.pregnant_count,
        },
        {
          key: "disabled",
          title: "PWD",
          label: "Person with disability",
          count: response.disability_count,
        },
        {
          key: "comorbid",
          title: "Persons with Comorbidity",
          label: "Persons with comorbidity",
          count: response.comorbidity_count,
        },
        {
          key: "senior",
          title: "Senior Citizens",
          label: "Senior Citizens",
          count: response.seniors_count,
        },
        {
          key: "children",
          title: "Children",
          label: "Children (Ages 6 to 12)",
          count: response.children_count,
        },
        {
          key: "toddler",
          title: "Children",
          label: "Children (Ages 0 to 5)",
          count: response.toddler_count,
        },
      ]);
    });
  };

  const columns = [
    { name: "household_id", label: "Household #" },
    { name: "household_head", label: "Household Head" },
    { name: "count", label: "Member Count" },
    // { name: "actions", label: "Actions" },
  ];

  const options = {
    print: false,
    filter: true,
    selectableRows: "multiple",
    selectableRowsOnClick: true,
    filterType: "checkbox",
    responsive: "vertical",
    downloadOptions: {
      filename: `household_data_${moment().format("YYYY-MM-DD")}`,
    },
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map((item) => item.dataIndex);

      idsToDelete.forEach((element) => {
        handleDelete(householdData[element].id);
      });

      setOpenPrompt(true);
      setErrorPrompt(false);
      setPromptTitle("Success");
      setNotifMessage("Successfully delete household data.");
      // handleMuiTableBatchDelete(idsToDelete.sort());
    },
  };
  const [openModal, setOpenModal] = useState(false);

  const [openPrompt, setOpenPrompt] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const [householdHead, setHouseholdHead] = useState({
    id: "",
    name: "",
    birthdate: new Date(),
    gender: "",
    pregnant: false,
    disability: "not specified",
    comorbidity: "",
    disabled: false,
    comorbid: false,
  });
  const [householdMembers, setHouseholdMembers] = useState([]);

  const initialize = () => {
    setHouseholdHead({
      household_id: "",
      household_head: "",
      birthdate: new Date(),
      gender: "",
      pregnant: false,
      disability: "not specified",
      comorbidity: "",
      disabled: false,
      comorbid: false,
    });
    setHouseholdMembers([]);
    setConfirmation(false);
    setAction("");
  };

  const handleAddMember = () => {
    let tempHouseholdMembers = [...householdMembers];
    tempHouseholdMembers.push({
      household_member: "",
      birthdate: new Date(),
      gender: "",
      pregnant: false,
      disability: "not specified",
      comorbidity: "",
      disabled: false,
      comorbid: false,
    });
    setHouseholdMembers(tempHouseholdMembers);
  };

  const handleSubmit = () => {
    let tempMembers = [];

    householdMembers.map((member) => {
      tempMembers.push({
        ...member,
        birthdate: moment(member.birthdate).format("YYYY-MM-DD"),
        pregnant: member.hasOwnProperty("pregnant") ? member.pregnant : false,
        disability: member.disabled
          ? member.disability == "" || member.disability == null
            ? "not specified"
            : member.disability
          : null,
        comorbidity: member.comorbid
          ? member.comorbidity == "" || member.comorbidity == null
            ? "not specified"
            : member.comorbidity
          : null,
      });
    });

    let submitData = {
      ...householdHead,
      birthdate: moment(householdHead.birthdate).format("YYYY-MM-DD"),
      pregnant: householdHead.hasOwnProperty("pregnant")
        ? householdHead.pregnant
        : false,
      disability: householdHead.disabled
        ? householdHead.disability == "" || householdHead.disability == null
          ? "not specified"
          : householdHead.disability
        : null,
      comorbidity: householdHead.comorbid
        ? householdHead.comorbidity == "" || householdHead.comorbidity == null
          ? "not specified"
          : householdHead.comorbidity
        : null,
      members: tempMembers,
      site_id: CBEWSL_SITE,
    };

    if (action == "add") {
      addHousehold(submitData, (response) => {
        if (response.status == true) {
          initialize();
          setOpenModal(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully added household data",
          });
          fetchAll();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error adding household data. Please contact developers",
          });
        }
      });
    } else if (action == "edit") {
      editHousehold(submitData, (response) => {
        if (response.status == true) {
          initialize();
          setOpenModal(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully edited household data",
          });
          fetchAll();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error editing household data. Please contact developers",
          });
        }
      });
    }
  };

  const [action, setAction] = useState("");

  const handleEdit = (response) => {
    setAction("edit");

    setHouseholdHead(response);
    setHouseholdMembers(response.members);
    setOpenModal(true);
  };

  const [deleteID, setDeleteID] = useState(null);

  const confirmDelete = (response) => {
    setAction("delete");
    setOpenPrompt(true);
    setErrorPrompt(false);
    setPromptTitle("Are you sure you want to delete this household?");
    setNotifMessage("This household information will be deleted immediately.");
    setConfirmation(true);
    setDeleteID(response);
  };

  const handleDelete = (passedId = null) => {
    let id_to_delete = null;
    if (passedId === null) {
      id_to_delete = deleteID.id;
    } else {
      id_to_delete = passedId;
    }
    deleteHousehold({ id: id_to_delete }, (response) => {
      if (response.status == true) {
        initialize();
        if (passedId != null) {
          setOpenModal(false);
          setOpenPrompt(true);
          setErrorPrompt(false);
          setPromptTitle("Success");
          setNotifMessage(response.message);
        }
        fetchAll();
      } else {
        if (passedId != null) {
          setOpenPrompt(true);
          setErrorPrompt(true);
          setPromptTitle("Fail");
          setNotifMessage(response.message);
        }
        initialize();
      }
    });
  };

  const [vulnerableHouseholds, setVulnerableHouseholds] = useState([]);
  const [openVulnerableModal, setOpenVulnerableModal] = useState(false);

  const handleViewMore = (x) => {
    let tempHouseholds = [];

    if (x.key == "pregnant") {
      getPregnant((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });

            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    } else if (x.key == "disabled") {
      getDisabled((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });
            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    } else if (x.key == "comorbid") {
      getComorbid((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });

            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    } else if (x.key == "children") {
      getChildren((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });

            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    } else if (x.key == "toddler") {
      getToddler((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });

            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    } else if (x.key == "senior") {
      getSenior((response) => {
        if (response.status) {
          response.data.map((household) => {
            let tempMembers = [];

            household.members.map((member) => {
              tempMembers.push({
                ...member,
                disabled: member.disability != null ? true : false,
                comorbid: member.comorbidity != null ? true : false,
              });
            });

            tempHouseholds.push({
              ...household,
              count: household.members.length,
              disabled: household.disability != null ? true : false,
              comorbid: household.comorbidity != null ? true : false,
              members: tempMembers,
            });
          });
          setVulnerableHouseholds(tempHouseholds);
        }
      });
    }
    setOpenVulnerableModal(true);
  };

  const handleCloseVulnerable = () => {
    setOpenVulnerableModal(false);
    setVulnerableHouseholds([]);
  };

  const handleViewHousehold = (response) => {
    setAction("view");

    setHouseholdHead(response);
    setHouseholdMembers(response.members);
    setOpenModal(true);
  };

  return (
    <Container>
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        title={promptTitle}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        confirmation={confirmation}
        callback={(response) => {
          if (response == true) {
            if (action == "delete") {
              handleDelete();
            }
          } else if (response == false) {
            // setDeleteID(null)
          }
        }}
      />

      <Grid container spacing={4} sx={{ mt: 2, padding: "2%" }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Vulnerable Household</Typography>
            </Grid>

            {vulnerables.map((x) => (
              <Grid item xs={4}>
                <Card sx={{ minWidth: "100%" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {x.title}
                    </Typography>
                    <Typography variant="h5" component="div"></Typography>
                    <Typography variant="body2">
                      No. of households with {x.label}: {x.count}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        handleViewMore(x);
                      }}
                    >
                      View details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 1, mb: 6, padding: "2%" }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Household Summary</Typography>
            </Grid>
            <Grid item xs={12}>
              <FabMuiTable
                data={{
                  columns: columns,
                  rows: householdData,
                }}
                onEdit={handleEdit}
                onDelete={confirmDelete}
                // buttons="update-delete"
                options={options}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 2, mb: 6, padding: "2%" }}>
          <Grid item xs={12} sm={12} md={12} lg={7}>
            <Button
              variant="contained"
              style={{
                float: "right",
                mx: 1,
                backgroundColor: "#ffd400",
                color: "black",
              }}
              onClick={(e) => {
                setAction("add");
                setOpenModal(true);
              }}
            >
              Add Household
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={openVulnerableModal}
        onClose={handleCloseVulnerable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Vulnerable household details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            List of households with vulnerable members
          </DialogContentText>
          <FabMuiTable
            data={{
              columns: columns,
              rows: vulnerableHouseholds,
            }}
            onView={handleViewHousehold}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVulnerable} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        fullScreen={false}
        maxWidth="xs"
        open={openModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {action == "add" ? "Add New " : action == "edit" ? "Edit " : "View "}
          Household
        </DialogTitle>
        <DialogContent style={{ paddingTop: 10 }}>
          <TextField
            disabled={action == "view"}
            id="filled-helperText"
            label="Household ID"
            required
            placeholder="####"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            value={householdHead.household_id}
            onChange={(e) => {
              setHouseholdHead({
                ...householdHead,
                household_id: e.target.value,
              });
            }}
          />
          <TextField
            disabled={action == "view"}
            id="filled-helperText"
            label="Household Head Name"
            placeholder="Ex. Juan Dela Cruz"
            required
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            value={householdHead.household_head}
            onChange={(e) => {
              setHouseholdHead({
                ...householdHead,
                household_head: e.target.value,
              });
            }}
          />
          <Box flexDirection={"row"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={action == "view"}
                label="Birthdate"
                value={householdHead.birthdate}
                onChange={(e) => {
                  setHouseholdHead({
                    ...householdHead,
                    birthdate: moment(new Date(e)).format("YYYY-MM-DD"),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    disabled={action == "view"}
                    style={{
                      width: "49.2%",
                      paddingBottom: 10,
                      marginRight: "1.6%",
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>

            <FormControl
              fullWidth
              style={{ width: "49.2%", paddingBottom: 10 }}
            >
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                disabled={action == "view"}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender"
                value={householdHead.gender}
                onChange={(e) => {
                  setHouseholdHead({
                    ...householdHead,
                    gender: e.target.value,
                  });
                }}
              >
                <MenuItem value={"F"}>Female</MenuItem>
                <MenuItem value={"M"}>Male</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {householdHead.gender == "F" && (
            <FormControlLabel
              control={
                <Checkbox
                  disabled={action == "view"}
                  checked={householdHead.pregnant}
                  onChange={(e) => {
                    setHouseholdHead({
                      ...householdHead,
                      pregnant: e.target.checked,
                    });
                  }}
                />
              }
              label="Pregnant"
              style={{ width: "100%" }}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                disabled={action == "view"}
                checked={householdHead.disabled}
                onChange={(e) => {
                  setHouseholdHead({
                    ...householdHead,
                    disabled: e.target.checked,
                  });
                }}
              />
            }
            label="Disabled"
            style={{ width: "100%" }}
          />
          {householdHead.disabled && (
            <TextField
              disabled={action == "view"}
              id="filled-helperText"
              label="Disability"
              helperText="Specify the disability"
              placeholder="Disability"
              variant="outlined"
              style={{ width: "100%", paddingBottom: 10 }}
              value={householdHead.disability}
              onChange={(e) => {
                setHouseholdHead({
                  ...householdHead,
                  disability: e.target.value,
                });
              }}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                disabled={action == "view"}
                checked={householdHead.comorbid}
                onChange={(e) => {
                  setHouseholdHead({
                    ...householdHead,
                    comorbid: e.target.checked,
                  });
                }}
              />
            }
            label="With Comorbidity"
            style={{ width: "100%" }}
          />
          {householdHead.comorbid && (
            <TextField
              disabled={action == "view"}
              id="filled-helperText"
              label="Comorbidity"
              helperText="Specify the comorbidity"
              placeholder="Comorbidity"
              variant="outlined"
              style={{ width: "100%", paddingBottom: 10 }}
              value={householdHead.comorbidity}
              onChange={(e) => {
                setHouseholdHead({
                  ...householdHead,
                  comorbidity: e.target.value,
                });
              }}
            />
          )}

          {householdMembers.length > 0 &&
            householdMembers.map((item, index) => (
              <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                {action != "view" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      let temp = [...householdMembers];
                      temp.splice(index, 1);
                      setHouseholdMembers(temp);
                    }}
                  >
                    Remove
                  </Button>
                )}
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", paddingTop: 10 }}
                >
                  Household Member # {index + 1}
                </Typography>
                <TextField
                  disabled={action == "view"}
                  id="filled-helperText"
                  label="Household Member Name"
                  placeholder="Ex. Juan Dela Cruz"
                  variant="outlined"
                  style={{ width: "100%", paddingBottom: 10 }}
                  value={householdMembers[index].household_member}
                  onChange={(e) => {
                    let temp = [...householdMembers];
                    temp[index].household_member = e.target.value;
                    setHouseholdMembers(temp);
                  }}
                />
                <Box flexDirection={"row"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={action == "view"}
                      label="Birthdate"
                      value={householdMembers[index].birthdate}
                      onChange={(e) => {
                        let temp = [...householdMembers];
                        temp[index].birthdate = moment(new Date(e)).format(
                          "YYYY-MM-DD"
                        );
                        setHouseholdMembers(temp);
                      }}
                      renderInput={(params) => (
                        <TextField
                          disabled={action == "view"}
                          style={{
                            width: "49.2%",
                            paddingBottom: 10,
                            marginRight: "1.6%",
                          }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <FormControl
                    fullWidth
                    style={{ width: "49.2%", paddingBottom: 10 }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      disabled={action == "view"}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Gender"
                      value={householdMembers[index].gender}
                      onChange={(e) => {
                        let temp = [...householdMembers];
                        temp[index].gender = e.target.value;
                        setHouseholdMembers(temp);
                      }}
                    >
                      <MenuItem value={"F"}>Female</MenuItem>
                      <MenuItem value={"M"}>Male</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {householdMembers[index].gender == "F" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={action == "view"}
                        checked={householdMembers[index].pregnant}
                        onChange={(e) => {
                          let temp = [...householdMembers];
                          temp[index].pregnant = e.target.checked;
                          setHouseholdMembers(temp);
                        }}
                      />
                    }
                    label="Pregnant"
                    style={{ width: "100%" }}
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={action == "view"}
                      checked={householdMembers[index].disabled}
                      onChange={(e) => {
                        let temp = [...householdMembers];
                        temp[index].disabled = e.target.checked;
                        setHouseholdMembers(temp);
                      }}
                    />
                  }
                  label="Disabled"
                  style={{ width: "100%" }}
                />
                {householdMembers[index].disabled && (
                  <TextField
                    disabled={action == "view"}
                    id="filled-helperText"
                    label="Disability"
                    helperText="Specify the disability"
                    placeholder="Disability"
                    variant="outlined"
                    style={{ width: "100%", paddingBottom: 10 }}
                    value={householdMembers[index].disability}
                    onChange={(e) => {
                      let temp = [...householdMembers];
                      temp[index].disability = e.target.value;
                      setHouseholdMembers(temp);
                    }}
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={action == "view"}
                      checked={householdMembers[index].comorbid}
                      onChange={(e) => {
                        let temp = [...householdMembers];
                        temp[index].comorbid = e.target.checked;
                        setHouseholdMembers(temp);
                      }}
                    />
                  }
                  label="With Comorbidity"
                  style={{ width: "100%" }}
                />
                {householdMembers[index].comorbid && (
                  <TextField
                    disabled={action == "view"}
                    id="filled-helperText"
                    label="Comorbidity"
                    helperText="Specify the comorbidity"
                    placeholder="Comorbidity"
                    variant="outlined"
                    style={{ width: "100%", paddingBottom: 10 }}
                    value={householdMembers[index].comorbidity}
                    onChange={(e) => {
                      let temp = [...householdMembers];
                      temp[index].comorbidity = e.target.value;
                      setHouseholdMembers(temp);
                    }}
                  />
                )}
              </div>
            ))}
          {action != "view" && (
            <Button
              variant="contained"
              onClick={(e) => {
                handleAddMember();
              }}
            >
              Add Member
            </Button>
          )}
        </DialogContent>
        {action != "view" ? (
          <DialogActions>
            <Button
              variant="text"
              color="error"
              onClick={(e) => {
                initialize();
                setOpenModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={(e) => {
                handleSubmit();
              }}
            >
              {action == "add" ? "Add Household" : "Save Changes"}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button
              variant="text"
              onClick={(e) => {
                initialize();
                setOpenModal(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default CaV;
