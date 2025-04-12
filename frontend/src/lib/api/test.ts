import config from "../config";

console.log("config", config);

export const callBackend = async () => {
  const res = await fetch(`${config.apiUrl}/`);
  return res.json();
};
