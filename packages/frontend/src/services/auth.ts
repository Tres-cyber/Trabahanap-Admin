import axios from "axios";

const url = "http://localhost:8000/admin/login";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    url,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
