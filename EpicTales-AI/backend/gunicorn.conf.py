# Gunicorn configuration for production hosting
# Optimized for memory efficiency and performance

import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
backlog = 2048

# Worker processes
workers = min(4, (multiprocessing.cpu_count() * 2) + 1)
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
preload_app = True
timeout = 120
keepalive = 2

# Memory management
max_worker_memory = 512  # MB
memory_limit = 512 * 1024 * 1024  # 512MB in bytes

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "epictales-ai"

# Server mechanics
daemon = False
pidfile = None
tmp_upload_dir = None

# SSL (if needed)
keyfile = None
certfile = None

# Worker lifecycle
def when_ready(server):
    """Called just after the server is started."""
    server.log.info("EpicTales AI server is ready. Listening on: %s", server.address)

def worker_int(worker):
    """Called just after a worker has been killed by a signal."""
    worker.log.info("Worker received INT or QUIT signal")

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    pass

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    worker.log.info("Worker spawned (pid: %s)", worker.pid)

def worker_abort(worker):
    """Called when a worker process is killed by a signal."""
    worker.log.info("Worker aborted (pid: %s)", worker.pid)
