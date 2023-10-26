require('dotenv').config();
let serverUrl;

if (typeof window === 'undefined') {
  serverUrl = process.env.SERVER_URL;
} else {
  serverUrl =
    location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://notes-app-endjoy.vercel.app';
}

export const SERVER_URL = serverUrl;
