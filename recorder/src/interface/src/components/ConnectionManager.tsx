import React, { useEffect } from 'react';
import { socket } from '../socket';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from "react-router-dom";
// import * as mqtt from "mqtt";

export function ConnectionManager() {
  const { connect, disconnect } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    // connect with mqtt
    // const client = mqtt.connect('mqtt://localhost:1883');

    // // listen for mqtt events
    // client.on('connect', () => {
    //   console.log('connected to mqtt');
    //   client.subscribe('interface');
    // });

    // client.on('message', (topic, payload) => {
    //   console.log('received mqtt message', topic, payload.toString());
    //   navigate(`/${payload.toString()}`);
    // });

    // // cleanup
    // return () => {
    //   client.unsubscribe('interface');
    //   client.end();
    // }
    // console.log(mqtt);
  }, []);

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