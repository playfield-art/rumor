import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'
import { Container, Typography, Grid, Box } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box mb={2} mt={2}>
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3">
                Rumor // Unfolding Futures
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography paragraph>
                Waar droom jij van? Naar welke toekomst ben jij op zoek? Zonder je af in mijn kamers, luister naar mijn stem en beken wat je verlangt. Je bent helemaal alleen, enkel ik kan je horen. Ik verzamel toekomstdromen.
              </Typography>
              <Typography paragraph>
                RUMOR // Unfolding Futures is een installatie die wortels heeft in het idee dat een beeld van een toekomstige, andere wereld botst met onze huidige wereld. Een droom voor de toekomst is soms ook de aankondiging van verandering. Maar wat als blijkt dat de een zijn droom de ander zijn nachtmerrie is?
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
