import React from 'react'
import { useLocalStorage } from "usehooks-ts";
import { SocketData } from '../interfaces';

export const Setup = () => {
  const [socketData, setSocketData] = useLocalStorage<SocketData>('socketData', { socketUrl: '' });
  return (
    <div>
      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "100px 0.5fr",
        alignItems: "center"
      }}>
        <label>Socket URL</label>
        <input type='text' onChange={(e) => {
          setSocketData({ ...socketData, socketUrl: e.target.value })
        }} value={socketData.socketUrl} placeholder='Enter the url of the socket server' />
      </div>
    </div>
  )
}