#!/usr/bin/env python3
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess
from pathlib import Path
import hashlib

def hash_file(file_path):
    """Return SHA256 hash of a file."""
    h = hashlib.sha256()
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def build_frontend():
    """Run npm install (if needed) and npm run build inside the client folder."""
    client_dir = Path(__file__).resolve().parent / "client"
    lock_file = client_dir / "package-lock.json"
    hash_file_path = client_dir / ".package-lock.hash"

    # Check if package-lock.json changed
    need_install = True
    if lock_file.exists():
        new_hash = hash_file(lock_file)
        if hash_file_path.exists():
            old_hash = hash_file(hash_file_path)
            if old_hash == new_hash:
                need_install = False  # No change in lock file

    if need_install:
        print("📦 Installing npm dependencies...")
        subprocess.run(["npm", "install"], cwd=client_dir, check=True)
        # Save new hash
        with open(hash_file_path, "wb") as f:
            f.write(lock_file.read_bytes())
    else:
        print("✅ package-lock.json unchanged — skipping npm install.")

    # Always build
    print("⚡ Building frontend with Vite...")
    subprocess.run(["npm", "run", "build"], cwd=client_dir, check=True)
    print("✅ Frontend build complete!")

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'galli_connect.settings')

    # Only build when running server (you can add other commands here)
    if len(sys.argv) > 1 and sys.argv[1] in ("runserver", "collectstatic"):
        try:
            build_frontend()
        except subprocess.CalledProcessError as e:
            print(f"❌ Frontend build failed: {e}")
            sys.exit(1)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
