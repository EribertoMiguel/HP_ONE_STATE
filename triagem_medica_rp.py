#!/usr/bin/env python3
"""Servidor local para o Sistema de Triagem Médica RP."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import threading
import webbrowser

HOST = "127.0.0.1"
PORT = 8000
APP_DIR = Path(__file__).resolve().parent

class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def log_message(self, format, *args):
        pass

def main():
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    url = f"http://{HOST}:{PORT}/"
    print("=" * 56)
    print("HP DE FORTUNA — TRIAGEM MÉDICA RP")
    print(f"Aplicação aberta em: {url}")
    print("Para encerrar, pressione Ctrl+C nesta janela.")
    print("=" * 56)
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando o sistema...")
    finally:
        server.server_close()

if __name__ == "__main__":
    main()
