import React from "react";
import { Section, SectionFooter } from "@components/layout/Section";
import { Button, TextField } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSettingsBucket } from "@hooks/useSettingsBucket";
import store from "../../../store";

const validationSchema = yup.object({
  mqttPort: yup
    .string()
    .required("MQTT port is required")
    .matches(/^[1-9][0-9]{3}$/),
  mqttHost: yup
    .string()
    .required("MQTT host is required")
    .matches(/^mqtt:\/\/[a-zA-Z0-9.-]+(:\d+)?$/),
});

interface MqttSettingsInitialValues extends Record<string, string> {
  mqttHost: string;
  mqttPort: string;
}

export function MqttSettingsSection() {
  const { currentInitialValues, saveValues } =
    useSettingsBucket<MqttSettingsInitialValues>({
      mqttHost: "",
      mqttPort: "",
    });

  // create the formik form
  const formik = useFormik({
    initialValues: currentInitialValues,
    validationSchema,
    onSubmit: async (v) => {
      await saveValues(v);
      await window.rumor.methods.reInitMqtt();
      store.notify("MQTT settings were saved!");
    },
  });

  return (
    <Section title="MQTT">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="mqttHost"
          placeholder="mqtt://"
          name="mqttHost"
          label="MQTT Host"
          value={formik.values.mqttHost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mqttHost && Boolean(formik.errors.mqttHost)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          id="mqttPort"
          name="mqttPort"
          label="MQTT Port"
          value={formik.values.mqttPort}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mqttPort && Boolean(formik.errors.mqttPort)}
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
    </Section>
  );
}
