import os
import subprocess
import sys
import time
import webbrowser
import shutil
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_HEALTH_URL = "http://127.0.0.1:8000"
BACKEND_OPEN_URL = "http://127.0.0.1:8000/docs"
FRONTEND_HEALTH_URL = "http://localhost:5173"
FRONTEND_OPEN_URL = "http://localhost:5173"


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


def get_npm_command() -> str:
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    if shutil.which(npm_cmd):
        return npm_cmd
    raise RuntimeError(
        "npm is not available in PATH. Install Node.js and restart your terminal."
    )


def ensure_frontend_dependencies() -> None:
    node_modules = FRONTEND_DIR / "node_modules"
    vite_bin = (
        FRONTEND_DIR / "node_modules" / ".bin" / ("vite.cmd" if os.name == "nt" else "vite")
    )

    # node_modules can exist in a broken or partial state; verify vite is present.
    if node_modules.exists() and vite_bin.exists():
        return

    print("Frontend dependencies not found. Running npm install...")
    subprocess.run([get_npm_command(), "install"], cwd=str(FRONTEND_DIR), check=True)


def start_frontend() -> subprocess.Popen:
    ensure_frontend_dependencies()
    npm_cmd = get_npm_command()
    return subprocess.Popen([npm_cmd, "run", "dev"], cwd=str(FRONTEND_DIR))


def open_url_in_browser(url: str) -> None:
    opened = webbrowser.open_new_tab(url)
    if opened:
        return

    if os.name == "nt":
        try:
            os.startfile(url)
            return
        except OSError:
            subprocess.Popen(["cmd", "/c", "start", "", url])


def open_in_browser_when_ready(
    process: subprocess.Popen,
    health_url: str,
    open_url: str,
    timeout: int = 20,
) -> None:
    deadline = time.time() + timeout

    while time.time() < deadline:
        if process.poll() is not None:
            return

        try:
            with urlopen(health_url, timeout=1):
                open_url_in_browser(open_url)
                return
        except (URLError, TimeoutError, OSError):
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
    try:
        frontend_process = start_frontend()
    except Exception:
        stop_process(backend_process)
        raise

    open_in_browser_when_ready(
        frontend_process,
        health_url=FRONTEND_HEALTH_URL,
        open_url=FRONTEND_OPEN_URL,
    )
    open_in_browser_when_ready(
        backend_process,
        health_url=BACKEND_HEALTH_URL,
        open_url=BACKEND_OPEN_URL,
    )
    

    exit_code = 0
    try:
        while True:
            if backend_process.poll() is not None:
                raise RuntimeError(
                    f"Backend process exited with code {backend_process.returncode}"
                )
            if frontend_process.poll() is not None:
                raise RuntimeError(
                    f"Frontend process exited with code {frontend_process.returncode}"
                )
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    except RuntimeError as exc:
        print(exc)
        if frontend_process.returncode is not None and frontend_process.returncode != 0:
            print("Tip: if frontend still fails, run 'npm install' inside frontend.")
        exit_code = 1
    finally:
        stop_process(backend_process)
        stop_process(frontend_process)
        sys.exit(exit_code)