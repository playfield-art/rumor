import { StatusContainer } from "@components/StatusContainer";
import { observer } from "mobx-react";
import React from "react";
import store from "../store";

function SoundboardStatus() {
  return (
    <StatusContainer>
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
    </StatusContainer>
  );
}

export default observer(SoundboardStatus);
