import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../states/AuthState';
import api from '../infra/axios';
import { API_HOST } from '../infra/consts';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import { styled as muiStyled } from '@mui/system';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import InfoIcon from '@mui/icons-material/Info';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CSVLink } from 'react-csv';

const IconContainer = muiStyled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '48px',
  // More custom styles if needed
});
const AlertSpanWaring = styled.span`
  display: inline-block;
  padding: 8px 16px;
  color: ${(props) => props.color};

  /* background-color: #f8d7da; */
  /* color: #ED6C02; */
  background-color: transparent;
  font-weight: bold;
  border: 2px solid;

  border-radius: 4px;
`;

const ProfileImage = styled.img`
  position: absolute;
  top: -5%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
    /* margin: -5px auto 0;  */
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
  color: #666666;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const PanelContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: -20px;
  max-width: 840px;
  margin: 0 auto;
`;

const PanelContainerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  max-width: 960px;
  margin: 0 auto;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.7px);
  -webkit-backdrop-filter: blur(8.7px);
  border: 1px solid rgba(255, 255, 255, 0.78);
`;

const PanelInfo = styled.div`
  padding-top: 150px;
  display: flex;
  position: absolute;
  left: 88%;
  height: 165px;
  transform: translateX(-50%);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.7px);
  -webkit-backdrop-filter: blur(8.7px);
  border: 1px solid rgba(255, 255, 255, 0.78);
`;

const PanelInfo2 = styled.div`
  padding-top: 120px;
  display: flex;
  position: absolute;
  left: 12%;
  max-width: 250px;
  /* top: 555px; */

  transform: translateX(-50%);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  height: 375px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.7px);
  -webkit-backdrop-filter: blur(8.7px);
  border: 1px solid rgba(255, 255, 255, 0.78);
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333333;
`;
const TitleInfo = styled.h4`
  font-size: 18px;
  margin-bottom: 16px;
  color: #666666;
`;

const TitleCard = styled.span`
  font-size: 17px;
  margin-bottom: 20px;
  color: #666666;
`;

const InfoValue = styled.span`
  margin-right: 20px;
  font-size: 20px;
`;
const ProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const AdditionalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  margin-top: 8px;
`;

const InfoText = styled.span`
  font-size: 17px;
  margin-right: 8px;
  color: #42b72a; /* Green color */
`;
const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;


const Button = styled.button`
  padding: 8px 16px;
  margin-top: 8px;
  background-color: #92E3A9;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #92E3A9;
  }

`;

const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [imc, setImc] = useState('');
  const [tmb, setTmb] = useState('');
  const [date, setDate] = useState('');
  const [height, setHeigth] = useState<any[]>([]);
  const [weight, setWeight] = useState<any[]>([]);
  const [weightLoss, setWeightLoss] = useState<any[]>([]);
  const [age, setAge] = useState<any[]>([]);
  const [dataCalories, setDataCalories] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // const { userData } = useContext(AuthContext);



  const handleOpenModalInfo = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name || '';
    const user_id = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user_id.id || '';

    setUsername(name);
    setId(id);
    fetchUserData(id);
    fetchUserInfo(id);
  }, []);

  const fetchUserData = async (id: any) => {
    try {
      const response = await api.get(`${API_HOST}/api/questions/calculate_metrics/?user=${id}`);
      const { imc, tmb, calorie_data } = response.data;
      setImc(imc);
      setTmb(tmb);
      setDataCalories(calorie_data)
    } catch (error) {
      // Handle error
    }
  };

  const fetchUserInfo = async (id: any) => {
    try {
      const response = await api.get(`${API_HOST}/api/questions/?user=${id}`);
      const { created_at } = response.data[0];
      setHeigth(response.data[0].height)
      setWeight(response.data[0].weight)
      setWeightLoss(response.data[0].weight_loss)
      setAge(response.data[0].age)

      setDate(created_at);
    } catch (error) {
      // Handle error
    }
  };
  const calcularCategoriaPeso = (imc: number) => {
    let categoria = '';
    let color = '';

    switch (true) {
      case imc < 18.5:
        categoria = 'MAGREZA';
        color = '#ED6C02';
        break;
      case imc >= 18.5 && imc <= 24.9:
        categoria = 'NORMAL';
        color = '#42b72a';
        break;
      case imc >= 25.0 && imc <= 29.9:
        categoria = 'SOBREPESO';
        color = '#F4A723';
        break;
      case imc >= 30.0 && imc <= 39.9:
        categoria = 'OBESIDADE';
        color = '#FF3E30';
        break;
      case imc > 40.0:
        categoria = 'OBESIDADE GRAVE';
        color = '#B80303';
        break;
      default:
        categoria = '--';
        color = '#ED6C02';
        break;
    }

    return { categoria, color } as { categoria: string; color: string };

  };

  const imc_number = Number(imc);
  const { categoria, color } = calcularCategoriaPeso(imc_number);
  const dataAtual = new Date();
  const dateCreate = new Date(date);
  const OneMonth = new Date(dateCreate.getFullYear(), dateCreate.getMonth() + 1, dateCreate.getDate());
  const isQuestionnaireAvailable = date !== '' && dataAtual < OneMonth;


  const buttonDisabledMessage = isQuestionnaireAvailable
    ? 'O questionário não está disponível no momento!'
    : 'Você ainda não preencheu o questionário';

  const handleQuestionnaireClick = () => {
    window.location.href = '/questions';
  };

  const handleProgressClick = () => {
    window.location.href = `/graph?userId=${id}`;
  };

  const handleDietClick = () => {
    window.location.href = '/diet-screen';
  };

  const handleFoodClick = () => {
    window.location.href = '/food';
  };


  const data_calories = dataCalories ? Object.entries(dataCalories).map(([key, value]) => ({ [key]: value })) : [];
