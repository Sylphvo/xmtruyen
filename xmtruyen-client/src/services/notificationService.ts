import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axios from "axios";

const API_URL = "http://localhost:5172/api/notification";
const HUB_URL = "http://localhost:5172/hubs/notification";

let connection: HubConnection | null = null;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const startSignalRConnection = async (onNotificationReceived: (notif: any) => void) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      onNotificationReceived(notification);
    });

    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};

export const getMyNotifications = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${API_URL}/my?page=${page}&pageSize=${pageSize}`, getAuthHeaders());
  return response.data;
};

export const markAsRead = async (id: string) => {
  const response = await axios.patch(`${API_URL}/${id}/read`, {}, getAuthHeaders());
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axios.patch(`${API_URL}/read-all`, {}, getAuthHeaders());
  return response.data;
};
