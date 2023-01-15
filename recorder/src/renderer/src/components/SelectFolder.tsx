import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

type SelectFolderProps = {
  path: string,
  label?: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const SelectFolderContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 4fr 1fr;
`

const SelectFolder = ({ path, onClick, label = '...' }: SelectFolderProps) => {
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => setCurrentPath(path), [path]);

  return (
    <SelectFolderContainer>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>{currentPath}</div>
      <button onClick={onClick}>{label}</button>
    </SelectFolderContainer>
  )
}

export default SelectFolder