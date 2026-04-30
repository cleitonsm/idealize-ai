import os

import uvicorn

from idealize_ai.adapters.inbound.http.app import create_app

app = create_app()


def run() -> None:
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("idealize_ai.main:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    run()
