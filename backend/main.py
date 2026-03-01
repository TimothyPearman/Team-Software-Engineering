import uvicorn
from fastapi import FastAPI
from app.api import auth, dictionary, lesson, streak, user    # import the routers to be registered with the main app
from app.db.init_db import init_db  # import the database initialization function to ensure tables exist on startup
from fastapi.middleware.cors import CORSMiddleware

# create the fastapi application instance.
app = FastAPI(
    title="TSE backend API",
    version="1.? (i lost count)",
    summary="API for interacting with database of player data and game stats",
    description="This API allows the frontend to manage and retrieve information about player data and game stats for TSE.",
)

origins = [
    "http://localhost:3000",  # React frontend
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ensure database tables exist
try:
    init_db()
except Exception as e:
    print(f"Error initializing the database: {e}") # database is unreachable

# Register the routers with the main app.
app.include_router(auth.router)
app.include_router(dictionary.router)
app.include_router(lesson.router)
app.include_router(streak.router)
app.include_router(user.router)

# root endpoint for debugging1
@app.get("/")
async def root():
    """root endpoint for debugging"""
    return {"message": "root endpoint test"}

"""start the api"""
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

def run():
    uvicorn.run(app, host="127.0.0.1", port=8000)