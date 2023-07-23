import React, { useEffect } from 'react';
import { socket } from '../socket';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from "react-router-dom";

export function ConnectionManager() {
  const { connect, disconnect } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    // connect with socket.io
    connect();

    // listen for socket.io events
    socket.on('change-page', (payload) => {
      navigate(`/${payload}`);
    })

    // cleanup
    return () => {
      socket.off('change-page');
      disconnect();
    }
  }, []);

  return (<div></div>);
}