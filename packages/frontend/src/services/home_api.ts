import axios from "axios";

const url = "http://localhost:8000/admin/get_total_users";
const urlJobs = "http://localhost:8000/admin/get_total_jobs";

export const getTotalUsers = async () => {
  const response = await axios.get(url);
  return response.data;
};

export const getTotalJobs = async () => {
  const response = await axios.get(urlJobs);
  return response.data;
};
