import SelectFileFolder from "@components/SelectFileFolder";
import { Section } from "@components/layout/Section";
import useSettings from "@hooks/useSettings";
import { Switch, Stack, FormGroup, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";

export function QLCSection() {
  const { getSetting, setFileSetting, saveSetting } = useSettings();
  const [currentQLCFile, setCurrentQLCFile] = useState<string | undefined>("");
  const [openAtStartup, setOpenAtStartup] = useState<boolean>(false);

  useEffect(() => {
    getSetting("qlcFile").then((qlcFile: any) => {
      if (qlcFile) setCurrentQLCFile(qlcFile.toString());
    });
    getSetting("qlcOpenAtStartup").then((oas: any) => {
      setOpenAtStartup(Boolean(Number(oas)));
    });
  }, []);

  const handleOpenAtStartupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    saveSetting("qlcOpenAtStartup", event.target.checked);
    setOpenAtStartup(event.target.checked);
  };

  return (
    <Section title="QLC">
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={openAtStartup}
                onChange={handleOpenAtStartupChange}
              />
            }
            label="Open QLC+ when this app starts"
          />
        </FormGroup>
      </Stack>
      <SelectFileFolder
        path={currentQLCFile || ""}
        label="SET"
        onClick={async () => {
          await setFileSetting("qlcFile", [
            { name: "QLC files", extensions: ["qxw"] },
          ]).then((qlcFile: string) => {
            if (qlcFile) setCurrentQLCFile(qlcFile);
          });
        }}
      />
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center" />
    </Section>
  );
}
