"""
Playwright (pytest) end-to-end tests for the PricePulse frontend.

The suite starts the Vite dev server itself, so you only need:
    pip install pytest pytest-playwright
    playwright install chromium
    pytest e2e
Set PW_CHROMIUM_PATH if you want to use an already-installed Chromium.
"""
import os
import signal
import socket
import subprocess
import time
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("E2E_PORT", "5199"))


def _wait_for_port(port: int, timeout: float = 60.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        with socket.socket() as s:
            s.settimeout(0.5)
            if s.connect_ex(("127.0.0.1", port)) == 0:
                return
        time.sleep(0.4)
    raise RuntimeError(f"Dev server did not start on port {port}")


@pytest.fixture(scope="session")
def base_url():
    proc = subprocess.Popen(
        ["npx", "vite", "--port", str(PORT), "--strictPort", "--host", "127.0.0.1"],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True,  # own process group, so the whole npx/vite tree can be stopped
    )
    try:
        _wait_for_port(PORT)
        yield f"http://127.0.0.1:{PORT}"
    finally:
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        proc.wait(timeout=10)


@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    path = os.environ.get("PW_CHROMIUM_PATH")
    if path:
        return {**browser_type_launch_args, "executable_path": path}
    return browser_type_launch_args


@pytest.fixture
def page_errors(page):
    """Collects uncaught JS errors so tests can assert the page is clean."""
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    return errors
