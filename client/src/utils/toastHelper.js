// src/utils/toastHelper.js
import { toast } from "react-toastify";

export const showToast = (type, message) => {
  const enabled = localStorage.getItem("toastEnabled");
  if (enabled === "false") return; // If user disabled toasts, don't show

  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else toast.info(message);
};
