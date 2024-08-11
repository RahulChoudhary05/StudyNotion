import axios from "axios";
const BASE_URL = "http://localhost:4000/api/v1";

// Create an Axios instance with custom configuration
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Function to connect with the API
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
