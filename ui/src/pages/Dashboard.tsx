// src/components/Dashboard/Dashboard.tsx


import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { API_HOST } from '../infra/consts';
import api from '../infra/axios';
import { Link } from 'react-router-dom';
import GeneralPerformanceChart from '../components/graphics/GeneralPerformanceChart'
import Schudule from './Schudule';
const Card = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
`;


const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f0f0f0;
  /* background-color: #E0E7FF; */
`;





const Menu = styled.nav`
  width: 250px;
  background-color: #333;
  color: #fff;
  padding: 16px;
`;

const MenuItem = styled.a`
  display: block;
  color: #fff;
  text-decoration: none;
  margin-bottom: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 16px;
`;

const Chart = styled.div`
  height: 450px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserListItem = styled.li`
  margin: 8px 0;
`;






const Dashboard: React.FC = () => {

  interface User {
    id: number;
    user: number;
    name: string;
    age: number;
    gyn_name: string;
    weight_loss: number;
    nome_completo: string;

  }


  const [users, setUsers] = useState<User[]>([]);
  const [studentData, setData] = useState<User[]>([]);
  


  useEffect(() => {
    api.get(`${API_HOST}/users/list_users_by_gym`)
      .then(res => {
        setUsers(res.data)

      })
      .catch(err => {
        // Handle error
      });

      
  }, []);
  
  const gym = JSON.parse(localStorage.getItem('user') || '{}');
  const gym_id = gym.academia || '';

  console.log(gym_id);

  // const studentIds = [1, 2, 6];
  // const queryParams = studentIds.join(',');
  const fetchUserData = async () => {
    api.get(`${API_HOST}/api/questions/list_users_gym/?gym_id=${gym_id}`)
    // api.get(`${API_HOST}/api/questions/group_graph/?user=${userId}`)

    .then(res => {
      setData(res.data)
      
    })
    .catch(err => {
      // Handle error
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Provide an empty dependency array here
  

  const totalAlunos = users.length;
  const novosAlunos = 10;
  const receitaMensal = 10000;
  const frequenciaMedia = 3.5;
  
  return (
    <Container>
      {/* <Menu>
        <h2>Menu</h2>
        <MenuItem href="#">Dashboard</MenuItem>
        <MenuItem href="#">Relatórios</MenuItem>
        <MenuItem href="#">Configurações</MenuItem>
      </Menu> */}
      <Content>
        <h1 style={{ fontSize: "35px", margin: "16px 0", fontFamily: 'Poppins' }}>Dashboard</h1>
        {/* <Card> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", borderRadius: "14px" }}
            >
              <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>
                Total de Alunos
              </h2>
              <p style={{ fontSize: "18px", margin: "8px 0" }}>{totalAlunos}</p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", borderRadius: "14px" }}
            >
              <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>
                Novos Alunos
              </h2>
              <p style={{ fontSize: "18px", margin: "8px 0" }}>{novosAlunos}</p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", borderRadius: "14px" }}
            >
              <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>
                Receita Mensal
              </h2>
              <p style={{ fontSize: "18px", margin: "8px 0" }}>
                R${receitaMensal.toFixed(2)}
              </p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              style={{ padding: "20px", borderRadius: "14px" }}
            >
              <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>
                Frequência Média
              </h2>
              <p style={{ fontSize: "18px", margin: "8px 0" }}>
                {frequenciaMedia} visitas/semana
              </p>
            </Paper>
          </Grid>
        </Grid>

        {/* </Card> */}
        <Card>
          <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>Atividades Recentes</h2>
          {/* <Schudule/> */}
        </Card>
        <Card>
          {/* <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }}>Gráfico</h2>   */}
          <Chart>
          <GeneralPerformanceChart studentData={studentData}/>

          </Chart>
        </Card>
        <Card>
          <h2 style={{ fontSize: "24px", margin: "16px 0", fontFamily: 'Poppins' }} >Lista de Usuários</h2>
          <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          {users.map((student) => (
            <div key={student.user}>
              <Link to={`user-page/${student.user}`}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={student.nome_completo}
                      // src={`/static/images/avatar/${student.id}.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.nome_completo}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {/* Academia: {student.gyn_name} */}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Link>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
        </Card>
      </Content>
    </Container>
  );
};

export default Dashboard;
