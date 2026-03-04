setup:
github exlcudes .venv and node_modules from version control so you need to create them locally 

creating .venv:
create virtual environment in root directory using requirements.txt 
-(ctrl+shift+p, python:create environment, venv, python, .venv, install project dependencies, requirements.txt)

creating node_modules:#
change directory to frontend, and install dependancies from package.json
-cd frontend, npm install


testing:
running main.py in the root directory runs the frontend and backend, opening new browser tabs

run and debug can be used to test the backend seperately 
"cd frontend" and then "npm run dev" can be used to test the frontend seperately

