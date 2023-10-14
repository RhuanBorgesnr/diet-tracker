import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../infra/axios';
import { API_HOST } from '../infra/consts';
import { CSVLink } from 'react-csv';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const DietaListContainer = styled.div`
  text-align: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Lista = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  text-align: left;
  white-space: pre-wrap;
`;

const Message = styled.p`
  color: #888;
`;

const DietaList = () => {

  
  const [diet, setDiet] = useState<{ refeicao: string; descricao: string }[]>([]);

  // const user_id = JSON.parse(localStorage.getItem('user') || '{}');
  // const id = user_id.id || '';
  const { user_id } = useParams<{ user_id: string }>();


  useEffect(() => {
    api.get(`${API_HOST}/api/questions/get_diet/?user=${user_id}`)
      .then(res => {
        setDiet(res.data); // Update the diet state with the response data
      })
      .catch(err => {
        // Handle error
      });
  }, [user_id]);

  const csvData = diet.map(item => ({ refeicao: item.refeicao, descricao: item.descricao }));

  return (
    <Container>
      <DietaListContainer>
        <Title>Minha Dieta</Title>
        {diet.length === 0 ? (
          <Message>Nenhum valor disponível.</Message>
        ) : (
          <>
           
            <Lista>
              {diet.map((item, index) => (
                <ListItem key={index}>
                  <strong>{item.refeicao}:</strong>
                  <br />
                  {item.descricao}
                </ListItem>
              ))}
            </Lista>
          </>
        )}
         <CSVLink data={csvData} filename="diet.csv" target="_blank">
              Download CSV
            </CSVLink>
      </DietaListContainer>
    </Container>
  );
};

export default DietaList;
