import { useEffect, useState } from 'react';
import axios from 'axios';

export function useSocketSetup(getToken, socket, BACKEND_URL) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!socket) return;
    
    async function initialize() {
      try {
        const token = await getToken();
        const { data: profile } = await axios.get(`${BACKEND_URL}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserId(profile.userId);

        // Join socket room
        socket.emit('joinUser', profile.userId);
      } catch (error) {
        console.error('Socket setup error:', error);
      }
    }
    initialize();
  }, [getToken, socket]);

  return userId;
}   
