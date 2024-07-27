import axios from "axios";
import https from "https";
import fs from "fs";

// Load the self-signed certificate
const certFile = fs.readFileSync("path_to_your_certificate.crt");
const keyFile = fs.readFileSync("path_to_your_private_key.key");
const caFile = fs.readFileSync("path_to_your_ca_bundle.pem");

// Create an HTTPS agent with the certificate
const httpsAgent = new https.Agent({
  ca: caFile,
  cert: certFile,
  key: keyFile
});

// Create an axios instance with the custom HTTPS agent
const axiosInstance = axios.create({
  httpsAgent
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null
  });
};
