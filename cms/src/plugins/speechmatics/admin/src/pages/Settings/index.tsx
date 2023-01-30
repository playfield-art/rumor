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
  Field, FieldLabel, FieldHint, FieldError, FieldInput, FieldAction
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { Settings } from '../../../../types';
import { settingsApi } from '../../api/settings';

const defaultSettings = {
  speechmaticsApiToken: "",
  translatorApiToken: ""
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
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
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
                  <Field name="translatorApiToken">
                    <Stack>
                      <FieldLabel>Translator API Token</FieldLabel>
                      <FieldInput
                        type="text"
                        placeholder=""
                        value={settings?.translatorApiToken}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            translatorApiToken: e.target.value,
                          })
                        }}
                      />
                    </Stack>
                  </Field>
                </GridItem>
              </Grid>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  );
};

export default Settings;
