import { API_URL } from "../config";
import axios from "axios";
import { CBEWSL_SITE, CBEWSL_SITE_CODE } from "../host";

export const getLatestCandidatesAndAlerts = (callback) => {
  axios
    .get(`${API_URL}/api/monitoring/candidate_alerts`)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {});
};

export const validateAlert = (callback, state, data) => {
  axios
    .post(`${API_URL}/api/monitoring/update_alert_status`, data)
    .then((response) => {
      // callback(response.data);
      callback(state);
    })
    .catch((error) => {});
};

export const generateAlert = (data) => {
  axios
    .post(`${API_URL}/api/monitoring/insert_ewi`, data)
    .then((response) => {
      // callback(response.data);
    })
    .catch((error) => {});
};

export function getCandidateAlert(callback) {
  const api_link = `${API_URL}/api/monitoring/candidate_alerts/${CBEWSL_SITE_CODE}`;
  axios
    .get(api_link)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function updateAlertStatus(input, callback) {
  const api_link = `${API_URL}/api/monitoring/update_alert_status`;
  axios
    .post(api_link, input)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function releaseAlert(input, callback) {
  const api_link = `${API_URL}/api/monitoring/insert_ewi`;
  axios
    .post(api_link, input)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendMessage(input, callback) {
  const api_link = `${API_URL}/message/send_ewi`;
  axios
    .post(api_link, input)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getReleasedMessages(release_id, callback) {
  const api_link = `${API_URL}/api/monitoring/get_release_acknowledgement/${release_id}`;
  axios
    .get(api_link)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getTempMoms(callback) {
  const api_link = `${API_URL}/api/manifestations_of_movement/get_temp_moms`;
  axios
    .get(api_link)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function updateMoms(input, callback) {
  const api_link = `${API_URL}/api/manifestations_of_movement/write_monitoring_moms_to_db`;
  axios
    .post(api_link, input)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getContacts(callback) {
  const api_link = `${API_URL}/message/contacts`;
  axios
    .get(api_link)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function insertOnDemandToDb(on_demand_data, callback) {
  const api_link = `${API_URL}/api/monitoring/save_on_demand_data`;

  axios
    .post(api_link, on_demand_data)
    .then((response) => {
      const { data } = response;
      if (callback !== null) {
        callback(data);
      }
    })
    .catch((error) => {});
}

export function checkLatestSiteEventIfHasOnDemand(site_id, callback) {
  const api_link = `${API_URL}/api/monitoring/check_if_current_site_event_has_on_demand/${CBEWSL_SITE}`;
  axios
    .get(api_link)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getEarthquakeEventsForLast24hrs(json_data, callback) {
  const api_link = `${API_URL}/api/analysis/get_earthquake_events_within_one_day`;
  axios
    .post(api_link, json_data)
    .then((response) => {
      const { data } = response;
      if (callback !== null) {
        callback(data);
      }
    })
    .catch((error) => {});
}
