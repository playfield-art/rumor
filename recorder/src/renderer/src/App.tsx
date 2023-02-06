import React from "react";
import { AppContainer } from "@components";
import { AppVerticalContainer } from "@components/layout/AppVerticalContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { observer } from "mobx-react";
import Loader from "@components/Loader";
import { FolderSettingsSection } from "./layout/FolderSettingsSection";
import ActionsSection from "./layout/ActionsSection";
import SoundboardStatus from "./layout/SoundboardStatus";
import store from "./store";
import { RecorderSettingsSection } from "./layout/RecorderSettingsSection";

function App() {
  return (
    <AppContainer>
      {store.loading && <Loader />}
      <AppVerticalContainer>
        <RecorderSettingsSection />

        <FolderSettingsSection />
      </AppVerticalContainer>
      <AppVerticalContainer>
        <ActionsSection />
        <SoundboardStatus />
      </AppVerticalContainer>
      <ToastContainer />
    </AppContainer>
  );
}

export default observer(App);
