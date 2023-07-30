import { Section, SectionFooter } from "@components/layout/Section";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Cron from "react-js-cron";
import { toast } from "react-toastify";

export function SyncSection() {
  const [value, setValue] = useState("");

  /**
   * When the component is mounted, get the cron sync
   */
  useEffect(() => {
    window.rumor.methods.getSetting("syncCronjob").then((c) => {
      if (c) setValue(c);
    });
  }, []);

  /**
   * Save the cron sync
   */
  const saveCronSync = () => {
    window.rumor.actions.setCronSync(value);
    toast("Cron sync is saved!");
  };

  return (
    <Section title="Synchronization">
      <Cron
        clockFormat="24-hour-clock"
        leadingZero
        clearButton={false}
        value={value}
        setValue={setValue}
      />
      <SectionFooter>
        <Button
          sx={{ width: "auto" }}
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={saveCronSync}
        >
          Save
        </Button>
      </SectionFooter>
    </Section>
  );
}
