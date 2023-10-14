import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import ProgressChart from '../components/graphics/ProgressChart';
import { API_HOST } from '../infra/consts';
import api from '../infra/axios';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import './ChartPage.css'; // Importe o arquivo CSS para estilização

interface ProgressData {
  date: string;
  currentWeight: number;
  idealWeight: number;
}

const ChartPage = () => {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [open, setOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');

  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionnaire = () => {
    history.push('/questions'); // Redirect to the questionnaire page
  };

  const handleFetchData = () => {
    createQuestionWithSameData(weightInput);
  };

  useEffect(() => {
    api.get(`${API_HOST}/api/questions/group_graph/?user=${userId}`)
      .then(res => {
        setProgress(res.data);
      })
      .catch(err => {
        // Handle error
      });
  }, [userId]);

  useEffect(() => {
    if (progress.length === 0) {
      setOpen(true);
    }
  }, [progress]);

  const createQuestionWithSameData = (weight: string) => {
    api.post('api/questions/create_with_same_data/', {
      user: userId,
      weight: weight,
    })
      .then((response) => {
        // Verifique a resposta para o código de status ou os dados retornados, se necessário
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error.response && error.response.data && error.response.data.error);
        // Trate erros de solicitação, se houver algum
      });
  };

  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop={4}
          marginBottom={4}
        >
          <h1>Progresso da Perda de Peso</h1>
          {progress.length > 0 ? (
            <>
              <div style={{ width: '100%', height: '500px' }}>
                <ProgressChart data={progress} />
              </div>
              <div className="weight-input-container">
                <label className="weight-input-label">Qual seu peso atual:</label>
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  type="number"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    console.log(e.target.value); // Log the input value
                  }}
                />
                <Button className="weight-input-button" variant="contained" onClick={handleFetchData}>
                  Enviar
                </Button>
              </div>
            </>
          ) : (
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Ainda não temos gráfico de progresso para você!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Deseja preencher o questionário de dieta?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Fechar</Button>
                <Button onClick={handleQuestionnaire} autoFocus>
                  Preencher questionário
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default ChartPage;
