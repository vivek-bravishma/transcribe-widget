import { io } from 'socket.io-client';
import CONFIG from './config';

const URL = CONFIG.SOCKET_URL;
// process.env.NODE_ENV === "production" ? undefined : CONFIG.SOCKET_URL;

export const socket = io(URL, {
    // autoConnect: false,
    // query:{userId}
});
