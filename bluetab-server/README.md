# Flask API with Docker

This is a Flask API that processes Excel files and runs in a Docker container.

## Requirements

- Docker
- Docker Compose (optional)

## Running the Application

### Using Docker

1. Build the Docker image:
```bash
docker build -t flask-api .
```

2. Run the container:
```bash
docker run -p 3005:3005 flask-api
```

### Development Mode

To run the application in development mode without Docker:

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:3005`

## Features

- Upload and process Excel files
- Date range filtering
- Excel template processing
- Automatic file cleanup
- Flash messages for user feedback 