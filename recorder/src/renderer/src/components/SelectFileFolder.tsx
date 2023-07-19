import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

type SelectFileFolderProps = {
  path: string;
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const SelectFolderContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
`;

function SelectFileFolder({
  path,
  label = "...",
  onClick,
}: SelectFileFolderProps) {
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => setCurrentPath(path), [path]);

  return (
    <SelectFolderContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {currentPath}
      </div>
      <Button variant="contained" type="button" onClick={onClick}>
        {label}
      </Button>
    </SelectFolderContainer>
  );
}

export default SelectFileFolder;