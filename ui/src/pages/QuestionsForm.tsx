import React, { useState } from "react";
import styled from "styled-components";
import { css } from "@emotion/react";

import { BeatLoader } from "react-spinners";
import api from "../infra/axios";
import { useHistory, Link } from "react-router-dom";

interface Question {
  question: string;
  inputType?: "number";
  options?: string[];
}

const QuestionForm: React.FC = () => {
  const history = useHistory();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const questions: Question[] = [
    {
      question: "Qual é a sua idade?",
      inputType: "number",
    },
    {
      question: "Qual é o seu sexo?",
      options: ["Masculino", "Feminino"],
    },
    {
      question: "Você pratica exercícios regularmente?",
      options: ["Sim", "Não"],
    },
    {
      question: "Qual é o seu objetivo com a dieta?",
      options: ["Perda de peso", "Ganho de massa muscular"],
    },
    {
      question: "Qual é a sua altura?",
      inputType: "number",
    },
    {
      question: "Qual é o seu peso?",
      inputType: "number",
    },
    {
      question: "Qual é a sua meta de perda de peso?",
      inputType: "number",
    },
    {
      question: "Preferências alimentares e restrições dietéticas",
      options: [
        "Vegetarianismo",
        "Veganismo",
        "Intolerância alimentar",
        "Alergias",
        "Outras restrições",
        "Nenhuma",
      ],
    },
    {
      question: "Qual é o seu nível de atividade?",
      options: ["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo", "Extremamente ativo"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent, option: string) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const updatedAnswers = [...answers, option];
      setAnswers(updatedAnswers);

      if (currentQuestionIndex === questions.length - 1) {
        setQuestionnaireCompleted(true);

        const formattedAnswers = updatedAnswers.filter(
          (answer, index) => !!questions[index].inputType || answer !== ""
        );
        const combinedText = `Eu tenho entre: ${formattedAnswers[0]} sou do sexo: ${formattedAnswers[1]} pratico exercícios: ${formattedAnswers[2]} e preciso de uma dieta para: ${formattedAnswers[3]}. Poderia me informar uma dieta com opções de alimentos entre cada refeição ?`;

        const response = await api.post(
          "http://localhost:8000/api/questions/",
          {
            question: combinedText,
            idade: formattedAnswers[0],
            sexo: formattedAnswers[1],
            pratico_exercicio: formattedAnswers[8],
            objetivo_dieta: formattedAnswers[3],
            altura: formattedAnswers[4],
            peso: formattedAnswers[5],
            perda_peso: formattedAnswers[6],
            preferencias_restricoes: formattedAnswers[7],


          }
        );

        setApiResponse(response.data.answer);

        if (response.data.answer) {
          history.push("/graph");
        }
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {!questionnaireCompleted ? (
        <Card>
          <QuestionContainer>
            <Question>
              {questions[currentQuestionIndex].question}
              {questions[currentQuestionIndex].question ===
                "Qual é a sua altura?" && (
                <ExampleText>(ex.: 1.70)</ExampleText>
              )}
              {questions[currentQuestionIndex].question ===
                "Qual é o seu peso?" && <ExampleText>(ex.: 69.2)</ExampleText>}
            </Question>
            {questions[currentQuestionIndex].inputType ? (
              <Input
                type={questions[currentQuestionIndex].inputType}
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                required
              />
            ) : (
              <ButtonContainer>
                {questions[currentQuestionIndex].options!.map((option) => (
                  <OptionButton
                    key={option}
                    onClick={(e) => handleSubmit(e, option)}
                  >
                    {option}
                  </OptionButton>
                ))}
              </ButtonContainer>
            )}
            {questions[currentQuestionIndex].inputType === "number" && (
              <NextButton
                onClick={(e) => {
                  if (selectedAnswer) {
                    handleSubmit(e, selectedAnswer);
                    setSelectedAnswer("");
                  }
                }}
                disabled={!selectedAnswer}
              >
                Próximo
              </NextButton>
            )}
          </QuestionContainer>
        </Card>
      ) : (
        <Card>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <ResultContainer>
              <ResultText>Sua dieta foi gerada!</ResultText>
              {apiResponse && (
                <>
                  <ResultAnswer>Resposta: {apiResponse}</ResultAnswer>
                  {/* <Link to="/graph">
                    <ViewGraphButton>Ver Gráfico</ViewGraphButton>
                  </Link> */}
                </>
              )}
            </ResultContainer>
          )}
        </Card>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
`;

const Question = styled.h2`
  margin-bottom: 20px;
  margin-top: -20px;
  font-family: "Arial", sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const OptionButton = styled.button`
  background-color: #4caf;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  margin-bottom: 10px;

  &:hover {
    background-color: #45a;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: "Arial", sans-serif;
`;

const NextButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  margin-top: 10px;

  &:hover {
    background-color: #45a544;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ExampleText = styled.span`
  font-size: 12px;
  color: #888;
`;

const LoadingIndicator = styled(BeatLoader)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
`;

const ResultText = styled.h2`
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
`;

const ResultAnswer = styled.p`
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
`;

const ViewGraphButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;

  &:hover {
    background-color: #45a544;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

export default QuestionForm;
