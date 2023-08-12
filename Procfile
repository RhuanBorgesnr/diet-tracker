web: gunicorn backend.wsgi --log-file -
web: python api/manage.py migrate
web: cd ui && npm start


