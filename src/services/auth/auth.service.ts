import { API } from "@/config";
import { RegisTerTypes } from "./type";

export const RegisterApi = async (data: RegisTerTypes) => {
  const response = await API.post("/register", data);
  return response?.data;
};
