import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  FormHelperText,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { signUp } from "../../../apis/UserManagement";
import PromptModal from "./PromptModal";
import Swal from "sweetalert2";
import { CBEWSL_SITE } from "../../../host";

function UserProfileModal(props) {
  const isOpen = props.isOpen;
  const setIsOpen = props.setIsOpen;

  const [openPrompt, setOpenPrompt] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [username, setUsername] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatched, setPasswordMatched] = useState();

  useEffect(() => {
    checkMatch();
  }, [newPassword, confirmPassword]);

  const checkMatch = () => {
    if (confirmPassword != "") {
      if (newPassword == confirmPassword) setPasswordMatched(true);
      else setPasswordMatched(false);
    } else setPasswordMatched(true);
  };

  const checkRequired = () => {
    if (
      firstName != "" &&
      lastName != "" &&
      gender != "" &&
      birthday != "" &&
      designation != "" &&
      mobileNo != "" &&
      username != ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    const mobile_num = mobileNo.toString();
    let updated_mobile_num = mobile_num.replace(/^./g, "63");
    let submitData = {
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      nickname: nickname,
      gender: gender,
      suffix: suffix,
      birthday: moment(new Date(birthday)).format("YYYY-MM-DD"),
      address: address,
      designation_id: designation,
      mobile_no: updated_mobile_num,
      password: newPassword,
      username: username,
      siteID: CBEWSL_SITE
    };

    let filled = checkRequired();

    if (filled) {
      signUp(submitData, (response) => {
        if (response.status == true) {
          setErrorPrompt(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Account successfully created",
          });
          setIsOpen(false);
        } else if (response.status == false) {
          setErrorPrompt(true);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.message,
          });
        }
      });
    } else {
      setErrorPrompt(true);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please fill all required fields",
      });
    }
  };

  return (
    <Fragment>
      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
      />
      <Dialog
        fullWidth
        fullScreen={false}
        open={isOpen}
        aria-labelledby="form-dialog-title"
        style={{ zIndex: 1059 }}
      >
        <DialogTitle id="form-dialog-title">Create Account</DialogTitle>
        <DialogContent style={{ paddingTop: 10 }}>
          <TextField
            error={errorPrompt && firstName == "" ? true : false}
            helperText={
              errorPrompt && firstName == "" ? "First Name required" : ""
            }
            id="outlined-required"
            placeholder="Ex: Juan"
            label="First Name (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />

          <TextField
            error={errorPrompt && lastName == "" ? true : false}
            helperText={
              errorPrompt && lastName == "" ? "Last Name required" : ""
            }
            id="outlined-required"
            placeholder="Ex: Dela Cruz"
            label="Last Name (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Castro"
            label="Middle Name"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setMiddleName(e.target.value);
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Jr."
            label="Suffix"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setSuffix(e.target.value);
            }}
          />

          <Box flexDirection={"row"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthday (required)"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e);
                }}
                renderInput={(params) => (
                  <TextField
                    style={{
                      width: "40%",
                      paddingBottom: 10,
                      marginRight: "2%",
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>

            <FormControl fullWidth style={{ width: "58%", paddingBottom: 10 }}>
              <InputLabel
                id="demo-simple-select-label-designation"
                style={{
                  color:
                    errorPrompt && gender == "" ? "#D84848" : "-moz-initial",
                }}
              >
                Gender (required)
              </InputLabel>
              <Select
                error={errorPrompt && gender == "" ? true : false}
                helperText={
                  errorPrompt && gender == "" ? "Gender required" : ""
                }
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender (required)"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              >
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Male"}>Male</MenuItem>
              </Select>
              {errorPrompt && gender == "" ? (
                <FormHelperText style={{ color: "#D84848" }}>
                  Gender required
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </Box>

          <TextField
            id="outlined-required"
            placeholder="Ex: Brgy. Marirong, Samar"
            label="Address"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="Ex: Juan"
            label="Nickname"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
          />

          <TextField
            error={errorPrompt && username == "" ? true : false}
            helperText={
              errorPrompt && username == "" ? "Username required" : ""
            }
            id="outlined-required"
            placeholder="Ex: DelaCruz1234"
            label="Username (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <TextField
            error={errorPrompt && mobileNo == "" ? true : false}
            helperText={
              errorPrompt && mobileNo == "" ? "Mobile Number required" : ""
            }
            id="outlined-required"
            placeholder="Ex: 09xxxxxxxxx"
            label="Mobile Number (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 11) {
                setMobileNo(e.target.value);
              }
            }}
            type="number"
            value={mobileNo}
          />

          <TextField
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="Password (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />

          <TextField
            error={passwordMatched ? false : true}
            helperText={passwordMatched ? "" : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="Confirm Password (required)"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <FormControl fullWidth style={{ width: "100%", paddingBottom: 10 }}>
            <InputLabel
              id="demo-simple-select-label-designation"
              style={{
                color:
                  errorPrompt && designation == "" ? "#D84848" : "-moz-initial",
              }}
            >
              Designation (required)
            </InputLabel>
            <Select
              error={errorPrompt && designation == "" ? true : false}
              labelId="demo-simple-select-label-designation"
              id="demo-simple-select-designation"
              label="Designation (required)"
              onChange={(e) => {
                setDesignation(e.target.value);
              }}
            >
              <MenuItem value={1}>LEWC</MenuItem>
              <MenuItem value={2}>BLGU</MenuItem>
              <MenuItem value={3}>MLGU</MenuItem>
              <MenuItem value={4}>PLGU</MenuItem>
              <MenuItem value={5}>Community</MenuItem>
            </Select>
            {errorPrompt && designation == "" ? (
              <FormHelperText style={{ color: "#D84848" }}>
                Designation required
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={passwordMatched && confirmPassword != "" ? false : true}
            color="primary"
            onClick={(e) => {
              handleSubmit();
            }}
          >
            Save Account
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default UserProfileModal;