const csvData = data_calories.map((item, index) => ({
  key: Object.keys(item)[0],
  value: Object.values(item)[0],
}));
console.log(csvData)

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Container>
      <Content>
        <Title>Bem-vindo, {username}!</Title>
        <WelcomeText>Selecione uma opção abaixo:</WelcomeText>
      </Content>
      <PanelContainer>
        <PanelInfo>
          <TitleInfo>{username}</TitleInfo>
          <strong>{age} Anos</strong>
          <ProfileImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="Profile Image" />
          <ProfileCardContainer>
            <AdditionalInfo>
              <InfoContainer>
                <InfoText>Altura</InfoText>
                <InfoValue>{height}</InfoValue>
                <InfoText>Peso</InfoText>
                <InfoValue>{weight}</InfoValue>
                <InfoText >Meta</InfoText>
                <InfoValue style={{ color: 'red' }} > -{weightLoss}</InfoValue>
              </InfoContainer>
            </AdditionalInfo>
          </ProfileCardContainer>
        </PanelInfo>
        {/* <PanelInfo2>
        <TitleInfo>{username}</TitleInfo>
          <strong>{age} Anos</strong>
          <ProfileImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="Profile Image" />
          <ProfileCardContainer>
            <AdditionalInfo>
              <InfoContainer>
                <InfoText>Altura</InfoText>
                <InfoValue>{height}</InfoValue>
                <InfoText>Peso</InfoText>
                <InfoValue>{weight}</InfoValue>
                <InfoText >Meta</InfoText>
                <InfoValue style={{ color: 'red' }} > -{weightLoss}</InfoValue>
              </InfoContainer>
            </AdditionalInfo>
          </ProfileCardContainer>
        </PanelInfo2> */}
  
        <PanelInfo2>
          <TitleCard>Tabela Nutricional</TitleCard>
          <IconButton onClick={handleOpenModalInfo}>
            <InfoOutlinedIcon />
          </IconButton>
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Baseados na suas informações fornecidas os resultados revelam uma série de estimativas diárias de calorias que podem ser utilizadas como guia para determinar a quantidade ideal de calorias a consumir diariamente, seja para manter, perder ou ganhar peso na taxa desejada.    </Typography>
            </Box>
          </Modal>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{fontWeight: 'bold'}}>Objetivo</TableCell>
                <TableCell style={{fontWeight: 'bold'}}>Calorias Diárias</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {/* <span>Os resultados revelam uma série de estimativas diárias de calorias que podem ser utilizadas como guia para determinar a quantidade ideal de calorias a consumir diariamente, seja para manter, perder ou ganhar peso na taxa desejada.</span> */}
              {data_calories.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{Object.keys(item)[0]} </TableCell>
                  <TableCell>{Object.values(item)[0]}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <Button onClick={handleFoodClick}>Visualizar tabela de calorias</Button> */}

              <CSVLink data={csvData} filename="calories.csv" target="_blank">
              Download CSV
            </CSVLink>
        </PanelInfo2>


        <Panel>
          <TitleCard>Índice de massa corporal</TitleCard>
          <Title>{imc || '--'}</Title>

          <div>
            <AlertSpanWaring color={color}>{categoria}</AlertSpanWaring>

          </div>

        </Panel>

        <Panel>
          <TitleCard>Taxa de Metabolismo basal</TitleCard>
          <Title>{tmb || '--'}</Title>

        </Panel>

        <Panel>
          <TitleCard>Gráfico Progresso Perda de Peso</TitleCard>
          <IconContainer>
            <AnalyticsOutlinedIcon sx={{ fontSize: 64 }} />
          </IconContainer>
          <Button onClick={handleProgressClick}>Acompanhar seu progresso</Button>
        </Panel>

        <Panel>
          <TitleCard>Conferir minha dieta</TitleCard>
          <Button onClick={handleDietClick}>Visualizar dieta</Button>
        </Panel>

        <Panel>
          <TitleCard>Preencher questionário de dieta</TitleCard>
          {isQuestionnaireAvailable ? (
            <Stack sx={{ width: '100%' }} spacing={2}>

              <Alert onClose={() => { }} variant="outlined" color="warning">
                {

                  buttonDisabledMessage}</Alert>

            </Stack>
          ) : (
            <Button disabled={isQuestionnaireAvailable} onClick={handleQuestionnaireClick}>
              Preencher questionário
            </Button>
          )}
        </Panel>

        <Panel>
          <TitleCard>Tabela Nutricional</TitleCard>
          <Button onClick={handleFoodClick}>Visualizar tabela de calorias</Button>
        </Panel>
      </PanelContainer>
    </Container>
  );
};
export default HomePage;
  