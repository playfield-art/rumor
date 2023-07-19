import { Section, SectionFooter } from "@components/layout/Section";
import useSettings from "@hooks/useSettings";
import {
  Switch,
  Stack,
  FormGroup,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import store from "../../../store";

const validationSchema = yup.object({
  doorStopSessionAfter: yup
    .number()
    .required("Door stop session after is required"),
});

export function DoorSettingsSection() {
  const { getSetting, saveSetting } = useSettings();
  const [startSessionAfterDoorIsClosed, setStartSessionAfterDoorIsClosed] =
    useState<boolean>(false);
  const [doorStopSession, setDoorStopSession] = useState<boolean>(false);
  const [doorStopSessionAfter, setDoorStopSessionAfter] = useState<number>(0);

  // create the formik form
  const formik = useFormik({
    initialValues: {
      doorStopSessionAfter,
    },
    validationSchema,
    onSubmit: async (v) => {
      saveSetting("doorStopSessionAfter", v.doorStopSessionAfter);
      store.notify("Door settings were saved!");
    },
  });

  useEffect(() => {
    getSetting("startSessionAfterDoorIsClosed").then((ssadic: any) => {
      setStartSessionAfterDoorIsClosed(Boolean(Number(ssadic)));
    });
    getSetting("doorStopSession").then((dss: any) => {
      setDoorStopSession(Boolean(Number(dss)));
    });
    getSetting("doorStopSessionAfter").then((dssa: any) => {
      formik.setFieldValue("doorStopSessionAfter", dssa);
      setDoorStopSessionAfter(parseInt(dssa));
    });
  }, []);

  const handleDoorStopSessionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    saveSetting("doorStopSession", event.target.checked);
    setDoorStopSession(event.target.checked);
  };

  const handleStartSessionAfterDoorIsClosedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    saveSetting("startSessionAfterDoorIsClosed", event.target.checked);
    setStartSessionAfterDoorIsClosed(event.target.checked);
  };

  return (
    <Section title="Door">
      <Stack direction="column" spacing={3}>
        <Stack direction="column">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={startSessionAfterDoorIsClosed}
                  onChange={handleStartSessionAfterDoorIsClosedChange}
                />
              }
              label="Only start session when door is closed"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={doorStopSession}
                  onChange={handleDoorStopSessionChange}
                />
              }
              label="Stop session when door is open"
            />
          </FormGroup>
        </Stack>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Stop session after (seconds)"
            type="number"
            id="doorStopSessionAfter"
            name="doorStopSessionAfter"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.doorStopSessionAfter}
            error={
              formik.touched.doorStopSessionAfter &&
              Boolean(formik.errors.doorStopSessionAfter)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <SectionFooter>
            <Button
              sx={{ width: "auto" }}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Save
            </Button>
          </SectionFooter>
        </form>
      </Stack>
    </Section>
  );
}
