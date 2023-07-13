import React from "react";
import { useFormik } from "formik";
import { Section, SectionFooter } from "@components/layout/Section";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import { useSettingsBucket } from "@hooks/useSettingsBucket";
import { TextField } from "@mui/material";
import store from "../../../store";

const validationSchema = Yup.object().shape({
  language: Yup.string().required("Language is required"),
  boothSlug: Yup.string().required("Booth Slug is required"),
  rumorCmsApiUrl: Yup.string(),
  rumorCmsApiToken: Yup.string(),
});

interface RecorderSettingsInitialValues extends Record<string, string> {
  language: string;
  boothSlug: string;
  rumorCmsApiUrl: string;
  rumorCmsApiToken: string;
}

export function RecorderSettingsSection() {
  const { currentInitialValues, saveValues } =
    useSettingsBucket<RecorderSettingsInitialValues>({
      language: "",
      boothSlug: "",
      rumorCmsApiUrl: "",
      rumorCmsApiToken: "",
    });

  // create the formik form
  const formik = useFormik({
    initialValues: currentInitialValues,
    validationSchema,
    onSubmit: async (v) => {
      await saveValues(v);
      store.notify("Recorder settings were saved!");
    },
  });

  return (
    <Section title="Recording Settings">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Language"
          type="text"
          id="language"
          name="language"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.language}
          error={formik.touched.language && Boolean(formik.errors.language)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          label="Booth Slug"
          type="text"
          id="boothSlug"
          name="boothSlug"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.boothSlug}
          error={formik.touched.boothSlug && Boolean(formik.errors.boothSlug)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          label="Rumor CMS Api URL"
          type="text"
          id="rumorCmsApiUrl"
          name="rumorCmsApiUrl"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.rumorCmsApiUrl}
          error={
            formik.touched.rumorCmsApiUrl &&
            Boolean(formik.errors.rumorCmsApiUrl)
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          label="Rumor CMS Api Token"
          type="text"
          id="rumorCmsApiToken"
          name="rumorCmsApiToken"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.rumorCmsApiToken}
          error={
            formik.touched.rumorCmsApiToken &&
            Boolean(formik.errors.rumorCmsApiToken)
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
    </Section>
  );
}
