import React from "react";
import store from "../store";

export function CurrentStatus() {
  return (
    <>
      {!store.currentVO && !store.currentSC && "No current status."}
      {store.currentVO && (
        <div>
          {store.currentVO ? `Current Chapter: ${store.currentVO.chapter}` : ""}
        </div>
      )}
      {store.currentVO && (
        <div>
          {store.currentVO
            ? `Current Voice Over: ${store.currentVO.fileName}`
            : ""}
        </div>
      )}
      {store.currentSC && (
        <div>
          {store.currentSC
            ? `Current Soundscape: ${store.currentSC.startsAt.chapter}`
            : ""}
        </div>
      )}
    </>
  );
}
