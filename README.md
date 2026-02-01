<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rl8k2ITkM3Q6OambpT1rx6MB760eYtfz

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

