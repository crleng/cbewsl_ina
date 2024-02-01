import React, { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { Link } from "@material-ui/core";
import UserProfileModal from "../marirong/modals/UserProfileModal";
import PromptModal from "../marirong/modals/PromptModal";
import { signIn, forgotPassword, verifyOTP } from "../../apis/UserManagement";
import { getNumberOfFiles } from "../../apis/Misc";

import phivolcs_seal from "../../assets/phivolcs_seal.png";
import dynaslope_seal from "../../assets/dynaslope_seal.png";
import province_seal from "../../assets/benguet_province_seal.png";
import municipality_seal from "../../assets/bakun_municipal_seal.png";
import barangay_seal from "../../assets/bakun_barangay_seal.png";
import lewc_seal from "../../assets/bak_lewc_seal.png";

import { CBEWSL_SITE_NAME } from "../../host";

const Signin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [inputOTPModal, setInputOTPModal] = useState(false);
  const [createAccountModal, setCreateAccountModal] = useState(false);

  const [openPrompt, setOpenPrompt] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatched, setPasswordMatched] = useState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [indicator, setIndicator] = useState("");
  const [otp, setOTP] = useState("");

  const [fileCount, setFileCount] = useState();

  useEffect(() => {
    checkMatch();
    numOfFiles();
  }, [newPassword, confirmPassword]);

  const numOfFiles = () => {
    getNumberOfFiles("assets", (data) => {
      setFileCount(data.length);
    });
  };

  useEffect(() => {});

  const checkMatch = () => {
    if (confirmPassword != "") {
      if (newPassword == confirmPassword) setPasswordMatched(true);
      else setPasswordMatched(false);
    } else setPasswordMatched(true);
  };

  const handleLogin = () => {
    let submitData = {
      username: username,
      password: password,
    };

    if (username != "" && password != "") {
      signIn(submitData, (response) => {
        if (response.status == true) {
          let temp = { ...response.data };
          temp["img_length"] = fileCount;
          localStorage.setItem("credentials", JSON.stringify(temp));
          window.location = `${CBEWSL_SITE_NAME}/opcen`;
        } else {
          setOpenPrompt(true);
          setErrorPrompt(true);
          setNotifMessage(response.message);
        }
      });
    } else {
      setOpenPrompt(true);
      setErrorPrompt(true);
      setNotifMessage("Username / Password not found.");
    }
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        fullScreen={false}
        maxWidth="xs"
        open={openModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-helperText"
            placeholder="E.g. JuanDelacruz"
            helperText={
              <Typography variant="caption" display="block">
                Username or Mobile Number
              </Typography>
            }
            variant="outlined"
            style={{ width: "100%" }}
            onChange={(e) => {
              setIndicator(e.target.value);
            }}
            sx={{ backgroundImage: "images/cover.jpeg" }}
            height="385px"
          />

          <Link
            component="button"
            onClick={(e) => {
              setOpenModal(false);
              setInputOTPModal(true);
            }}
            style={{ width: "100%", fontSize: 15 }}
          >
            Already have an OTP? Click here.
          </Link>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={(e) => {
              forgotPassword({ indicator: indicator }, (response) => {
                if (response.status == true) {
                  setOpenPrompt(true);
                  setErrorPrompt(false);
                  setPromptTitle(response.title);
                  setNotifMessage(response.message);
                  setOpenModal(false);
                } else {
                  setOpenPrompt(true);
                  setErrorPrompt(true);
                  setPromptTitle(response.title);
                  setNotifMessage(response.message);
                }
              });
            }}
          >
            Request OTP
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              setOpenModal(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        fullScreen={false}
        maxWidth="xs"
        open={inputOTPModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Password</DialogTitle>
        <DialogContent style={{ paddingTop: 10 }}>
          <TextField
            id="filled-helperText"
            label="OTP"
            placeholder="XXXX"
            helperText="Ask developers for your OTP"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
          />

          <TextField
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="New Password"
            variant="outlined"
            style={{ width: "100%", paddingBottom: 10 }}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />

          <TextField
            error={passwordMatched ? false : true}
            helperText={passwordMatched ? " " : "Password does not match"}
            id="outlined-required"
            placeholder="XXXX"
            type="password"
            label="Confirm Password"
            variant="outlined"
            style={{ width: "100%" }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={passwordMatched && confirmPassword != "" ? false : true}
            onClick={(e) => {
              verifyOTP({ password: newPassword, otp: otp }, (response) => {
                if (response.status == true) {
                  setOpenPrompt(true);
                  setErrorPrompt(false);
                  setPromptTitle(response.title);
                  setNotifMessage(response.message);
                  setInputOTPModal(false);
                } else {
                  setOpenPrompt(true);
                  setErrorPrompt(true);
                  setPromptTitle(response.title);
                  setNotifMessage(response.message);
                }
              });
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              setInputOTPModal(false);
              setOpenModal(true);
            }}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <UserProfileModal
        isOpen={createAccountModal}
        setIsOpen={setCreateAccountModal}
      />

      <PromptModal
        isOpen={openPrompt}
        error={errorPrompt}
        setOpenModal={setOpenPrompt}
        notifMessage={notifMessage}
        title={promptTitle}
      />

      <Fragment>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            style={{ paddingTop: "8%", marginBottom: "3%" }}
          >
            <div
              style={{
                textAlign: "center",
                height: "auto",
                width: "auto",
              }}
            >
              <img
                src={phivolcs_seal}
                alt="phivolcs-seal-png"
                style={{
                  objectFit: "contain",
                  height: 140,
                  width: 190,
                  marginRight: 20,
                }}
              />
              <img
                src={dynaslope_seal}
                alt="dynaslope-seal-png"
                style={{
                  objectFit: "contain",
                  height: 140,
                  width: 140,
                  marginRight: 20,
                }}
              />
              <img
                src={province_seal}
                alt="province-seal-png"
                style={{
                  objectFit: "contain",
                  height: 155,
                  width: 155,
                  marginRight: 20,
                }}
              />
              <img
                src={municipality_seal}
                alt="municipality-seal-png"
                style={{
                  objectFit: "contain",
                  height: 150,
                  width: 150,
                  marginRight: 20,
                }}
              />
              <img
                src={barangay_seal}
                alt="barangay-seal-png"
                style={{
                  objectFit: "contain",
                  height: 155,
                  width: 155,
                  marginRight: 20,
                }}
              />
              <img
                src={lewc_seal}
                alt="lewc-seal-png"
                style={{
                  objectFit: "contain",
                  height: 150,
                  width: 150,
                  marginRight: 20,
                }}
              />
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            elevation={6}
            alignContents="center"
          >
            <Typography
              variant="h2"
              align="center"
              color="grey.700"
              fontWeight="fontWeightBold"
              sx={{
                backgroundColor: "#f89422",
                backgroundSize: "100%",
                backgroundRepeat: "repeat",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Community Based Early Warning System for Landslides
            </Typography>

            <Typography
              variant="h4"
              align="center"
              color="grey.700"
              fontWeight="fontWeightBold"
              sx={{
                backgroundColor: "#16526D",
                backgroundSize: "100%",
                backgroundRepeat: "repeat",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 5,
              }}
            >
              Brgy. Poblacion, Bakun, Benguet
            </Typography>

            <Grid container spacing={4} textAlign="center">
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="filled-helperText"
                  placeholder="E.g. JuanDelacruz"
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  helperText={
                    <Typography
                      variant="caption"
                      display="block"
                      style={{ textAlign: "center" }}
                    >
                      Username
                    </Typography>
                  }
                  variant="standard"
                  style={{ width: "25%" }}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  onKeyPress={(event) => {
                    if (event.code === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="filled-helperText"
                  placeholder="**************"
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  type="password"
                  helperText={
                    <Typography
                      variant="caption"
                      display="block"
                      style={{ textAlign: "center" }}
                    >
                      Password
                    </Typography>
                  }
                  variant="standard"
                  style={{ width: "25%" }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyPress={(event) => {
                    if (event.code === "Enter") {
                      if (event.code === "Enter") {
                        handleLogin();
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Grid style={{ marginBottom: 10 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleLogin();
                    }}
                    style={{ backgroundColor: "#FFC000", color: "black" }}
                  >
                    Sign in
                  </Button>
                </Grid>
                <Grid>
                  <Link
                    component="button"
                    style={{ fontStyle: "italic", fontSize: 16 }}
                    onClick={(e) => {
                      setOpenModal(true);
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    setCreateAccountModal(true);
                  }}
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  No account yet? Register here!
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    </Fragment>
  );
};

export default Signin;
