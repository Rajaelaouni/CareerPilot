FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip --timeout=300 --retries=5 || true
RUN pip install --default-timeout=300 --retries=5 --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]