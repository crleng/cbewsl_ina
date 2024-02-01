import axios from "axios";
// import { host } from "../components/host";
import { API_URL } from "../config";
import { CBEWSL_SITE_CODE, CBEWSL_SITE } from "../host";

export function getSurficialPlotData(input, callback, is_end_of_shift = false) {
  const { site_code, start, end } = input;
  let api_link =
    `${API_URL}/api/surficial/get_surficial_plot_data/` +
    `${CBEWSL_SITE_CODE}/${start}/${end}`;

  if (is_end_of_shift) api_link += "?is_end_of_shift=true";

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

export function deleteSurficialData(input, callback) {
  const api_link = `${API_URL}/api/surficial/delete_surficial_data`;

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

export function updateSurficialData(input, callback) {
  const api_link = `${API_URL}/api/surficial/update_surficial_data`;

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

export function getSurficialMarkerTrendingData(input, callback) {
  const { site_code, marker_name, ts } = input;
  const api_link =
    `${API_URL}/api/surficial/get_surficial_marker_trending_data/` +
    `${site_code}/${marker_name}/${ts}`;

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

export function insertMarkerEvent(input, callback) {
  const api_link = `${API_URL}/api/surficial/insert_marker_event`;

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

export function getRainfallPlotData(input, callback) {
  const { site_code, ts_end, days_diff } = input;
  const api_link = `${API_URL}/api/rainfall/get_rainfall_plot_data/${CBEWSL_SITE_CODE}/${ts_end}/${days_diff}`;

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

export function getSubsurfacePlotData(input, callback) {
  const {
    subsurface_column,
    ts_end,
    ts_start,
    hour_value,
    include_comms_health,
  } = input;

  const api_link =
    `${API_URL}/api/subsurface/get_subsurface_plot_data/` +
    `${subsurface_column}/${ts_end}/${ts_start}/${hour_value}` +
    `?include_comms_health=${include_comms_health}`;

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

export function getSurfaceNodeHealth(input, callback) {
  const { subsurface_column } = input;
  const api_link = `${API_URL}/api/subsurface/get_subsurface_node_health/${subsurface_column}`;

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

export function getSubsurfaceNodeLevel(input, callback) {
  const { subsurface_column, ts_end, ts_start, node_id } = input;

  const api_link = `${API_URL}/api/subsurface/get_subsurface_node_level/${subsurface_column}/${ts_end}/${ts_start}/${node_id}`;

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

export function getEarthquakeEvents(callback) {
  const api_link = `${API_URL}/api/analysis/get_earthquake_events`;

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

export function insertEarthquakeEvent(input, callback) {
  const api_link = `${API_URL}/api/analysis/insert_earthquake_event`;
  axios
    .post(api_link, input)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getEarthquakeAlerts(request, callback) {
  const { limit, offset } = request;
  const api_link =
    `${API_URL}/api/analysis/get_earthquake_alerts` +
    `?limit=${limit}&offset=${offset}`;

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

export function getMOMsAlertSummary(callback) {
  const api_link = `${API_URL}/api/manifestations_of_movement/get_latest_alerts`;

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

export function getMOMsInstances(site_code, callback) {
  const api_link = `${API_URL}/api/manifestations_of_movement/get_moms_instances/${CBEWSL_SITE_CODE}`;

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

export function getSiteSubsurfaceColumns(site_code, callback) {
  const api_link = `${API_URL}/api/subsurface/get_site_subsurface_columns/${CBEWSL_SITE_CODE}`;

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

export function getOnDemandEvents(callback) {
  const api_link = `${API_URL}/api/analysis/get_on_demand_events`;

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

export function saveChartSVG(input, callback) {
  const api_link = `${API_URL}/api/analysis/save_chart_svg`;

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

export function saveInvalidRainfallTag(input, callback) {
  const api_link = `${API_URL}/api/rainfall/tag_invalid_data`;

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

export function getLoggersAndSensorsData(callback) {
  axios
    .get(`${API_URL}/api/sensor_deployment/get_loggers_data`)
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {});
}

export function saveLoggerDeployment(input, callback) {
  const api_link = `${API_URL}/api/sensor_deployment/save_logger_deployment`;
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

export function saveUnreliableMarkerData(input, callback) {
  const api_link = `${API_URL}/api/surficial/save_unreliable_marker_data`;

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

export function downloadMarkerHistoryTags(input, callback) {
  const api_link = `${API_URL}/api/surficial/get_marker_history_tags`;

  axios
    .get(api_link, { params: input, responseType: "blob" })
    .then((response) => {
      const { data } = response;
      callback(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function saveDataUpdate(input, callback) {
  const api_link = `${API_URL}/api/sensor_deployment/save_data_update`;
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

export function getMonitoringAnalyticsData(input, callback) {
  const api_link = `${API_URL}/api/monitoring/get_monitoring_analytics_data`;

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
