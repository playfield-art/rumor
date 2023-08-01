import { Section } from "@components/layout/Section";
import useSettings from "@hooks/useSettings";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cron from "react-js-cron";
import { toast } from "react-toastify";

export function CronSection() {
  const { getSetting, saveSetting } = useSettings();
  const [cronSyncValue, setCronSyncValue] = useState("");
  const [syncCronjobActive, setSyncCronjobActive] = useState(false);
  const [autoRemoveArchiveCronjobActive, setAutoRemoveArchiveCronjobActive] =
    useState(false);

  /**
   * When the component is mounted, get the cron sync
   */
  useEffect(() => {
    getSetting("syncCronjob").then((c) => {
      if (c) setCronSyncValue(c);
    });
    getSetting("syncCronjobActive").then((c) => {
      if (c) setSyncCronjobActive(Boolean(Number(c)));
    });
    getSetting("autoRemoveArchiveCronjobActive").then((c) => {
      console.log(c);
      if (c) setAutoRemoveArchiveCronjobActive(Boolean(Number(c)));
    });
  }, []);

  /**
   * Save the cron sync
   */
  const saveCronSync = () => {
    window.rumor.actions.setCronSync(cronSyncValue);
    toast("Cron sync is saved!");
  };

  return (
    <Section title="Cron">
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 2 }} variant="h6">
          Synchronization
        </Typography>
        <Stack direction="row" spacing={2}>
          <Cron
            clockFormat="24-hour-clock"
            leadingZero
            clearButton={false}
            value={cronSyncValue}
            setValue={setCronSyncValue}
          />
          <Button
            style={{ maxHeight: "34px", minHeight: "34px" }}
            sx={{ width: "auto" }}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            onClick={saveCronSync}
          >
            Save
          </Button>
        </Stack>
        <Stack direction="column">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={syncCronjobActive}
                  onChange={(e, checked) => {
                    saveSetting("syncCronjobActive", Number(checked));
                    setSyncCronjobActive(checked);
                  }}
                />
              }
              label="Synchonise recordings with CMS"
            />
          </FormGroup>
        </Stack>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Stack direction="column">
          <Typography mb={2} variant="h6">
            Auto remove
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRemoveArchiveCronjobActive}
                  onChange={(e, checked) => {
                    saveSetting(
                      "autoRemoveArchiveCronjobActive",
                      Number(checked)
                    );
                    setAutoRemoveArchiveCronjobActive(checked);
                  }}
                />
              }
              label="Auto remove old archived recordings"
            />
          </FormGroup>
        </Stack>
      </Box>
    </Section>
  );
}
