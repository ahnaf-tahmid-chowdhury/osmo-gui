import os
import webview
import subprocess
import time

django = subprocess.Popen(
    [".env/bin/python3", "manage.py", "runserver", "127.0.0.1:8900"], )
time.sleep(1)
webview.create_window(
    "Osmocom",
    "http://localhost:8900/hlr/",
    confirm_close=True,
    width=1366,
    height=768,
    min_size=(800, 600),
)
webview.start()
django.terminate()

if __name__ == "__main__":
    pass
