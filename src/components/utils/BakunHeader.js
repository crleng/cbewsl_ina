import React, { Fragment, useState, useEffect } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  Tooltip,
  Avatar,
  Badge,
  Popover,
  Card,
  CardContent,
} from "@mui/material";
import DostSeal from "../../assets/phivolcs_seal.png";
import DynaslopeSealMini from "../../assets/dynaslope_seal_mini.png";
import benguet_provincial_seal from "../../assets/benguet_province_seal.png";
import bakun_municipal_seal from "../../assets/bakun_municipal_seal.png";
import bakun_brgy_seal from "../../assets/bakun_barangay_seal.png";
import bakun_lewc_seal from "../../assets/bak_lewc_seal.png";
import HazardMap from "../../assets/hazard_map.jpg";
import male_icon from "../../assets/male_icon.png";
import female_icon from "../../assets/female_icon.png";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { STORAGE_URL } from "../../config";
import { SignInLogo } from "./SignInLogo";

import { CBEWSL_SITE_NAME } from "../../host";

const BakunHeader = () => {
  let navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [server_time, setServerTime] = useState("");
  const [profileIcon, setProfileIcon] = useState(null);

  const [notifs, setNotifs] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [notifColor, setNotifColor] = useState(false);
  const [color, setColor] = useState("#0492C2");

  const handleOpenNotifs = () => {
    setOpenNotification(true);
    setNotifColor(true);
    if (notifColor === true) {
      setColor("white");
    }
  };

  const handleCloseNotifs = () => {
    setOpenNotification(false);
  };

  const handleReadNotifs = (notification_id) => {
    // readNotifications(notification_id, data => {
    //   const { status } = data;
    //   if (status === true) {
    //     getNotifications(currentUser, response => {
    //       setNotifs(response.data);
    //     });
    //   }
    // });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate(`${CBEWSL_SITE_NAME}/opcen`);
        break;
      case 1:
        event.preventDefault();
        break;
      case 2:
        event.preventDefault();
        break;
      case 3:
        event.preventDefault();
        break;
      case 4:
        navigate(`${CBEWSL_SITE_NAME}/events`);
        break;
      case 5:
        navigate(`${CBEWSL_SITE_NAME}/profile-settings`);
      default:
        // navigate(`${CBEWSL_SITE_NAME}/assessment`);
        break;
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("credentials");
    const parse_data = JSON.parse(data);
    const user_sex = parse_data.user.sex;

    if (user_sex === "Male") {
      setProfileIcon(male_icon);
    } else {
      setProfileIcon(female_icon);
    }
  }, []);

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  const [anchorElSettings, setAnchorElSettings] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElCRA, setAnchorElCRA] = React.useState(null);
  const [anchorElAnalysis, setAnchorElAnalysis] = React.useState(null);
  const [anchorElGroundData, setAnchorElGroundData] = React.useState(null);
  const open = Boolean(anchorEl);
  const openCRA = Boolean(anchorElCRA);
  const openAnalysis = Boolean(anchorElAnalysis);
  const openGroundData = Boolean(anchorElGroundData);
  const openSettings = Boolean(anchorElSettings);

  const preventDefault = (event) => {
    event.preventDefault();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCRA = (event) => {
    setAnchorElCRA(event.currentTarget);
  };

  const handleClickAnalysis = (event) => {
    setAnchorElAnalysis(event.currentTarget);
  };

  const handleClickGroundData = (event) => {
    setAnchorElGroundData(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElCRA(null);
    setAnchorElAnalysis(null);
    setAnchorElGroundData(null);
    setAnchorElSettings(null);
  };

  const handleCurrentTab = () => {
    const path_name = window.location.pathname;
    if (path_name === `/${CBEWSL_SITE_NAME}/opcen`) {
      setValue(0);
    } else if (
      // path_name === '/hazard_mapping' ||
      path_name === `/${CBEWSL_SITE_NAME}/cav`
    ) {
      setValue(1);
    } else if (
      path_name === `/${CBEWSL_SITE_NAME}/analysis` ||
      path_name === `/${CBEWSL_SITE_NAME}/rainfall` ||
      path_name === `/${CBEWSL_SITE_NAME}/surficial` ||
      path_name === `/${CBEWSL_SITE_NAME}/subsurface` ||
      path_name === `/${CBEWSL_SITE_NAME}/earthquake`
    ) {
      setValue(2);
    } else if (
      path_name === `/${CBEWSL_SITE_NAME}/surficial_markers` ||
      path_name === `/${CBEWSL_SITE_NAME}/moms`
    ) {
      setValue(3);
    } else if (path_name === `/${CBEWSL_SITE_NAME}/events`) {
      setValue(4);
    } else {
      setValue(5);
    }
  };

  const handleOpen = () => {
    window.open(HazardMap, "_blank");
  };

  useEffect(() => {
    handleCurrentTab();
  });

  useEffect(() => {
    setInterval(() => {
      let dt = moment().format("ddd DD-MMM-YYYY hh:mm:ss A");
      setServerTime(dt);
    }, 1000);
  }, []);

  return (
    <Fragment>
      <Grid container spacing={0} style={{ background: "white" }}>
        <Grid item xs={12} sm={4} md={4} lg={4} sx={{ marginTop: 1, marginBottom: 2 }}>
          <SignInLogo/>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div
            style={{
              textAlign: "left",
              height: "auto",
              width: "100%",
              marginTop: 30,
            }}
          >
            <Typography
              variant="h5"
              style={{ fontWeight: "600", color: "green" }}
            >
              COMMUNITY-BASED EARLY WARNING SYSTEM FOR LANDSLIDES
            </Typography>
            <Typography
              variant="h6"
              style={{ fontWeight: "300", color: "black" }}
            >
              Brgy. Poblacion, Bakun, Benguet
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2}>
          <div style={{ textAlign: "end" }}>
            <Tooltip title="Notification">
              <IconButton onClick={handleOpenNotifs} sx={{ p: 2, mt: 4 }}>
                <Badge
                  badgeContent={
                    notifs.filter((x) => x.is_read === false).length
                  }
                  color="error"
                >
                  <NotificationsNoneIcon
                    alt="Notification"
                    style={{ color: "#16526D" }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>
            <Popover
              open={openNotification}
              anchorEl={notifs}
              onClose={handleCloseNotifs}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {notifs.map((notif) => {
                const { notification_id, is_read } = notif;
                return (
                  is_read === false && (
                    <Card
                      sx={{
                        maxWidth: 400,
                        maxHeight: "auto",
                        borderBottom: 1,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ backgroundColor: color }}>
                        <div style={{ marginLeft: 350 }}>
                          <IconButton
                            onClick={(event) =>
                              handleReadNotifs(notification_id)
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                        <CardContent>{notif.message}</CardContent>
                        <div style={{ marginLeft: 250 }}>
                          <Typography fontSize={14} color="#636363">
                            {moment(notif.ts).format("YYYY-MM-DD hh:mm a")}
                          </Typography>
                        </div>
                      </div>
                    </Card>
                  )
                );
              })}
            </Popover>

            <Tooltip title="Open settings">
              <IconButton
                onClick={(e) => {
                  setAnchorElSettings(e.currentTarget);
                }}
                sx={{ p: 2, mt: 4 }}
              >
                <Avatar src={profileIcon} alt="Profile photo" />
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-settings"
              anchorEl={anchorElSettings}
              open={openSettings}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "button",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`${CBEWSL_SITE_NAME}/profile-settings`);
                  handleClose();
                }}
              >
                Profile Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(`${CBEWSL_SITE_NAME}/change-password`);
                  handleClose();
                }}
              >
                Change Password
              </MenuItem>
            </Menu>

            <IconButton
              id="button"
              aria-controls={open ? "menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ p: 2, mt: 4 }}
            >
              <MenuIcon alt="Menu" style={{ color: "#16526D" }} />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "button",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`${CBEWSL_SITE_NAME}/feedback`);
                  handleClose();
                }}
              >
                Feedback
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("credentials")(
                    (window.location = `/${CBEWSL_SITE_NAME}`)
                  );
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <AppBar position="static" color="inherit">
            <Grid container style={{ backgroundColor: "green" }}>
              <Grid item md={10}>
                <Toolbar style={{ justifyContent: "center" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{
                      style: { background: "white" },
                    }}
                    aria-label="basic tabs example"
                  >
                    <Tab
                      label={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          DASHBOARD
                        </span>
                      }
                      {...a11yProps(0)}
                    />
                    <Tab
                      label={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          COMMUNITY RISK ASSESSMENT
                        </span>
                      }
                      onClick={(e) => {
                        handleClickCRA(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          DATA ANALYSIS
                        </span>
                      }
                      onClick={(e) => {
                        handleClickAnalysis(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          GROUND DATA
                        </span>
                      }
                      onClick={(e) => {
                        handleClickGroundData(e);
                        preventDefault(e);
                      }}
                    />
                    <Tab
                      label={
                        <span style={{ color: "white", fontWeight: "bold" }}>
                          SCHEDULE
                        </span>
                      }
                      {...a11yProps(1)}
                    />
                    <Tab style={{ display: "none" }} {...a11yProps(2)} />
                  </Tabs>
                </Toolbar>
              </Grid>
              <Grid item md={2} style={{ alignSelf: "center" }}>
                <Typography variant="body1" style={{ color: "white" }}>
                  {server_time.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Menu
          id="menu"
          anchorEl={anchorElCRA}
          open={openCRA}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleOpen();
              handleClose();
            }}
          >
            Hazard Map
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/cav`);
              handleClose();
            }}
          >
            Household Data
          </MenuItem>
        </Menu>
      </Grid>
      <Grid item xs={12}>
        <Menu
          id="menu"
          anchorEl={anchorElAnalysis}
          open={openAnalysis}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "button",
          }}
        >
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/analysis`);
              handleClose();
            }}
          >
            Summary
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/rainfall`);
              handleClose();
            }}
          >
            Rainfall Plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/surficial`);
              handleClose();
            }}
          >
            Surficial Plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/subsurface`);
              handleClose();
            }}
          >
            Subsurface Plot
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/earthquake`);
              handleClose();
            }}
          >
            Earthquake Data
          </MenuItem>
        </Menu>
        <Menu
          id="menu"
          anchorEl={anchorElGroundData}
          open={openGroundData}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "button",
          }}
        >
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/surficial_markers`);
              handleClose();
            }}
          >
            Surficial Markers
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`${CBEWSL_SITE_NAME}/moms`);
              handleClose();
            }}
          >
            Manifestations of movement
          </MenuItem>
        </Menu>
      </Grid>
    </Fragment>
  );
};

export default BakunHeader;
