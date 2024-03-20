import React, { Fragment } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Checkbox,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Divider,
  IconButton,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ListIcon from '@mui/icons-material/List';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  getFilesFromFolder,
  uploadResources,
  deleteFile,
} from "../../apis/Misc";
// import { STORAGE_URL } from "../../config";
import axios from "axios";
import fileDownload from "js-file-download";
import Swal from "sweetalert2";
const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;

const Resources = () => {

  const FOLDER_LIST = ['advisories', 'communications', 'iec materials', 'plans', 'reports', 'resource capabilities', 'risk assessments', 'other', 'Manifestation of Movements Images'];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [directory, setDirectory] = React.useState([]);
  const [isList, setList] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState("");

  const handleOpenFolder = (folder) => {
      setSelectedFolder(folder);
      getFilesFromFolder(folder, (response) => {
          setFiles(response)
      });
  }

  const handleDownload = (folder, filename) => {
      console.log(`${STORAGE_URL}/storage/${folder}/${filename}`)

      const link = document.createElement('a');
      link.href = `${STORAGE_URL}/storage/${folder}/${filename}`;
      link.target = "_blank"
      link.rel = "noreferrer"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

  }

  const handleDelete = (folder, filename) => {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {

              deleteFile(folder, filename, (response) => {
                  Swal.fire(
                      'Deleted!',
                      'Your file has been deleted.',
                      'success'
                    )
                  getFilesFromFolder(folder, (response) => {
                      setFiles(response)
                  });
              });
          }
        })
  }

  const handleUpload = (uploadImage) => {
      const formData = new FormData();
      formData.append('file', uploadImage);
      formData.append('folder', selectedFolder);

      uploadResources(formData, data => {
          const { status, message } = data;
          if (status) {
              getFilesFromFolder(selectedFolder, (response) => {
                  setFiles(response)
              });
          } else {
              console.log("Error upload", message)
          }
      })
  }

  const getFilePreview = (data) => {
      const { extension, filename } = data;
      const fileUrl = `${STORAGE_URL}/storage/${data.folder}/${filename}${extension}`;

      if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension.toLowerCase())) {
          return <img src={fileUrl} alt={filename} style={{ width: "100%", height: "100%" }} />;
      } else {
          return <InsertDriveFileIcon style={{ width: 345, height: 190 }} />;
      }
  };

  return (
      <Grid item xs={12} sx={{ padding: 8 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box>
                  <Typography variant="h4" sx={{ marginBottom: 4, textAlign: directory.length == 0 ? 'left' : 'right' }}>
                      {
                          directory.length == 0 ? "Resources" : "RESOURCES: " + directory.map((path) => (
                              `/${path}`
                          ))
                      }
                      {
                          directory.length != 0 &&
                          <IconButton onClick={() => {
                              setList(!isList);
                          }} arial-label="edit" component="span">
                              {isList ?
                              <ViewModuleIcon style={{ height: 50, width: 50 }} /> :
                              <ListIcon style={{ height: 50, width: 50 }} /> }
                          </IconButton>
                      }
                  </Typography>
                  <input
                      accept="image/*, .pdf, .doc"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      type="file"
                      onChange={e => {
                          handleUpload(e.target.files[0]);
                      }}
                  />

                  <label htmlFor="raised-button-file">
                      { directory.length != 0 &&
                      <Button variant="contained"
                          component="span"
                          sx={{ float: 'right', mx: 1, backgroundColor: "#FFC300", color: "black" }}
                      >
                          Upload File
                      </Button>
                      }
                  </label>
                  {
                      directory.length != 0 &&
                      <IconButton onClick={() => {
                          let temp = [...directory];
                          temp.pop()
                          setDirectory(temp);
                      }} arial-label="edit" component="span">
                          <ArrowBackIcon style={{ height: 50, width: 50 }} />
                      </IconButton>
                  }
              </Box>
          </Grid>
          {
              directory.length == 0 ?
                  <Grid item xs={12}>
                      <Grid container align="center">
                          <Grid item xs={3} md={3} lg={3}>
                              <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("ADVISORIES")
                                          setDirectory(temp);
                                          handleOpenFolder("advisories");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>ADVISORIES</Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("PLANS")
                                          setDirectory(temp);
                                          handleOpenFolder("plans");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>PLANS</Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("OTHERS")
                                          setDirectory(temp);
                                          handleOpenFolder("others");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>OTHERS</Typography>
                                  </Grid>
                              </Grid>
                          </Grid>
                          <Grid item xs={3} md={3} lg={3}>
                              <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("COMMUNICATIONS")
                                          setDirectory(temp);
                                          handleOpenFolder("communications");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>COMMUNICATIONS</Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("REPORTS")
                                          setDirectory(temp);
                                          handleOpenFolder("reports");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>REPORTS</Typography>
                                  </Grid>
                              </Grid>
                          </Grid>
                          <Grid item xs={3} md={3} lg={3}>
                              <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("IEC MATERIALS")
                                          setDirectory(temp);
                                          handleOpenFolder("iec_materials");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>IEC MATERIALS</Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("RESOURCE CAPABILITIES")
                                          setDirectory(temp);
                                          handleOpenFolder("resource_and_capabilities");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>RESOURCE CAPABILITIES</Typography>
                                  </Grid>                                    
                              </Grid>
                          </Grid>
                          <Grid item xs={3} md={3} lg={3}>
                              <Grid container spacing={2}>                                    
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("MANIFESTATION OF MOVEMENTS IMAGES")
                                          setDirectory(temp);
                                          handleOpenFolder("moms_images");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>MANIFESTATION OF MOVEMENTS IMAGES</Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                      <IconButton onClick={() => {
                                          let temp = [...directory];
                                          temp.push("RISK ASSESSMENTS")
                                          setDirectory(temp);
                                          handleOpenFolder("risk_assessments");
                                      }} arial-label="edit" component="span">
                                          <FolderIcon style={{ height: 150, width: 150 }} />
                                      </IconButton>
                                      <Typography style={{ fontWeight: 'bold' }}>RISK ASSESSMENTS</Typography>
                                  </Grid>
                              </Grid>
                          </Grid>
                      </Grid>
                  </Grid>
                  :
                  <Grid container spacing={2}>
                      {
                          isList == false ?
                              files.map((data, index) => (
                                  <Grid item xs={12} sm= {12} md={6} lg={3} key={index}>
                                      <Card sx={{ height: 400, marginLeft: 10 }} variant="outlined">
                                          <CardMedia
                                              component="div"
                                              maxHeight= "20%"
                                              sx={{ overflow: 'hidden', height: 190, width: 345 }}
                                          >
                                          {getFilePreview(data)}
                                          </CardMedia>
                                          <CardContent sx={{ overflow: 'hidden', height: 135 }}>
                                              <Typography gutterBottom variant="h5" component="div">
                                                  {`${data.filename}`}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                  File type: {data.extension.toUpperCase()}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                  {Math.round((data.size + Number.EPSILON) * 100) / 100} MB
                                              </Typography>
                                          </CardContent>
                                          <CardActions>
                                              <Button size="small" onClick={() => { handleDownload(data.folder, `${data.filename}${data.extension}`) }}>View</Button>
                                              <Button size="small" onClick={() => { handleDelete(data.folder, `${data.filename}${data.extension}`) }}>Delete</Button>
                                          </CardActions>
                                      </Card>
                                  </Grid>
                              ))
                              :
                              <List style={{ width: '100%', padding: 50 }}>
                                  {
                                      files.map((data) => (
                                          <React.Fragment>
                                              <ListItem >
                                                  <ListItemButton>
                                                      <Grid container spacing={2}>
                                                          <Grid item xs={12} sm={12} md={12} lg={3}>
                                                              {getFilePreview(data)}
                                                          </Grid>
                                                          <Grid item xs={6} sm={6} md={4} lg={4}>
                                                              <Typography style={{ padding: 10 }}>File Name: {`${data.filename}`}</Typography>
                                                          </Grid>
                                                          <Grid item xs={6} sm={6} md={3} lg={3}>
                                                              <Typography style={{ padding: 10 }}>File Size: {Math.round((data.size + Number.EPSILON) * 100) / 100} MB</Typography>
                                                          </Grid>
                                                          <Grid item xs={6} sm={6} md={2} lg={1}>
                                                              <Button size="small" onClick={() => { handleDownload(data.folder, `${data.filename}${data.extension}`) }}><VisibilityIcon style={{ width: 40, height: 40, color: "black" }} /></Button>
                                                          </Grid>
                                                          <Grid item xs={6} sm={6} md={2} lg={1}>
                                                              <Button size="small" onClick={() => { handleDelete(data.folder, `${data.filename}${data.extension}`) }}><DeleteIcon style={{ width: 40, height: 40, color: "black" }} /></Button>
                                                          </Grid>
                                                      </Grid>
                                                  </ListItemButton>
                                              </ListItem>
                                              <Divider />
                                          </React.Fragment>
                                      ))
                                  }
                              </List>
                      }
                  </Grid>
          }
      </Grid>
  );
};

export default Resources;
