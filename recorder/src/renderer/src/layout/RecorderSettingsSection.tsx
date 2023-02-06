import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Section } from "@components/layout/Section";
import styled from "styled-components";
import * as Yup from "yup";
import store from "../store";

const InputWrapper = styled.div`
  input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.7rem;
    font-size: 1rem;
    border-radius: var(--default-border-radius);
    border: 1px solid var(--white);
    margin: 3px 0 3px 0;
  }
  label {
    font-size: 0.8rem;
  }
  margin-bottom: calc(var(--default-margin) / 2);
`;

const FormActionsButtonWrapper = styled.div`
  margin-top: var(--default-margin);
  width: 100%;
  text-align: right;
`;

const recordingSettingsSchema = Yup.object().shape({
  language: Yup.string(),
  boothSlug: Yup.string(),
  rumorCmsApiUrl: Yup.string(),
  rumorCmsApiToken: Yup.string(),
});

interface InitialValues {
  language: string;
  boothSlug: string;
  rumorCmsApiUrl: string;
  rumorCmsApiToken: string;
}

export function RecorderSettingsSection() {
  const [initialValues, setInitialValues] = useState<InitialValues>({
    language: "",
    boothSlug: "",
    rumorCmsApiUrl: "",
    rumorCmsApiToken: "",
  });

  useEffect(() => {
    store.runProces();
    const getInitialValues = async (): Promise<InitialValues> => {
      // get the keys of the initial values
      const valuesKeys = Object.keys(initialValues);

      // create the default initialvalues
      const newInitialValues = {} as InitialValues;

      // loop over keys and get the values
      await Promise.all(
        valuesKeys.map(async (k) => {
          newInitialValues[k as keyof InitialValues] =
            (await window.rumor.methods.getSetting(k)) || "";
        })
      );

      // return the fetched initial values
      return newInitialValues;
    };
    getInitialValues().then((v) => {
      setInitialValues(v);
      store.stopProces();
    });
  }, []);

  if (store.procesStatus.procesIsRunning) return <div />;

  return (
    <Section title="Recording Settings">
      <Formik
        initialValues={initialValues}
        validationSchema={recordingSettingsSchema}
        onSubmit={async (v, { setSubmitting }) => {
          // we are submitting, let the form know
          setSubmitting(true);

          // get all the values keys
          const valuesKeys = Object.keys(v);

          // save everything in the form
          await Promise.all(
            valuesKeys.map(async (vk: string) => {
              await window.rumor.actions.saveSetting({
                key: vk,
                value: v[vk as keyof InitialValues] ?? "",
              });
            })
          );

          // done, so clear submitting state
          setSubmitting(false);

          // notify in the frontend
          store.notify("Settings were saved!");
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <InputWrapper>
              <label htmlFor="language">
                Language
                <input
                  type="text"
                  id="language"
                  name="language"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.language}
                />
              </label>
              {errors.language && touched.language && errors.language}
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="boothSlug">
                Booth Slug
                <input
                  type="text"
                  id="boothSlug"
                  name="boothSlug"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.boothSlug}
                />
              </label>
              {errors.boothSlug && touched.boothSlug && errors.boothSlug}
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="rumorCmsApiUrl">
                Rumor CMS Api URL
                <input
                  type="text"
                  id="rumorCmsApiUrl"
                  name="rumorCmsApiUrl"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.rumorCmsApiUrl}
                />
              </label>
              {errors.rumorCmsApiUrl &&
                touched.rumorCmsApiUrl &&
                errors.rumorCmsApiUrl}
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="rumorCmsApiToken">
                Rumor CMS Api Token
                <input
                  type="text"
                  id="rumorCmsApiToken"
                  name="rumorCmsApiToken"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.rumorCmsApiToken}
                />
              </label>
              {errors.rumorCmsApiToken &&
                touched.rumorCmsApiToken &&
                errors.rumorCmsApiToken}
            </InputWrapper>
            <FormActionsButtonWrapper>
              <button type="submit" disabled={isSubmitting}>
                Save
              </button>
            </FormActionsButtonWrapper>
          </Form>
        )}
      </Formik>
    </Section>
  );
}
