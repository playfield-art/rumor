import { AppContainer, ButtonContainer } from '@components';
import SelectFolder from '@components/SelectFolder';
import { StatusContainer } from '@components/StatusContainer';
import useSettings from '@hooks/useSettings';
import useSoundBoard from '@hooks/useSoundBoard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const notifyError = (e: Error) => toast(e.message);
  const {
    currentNarrativesFolder,
    setCurrentNarrativesFolder,
    currentRecordingsFolder,
    setCurrentRecordingsFolder
  } = useSettings();
  const { playNextVO, stop, refetch, currentSC, currentVO } = useSoundBoard(notifyError);

  return (
    <AppContainer>
      <ButtonContainer>
        <button onClick={() => playNextVO()}>Next Voice Over</button>
      </ButtonContainer>
      <ButtonContainer>
        <button onClick={() => stop()}>Stop Soundboard</button>
      </ButtonContainer>
      <ButtonContainer>
        <button onClick={() => refetch()}>Refetch Audio Data</button>
      </ButtonContainer>
      <ButtonContainer>
        <SelectFolder
          path={currentNarrativesFolder || ''}
          label='NAR'
          onClick={async () => {
            setCurrentNarrativesFolder(await window.rumor.methods.setNarrativesFolder())
            refetch();
          }} />
      </ButtonContainer>
      <ButtonContainer>
        <SelectFolder
          path={currentRecordingsFolder || ''}
          label='REC'
          onClick={async () => {
            setCurrentRecordingsFolder(await window.rumor.methods.setRecordingsFolder())
          }} />
      </ButtonContainer>
      <StatusContainer>
        {!currentVO && !currentSC && "No current status."}
        {currentVO && <div>{currentVO ? `Current Voice Over: ${currentVO}` : ""}</div>}
        {currentSC && <div>{currentSC ? `Current Soundscape: ${currentSC}` : ""}</div>}
      </StatusContainer>
      <ToastContainer />
    </AppContainer>
  )
}

export default App
