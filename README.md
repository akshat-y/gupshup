# Test Case Management Tool

- Frontend : Vanilla JS, HTML, CSS
- Backend : FastAPI
- Database : Sqlite

## Installation

### Backend

Run following commands from terminal

```sh
cd project-location/backend
pip3 install -r requirements.txt
```

Start the server

```sh
fastapi dev main.py
```

> Note: Make sure the server is running on http://127.0.0.1:8000.
> If not, update the `window.api_link` variable in `frontend/index.js` to server link


### Frontend

1) Open `frontned` folder in VS Code 
(Note: Don't open the parent folder containing both backend and frontend folder)
2) Install `Live Server` extension in VS Code
https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
3) Start the server using Liver Server using `Go Live` option in bottom of VS Code

> Note: Make sure the frontend server is running on http://127.0.0.1:5500/.
> If not, update the `allow_origins` field in `backend/main.py` (line 18) to live server link

The list of available users can be found in `backend/config.py` file
| Username | Password | Role |
| ------ | ------ | ------ |
| akshat-yadav | akshatpassword | tester
| test-user | testpassword | tester
| admin | adminpassword | admin