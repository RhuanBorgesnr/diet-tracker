import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from copy import deepcopy
from django.utils import timezone
from .models import Calories, Question
from .serializers import ProgressChartSerializer, QuestionSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import NotFound


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id', 'user']

    def perform_create(self, serializer):
        question = serializer.validated_data['question']
        idade = int(self.request.data.get('idade'))
        altura = float(self.request.data.get('altura'))
        peso = float(self.request.data.get('peso'))
        perda_peso = float(self.request.data.get('perda_peso'))
        genero = self.request.data.get('sexo')
        activity_level = self.request.data.get('pratico_exercicio')
        imc = self._calc_imc(peso, altura)
        tmb = self._calc_tmb(peso, altura, idade, genero)
        maintain_weight, mild_weight_loss, weight_loss, extreme_weight_loss  = self._calculate_calories(peso, altura, idade, genero, activity_level)
        headers = self._build_headers()
        data = self._build_data(question)
        try:
            imc_format = float(imc) / 10000
            imc_formatado = format(imc_format, '.1f')
            response = self._send_request(headers, data)
            answer = self._get_answer(response)
            calorie_data = Calories.objects.create(
            maintain_weight_calories=maintain_weight,
            mild_weight_loss=mild_weight_loss,
            wigth_loss=weight_loss,
            extreme_weight_loss=extreme_weight_loss,
        )
            
            instance, created = serializer.save(
                answer=answer,
                tmb=tmb,
                imc=imc_formatado,
                user=self.request.user,
                age=idade,
                weight=peso,
                weight_loss=perda_peso,
                height=altura,
                activity_level=activity_level,
                calorie_data=calorie_data,

            )
            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(
                {"answer": instance.answer, "imc": instance.imc},
                status=status_code
            )
        except Exception as e:
            return self._handle_error(str(e))

    def _build_headers(self):
        return {
            "Authorization": f"Bearer {'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'}",
            "Content-Type": "application/json"
        }

    def _build_data(self, question):
        return {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": question}
            ],
            "max_tokens": 2000,
            "n": 1,
            "stop": None,
            "temperature": 0.7
        }

    def _calc_imc(self, peso, altura):
        if peso <= 0 or altura <= 0:
            raise ValueError("Peso e altura devem ser valores positivos.")

        if altura < 1:
            altura *= 100

        altura_metros = altura / 100.0
        imc = peso / (altura_metros ** 2)
        return imc

    def _calc_tmb(self, peso, altura, idade, genero):
        if genero == 'Masculino':
            tmb = round(66 + (13.75 * peso) + (5 * altura) - (6.75 * idade), 2)
        elif genero == 'Feminino':
            tmb = round(655 + (9.56 * peso) + (1.85 * altura) - (4.68 * idade), 2)
        else:
            raise ValueError("Gênero inválido. Escolha 'masculino' ou 'feminino'.")
        return tmb
        
    def _calculate_calories(self, peso, altura, idade, genero, activity_level):
        if genero == "Masculino":
            bmr = 10 * peso + 6.25 * (altura * 100) - 5 * idade + 5
        elif genero == "Feminino":
            bmr = 10 * peso + 6.25 * (altura * 100) - 5 * idade - 161
        else:
            raise ValueError("Gênero inválido. Escolha 'masculino' ou 'feminino'.")

        if activity_level == "Sedentário":
            calories = bmr * 1.2
        elif activity_level == "Levemente ativo":
            calories = bmr * 1.375
        elif activity_level == "Moderadamente ativo":
            calories = bmr * 1.55
        elif activity_level == "Muito ativo":
            calories = bmr * 1.725
        elif activity_level == "Extremamente ativo":
            calories = bmr * 1.9
        else:
            raise ValueError("Nível de atividade inválido. Escolha 'sedentary', 'lightly active', 'moderately active', 'very active' ou 'extra active'.")
        maintain_weight = calories
        mild_weight_loss = calories - 250
        weight_loss = calories - 500
        extreme_weight_loss = calories - 1000

        return maintain_weight, mild_weight_loss, weight_loss, extreme_weight_loss

    def _send_request(self, headers, data):
        url = "https://api.openai.com/v1/chat/completions"
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response

    def _get_answer(self, response):
        response_data = response.json()
        return response_data['choices'][0]['message']['content']

    def _handle_error(self, error_message):
        error_response = {"error": error_message}
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def group_graph(self, request):
        user_id = int(request.GET.get('user'))
        questions = Question.objects.filter(user=user_id)

        serializer = ProgressChartSerializer(
            questions, many=True, context={'action': 'group_graph'})
        formatted_data = serializer.data

        return Response(formatted_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def calculate_metrics(self, request):
        user_id = int(request.GET.get('user'))
        try:
            queryset = Question.objects.filter(user=user_id)
            if queryset:
                question = queryset.latest('id')
                imc = question.imc
                tmb = question.tmb  # Retrieve tmb from the latest Question instance
                activity_level = question.activity_level
                answer = question.answer
                calorie_data = question.calorie_data
                calorie_data_dict = {
                    'Manter o peso': calorie_data.maintain_weight_calories,
                    'Perda de peso leve': calorie_data.mild_weight_loss,
                    'Perda de peso': calorie_data.wigth_loss,
                    'Perda de peso extrema': calorie_data.extreme_weight_loss,
                }

                # Calculate daily macronutrient recommendations using the retrieved tmb value
                daily_macros = self.calculate_daily_macros(tmb, activity_level)

                response_data = {
                    "imc": imc,
                    "tmb": tmb,
                    "answer": answer,
                    "calorie_data": calorie_data_dict,
                    "daily_macros": daily_macros,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return self._handle_error("Question not found for the given user ID.")
        except ValueError as e:
            return self._handle_error(str(e))


    @action(detail=False, methods=['POST'])
    def create_with_same_data(self, request):
        user_id = request.data.get('user')
        weight = float(request.data.get('weight'))
        try:
            last_question = Question.objects.filter(
                user=user_id).order_by('-id').first()
            one_month_ago = timezone.now() - timezone.timedelta(days=30)
            if last_question.created_at > one_month_ago:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={'error': 'A cada mês, realizamos uma avaliação do seu progresso. Por favor, aguarde esse período para nos informar o seu peso atual.'}
                )
            new_question = deepcopy(last_question)
            new_question.id = None
            new_question.weight = weight
            new_question.imc = self._calc_imc(weight, new_question.height)
            new_question.save()
            
            
            serializer = self.get_serializer(new_question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Question.DoesNotExist:
            return self._handle_error("Question not found for the given user ID.")
        except ValueError as e:
            return self._handle_error(str(e))

    @action(detail=False, methods=['GET'])
    def get_diet(self, request):
        user = request.GET.get('user')
        answer = self.queryset.filter(user=user).first()
        if not answer:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Não há dados suficientes para gerar uma dieta.'})
        answers = answer.answer
        meals = answers.split('\n\n')
        formatted_data = []

        for meal in meals:
            meal_data = meal.split(':\n')
            if len(meal_data) == 2:
                refeicao = meal_data[0]
                descricao = meal_data[1].strip()
                formatted_item = {
                    'refeicao': refeicao,
                    'descricao': descricao
                }
                formatted_data.append(formatted_item)
            elif len(meal_data) == 1:
                refeicao = meal_data[0]
                descricao = ""
                formatted_item = {
                    'refeicao': refeicao,
                    'descricao': descricao
                }
                formatted_data.append(formatted_item)

        return Response(formatted_data)

    def calculate_daily_macros(self, tmb, activity_level):
        activity_multipliers = {
            "Sedentário": 1.2,
            "Levemente ativo": 1.375,
            "Moderadamente ativo": 1.55,
            "Muito ativo": 1.725,
            "Extremamente ativo": 1.9,
        }

        activity_multiplier = activity_multipliers.get(activity_level, 1.2)
        tdee = tmb * activity_multiplier

        
        carb_ratio = 0.4  # 40% of daily calories from carbohydrates
        protein_ratio = 0.3  # 30% of daily calories from protein
        fat_ratio = 0.3  # 30% of daily calories from fat

        calories_from_carbs = carb_ratio * tdee
        calories_from_protein = protein_ratio * tdee
        calories_from_fat = fat_ratio * tdee

        # Convert calories to grams (1 gram of carbohydrates/protein = 4 calories, 1 gram of fat = 9 calories)
        carbs_grams = calories_from_carbs / 4
        protein_grams = calories_from_protein / 4
        fat_grams = calories_from_fat / 9

        return {
            "calories": tdee,
            "carbs": carbs_grams,
            "protein": protein_grams,
            "fat": fat_grams,
        }
        