

# Run and deploy your app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend Setup (Flask)

**Prerequisites:** Python 3.8+

1. Navigate to the backend directory:
   `cd backend`

2. Create a virtual environment:
   `python -m venv venv`

3. Activate the virtual environment:
   - Windows (PowerShell): `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   `pip install -r requirements.txt`

5. Run the server:
   `python app.py`

The backend will start at `http://127.0.0.1:5000`.

