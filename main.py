import os
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_HEALTH_URL = "http://127.0.0.1:8000"
BACKEND_OPEN_URL = "http://127.0.0.1:8000/docs"


def get_backend_python_executable() -> str:
    windows_venv_python = ROOT_DIR / ".venv" / "Scripts" / "python.exe"
    unix_venv_python = ROOT_DIR / ".venv" / "bin" / "python"

    if windows_venv_python.exists():
        return str(windows_venv_python)
    if unix_venv_python.exists():
        return str(unix_venv_python)

    return sys.executable


def start_backend() -> subprocess.Popen:
    return subprocess.Popen(
        [
            get_backend_python_executable(),
            "-m",
            "uvicorn",
            "main:app",
            "--reload",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
        ],
        cwd=str(BACKEND_DIR),
    )


def start_frontend() -> subprocess.Popen:
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    return subprocess.Popen([npm_cmd, "start"], cwd=str(FRONTEND_DIR))


def open_backend_in_browser_when_ready(
    backend_process: subprocess.Popen,
    health_url: str = BACKEND_HEALTH_URL,
    open_url: str = BACKEND_OPEN_URL,
    timeout: int = 20,
) -> None:
    deadline = time.time() + timeout

    while time.time() < deadline:
        if backend_process.poll() is not None:
            return

        try:
            with urlopen(health_url, timeout=1):
                webbrowser.open(open_url, new=2)
                return
        except URLError:
            time.sleep(0.5)


def stop_process(process: subprocess.Popen) -> None:
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()


if __name__ == "__main__":
    backend_process = start_backend()
    frontend_process = start_frontend()

    open_backend_in_browser_when_ready(backend_process)
    

    try:
        while True:
            if backend_process.poll() is not None:
                raise RuntimeError("Backend process exited")
            if frontend_process.poll() is not None:
                raise RuntimeError("Frontend process exited")
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        stop_process(frontend_process)
        stop_process(backend_process)