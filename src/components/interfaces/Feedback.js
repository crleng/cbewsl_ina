import React, {Fragment, useState, useEffect} from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { saveFeedback } from '../../apis/Misc';
import Swal from 'sweetalert2'

function Feedback() {
  const [concern, setConcern] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [sendButtonState, setSendButtonState] = useState(true);
 

  const resetValues = () => {
    setConcern('');
    setSelectedImage('');
  };

  const handleSend = () => {

    const feedbackData ={
      id: 0,
      file_path: selectedImage,
      description: concern,
    };

    saveFeedback(feedbackData, data => {
      const {status, message} = data;
      if (status === true) {
        resetValues();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: message
      })
      }
    });
  };


  useEffect(() => {
    if (selectedImage) {
      const file = URL.createObjectURL(selectedImage);
      setImageUrl(file);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (concern === '') {
      setSendButtonState(true);
    } else {
      setSendButtonState(false);
    }
    return;
  }, [sendButtonState, concern]);

  return (
    <Grid container sx={{padding: 8}}>
      <Grid item xs={12}>
        <Box elevato="true">
          <Typography variant="h4" sx={{marginBottom: 4}}>
            Feedback / Bug Report
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{minWidth: 275}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-static"
                  label="Please describe/elaborate concern"
                  multiline
                  rows={10}
                  required
                  placeholder="E.g. Dashboard not working"
                  variant="outlined"
                  style={{width: '100%'}}
                  value={concern}
                  onChange={e => setConcern(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                {imageUrl && selectedImage && (
                  <div>
                    <Grid container sx={{marginBottom: 5}}>
                      <Grid item xs={11}>Attached Image:</Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Remove attached image">
                          <IconButton
                            onClick={event =>
                              setSelectedImage(null)
                            }
                          >
                            <CloseIcon/>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Box mt={2} textAlign="center">
                      <img
                        src={imageUrl}
                        alt={selectedImage.name}
                        height="auto"
                        width="30%"
                      />
                    </Box>
                  </div>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{justifyContent: 'flex-end'}}>
            <input
              accept="image/*"
              type="file"
              id="select-image"
              style={{display: 'none'}}
              onChange={e => setSelectedImage(e.target.files[0])}
            />
            <label htmlFor="select-image">
              <Button
                variant="outlined"
                size='small'
                component="span"
                sx={{marginRight: 2}}
                endIcon={<AddPhotoAlternateIcon />}>
                Attach Image
              </Button>
            </label>
            <Button
              size="small"
              variant="contained"
              sx={{backgroundColor: "#ffd400", color: "black"}}
              onClick={() => handleSend()}
              disabled={sendButtonState}>
              Submit Feedback
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Feedback;