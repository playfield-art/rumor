// admin/src/pages/Settings/index.js
import React, { useEffect, useState } from 'react';
import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';
import {
  Button,
  Box,
  Stack,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Typography,
  Field, FieldLabel, FieldInput, Textarea
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { Settings } from '../../../../types';
import { settingsApi } from '../../api/settings';

const defaultSettings = {
  speechmaticsApiToken: "",
  googleTranslateApiToken: "",
  targetLanguage: "",
  googleCloudProjectId: "",
  notifyCallbackUrl: "",
  brainjarApiKey: "",
  iterationIntro: "",
  iterationOutro: ""
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification();

  useEffect(() => {
    settingsApi.getSettings().then((settings) => {
      setSettings(settings);
      setIsLoading(false);
    });
  }, [setSettings]);

  const handleSubmit = async () => {
    setIsSaving(true);
    const savedSettings = await settingsApi.setSettings(settings);
    setSettings(savedSettings);
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: 'Settings successfully updated',
    });
  };

  return (
    <>
      <HeaderLayout
        id="title"
        title="Speechmatics General Settings"
        subtitle="Manage the settings and behaviour of Speechmatics"
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </Button>
          )
        }
      ></HeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Stack spacing={7}>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="delta" as="h2">
                    Speechmatics Configuration
                  </Typography>
                </Stack>
                <Stack>
                  <Grid gap={6}>
                    <GridItem col={12} s={12}>
                      <Field name="speechmaticsApiToken">
                        <Stack>
                          <FieldLabel>Speechmatics API Token</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.speechmaticsApiToken}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                speechmaticsApiToken: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Field name="notifyCallbackUrl">
                        <Stack>
                          <FieldLabel>Notify Callback Url</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.notifyCallbackUrl}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                notifyCallbackUrl: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                  </Grid>
                </Stack>
              </Stack>
            </Box>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="delta" as="h2">
                    Google Translate Configuration
                  </Typography>
                </Stack>
                <Stack>
                  <Grid gap={6}>
                    <GridItem col={12} s={12}>
                      <Field name="googleTranslateApiToken">
                        <Stack>
                          <FieldLabel>Google Translate API Token</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.googleTranslateApiToken}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                googleTranslateApiToken: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Field name="googleCloudProjectId">
                        <Stack>
                          <FieldLabel>Google Cloud Project Id</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.googleCloudProjectId}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                googleCloudProjectId: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Field name="targetLanguage">
                        <Stack>
                          <FieldLabel>Target Language</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.targetLanguage}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                targetLanguage: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                  </Grid>
                </Stack>
              </Stack>
            </Box>
             <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="delta" as="h2">
                    Brainjar configuration
                  </Typography>
                </Stack>
                <Stack>
                  <Grid gap={6}>
                    <GridItem col={12} s={12}>
                      <Field name="brainjarApiKey">
                        <Stack>
                          <FieldLabel>Brianjar API Key</FieldLabel>
                          <FieldInput
                            type="text"
                            placeholder=""
                            value={settings?.brainjarApiKey}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                brainjarApiKey: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Field name="iterationIntro">
                        <Stack>
                          <FieldLabel>Iteration Intro</FieldLabel>
                          <Textarea
                            placeholder=""
                            value={settings?.iterationIntro}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                iterationIntro: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Field name="iterationOutro">
                        <Stack>
                          <FieldLabel>Iteration Outro</FieldLabel>
                          <Textarea
                            placeholder=""
                            value={settings?.iterationOutro}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                iterationOutro: e.target.value,
                              })
                            }}
                          />
                        </Stack>
                      </Field>
                    </GridItem>
                  </Grid>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </ContentLayout>
      )}
    </>
  );
};

export default Settings;
