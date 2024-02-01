import { API_URL } from "../config";
import axios from "axios";
import { CBEWSL_SITE, CBEWSL_SITE_CODE } from "../host";

export const getTableSurficial = (data, callback) => {
  axios
    .get(
      `${API_URL}/api/surficial/tabled_marker_observations/${CBEWSL_SITE_CODE}/${data.startDate}/${data.endDate}`
    )
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};

export const getSurficialData = (data, callback) => {
  axios
    .get(
      `${API_URL}/api/surficial/get_surficial_plot_data/${CBEWSL_SITE}/${data.startDate}/${data.endDate}`
    )
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};

export const sendMeasurement = (data, callback) => {
  axios
    .post(`${API_URL}/api/surficial/insert_web`, data)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};

export const deletePrevMeasurement = (data, callback) => {
  axios
    .post(`${API_URL}/api/surficial/delete_prev_measurement`, { mo_id: data })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};

export const getStaffs = (callback) => {
  axios
    .get(`${API_URL}/api/misc/get_all_staff_users`)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};
