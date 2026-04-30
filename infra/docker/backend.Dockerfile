FROM python:3.12-slim

WORKDIR /workspace

COPY packages/contracts/python /workspace/packages/contracts/python
RUN pip install --no-cache-dir -e /workspace/packages/contracts/python

COPY apps/backend /workspace/apps/backend
WORKDIR /workspace/apps/backend
RUN pip install --no-cache-dir -e ".[dev]"

ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "idealize_ai.main:app", "--host", "0.0.0.0", "--port", "8000"]
