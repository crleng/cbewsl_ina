import { Box, Grid } from "@mui/material";
import React, { Fragment } from "react";
import GeneratedBulletin from "./GeneratedBulletin";

const Bulletin = () => {
  return (
    <Fragment>
      <Grid container justifyContent="center" alignItems="flex-start">
         <Box
            sx={{
              marginTop: 5,
              marginBottom: 10,
              maxWidth: 800,
              height: "auto",
              border: "2px solid black",
            }}
          >
        <GeneratedBulletin/>
        </Box>
      </Grid>
    </Fragment>
   
  );
};

export default Bulletin;
