FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p uploads templates


COPY . .

EXPOSE 3005

CMD ["gunicorn", "--bind", "0.0.0.0:3005", "app:app"]

# docker build -t flask-api .
# docker run -p 3005:3005 flask-api