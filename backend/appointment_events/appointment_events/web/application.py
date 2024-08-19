from importlib import metadata

from fastapi import FastAPI
from fastapi.responses import UJSONResponse

from appointment_events.log import configure_logging
from appointment_events.web.api.router import api_router
from appointment_events.web.lifespan import lifespan_setup
from fastapi.middleware.cors import CORSMiddleware


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    configure_logging()
    app = FastAPI(
        title="appointment_events",
        version=metadata.version("appointment_events"),
        lifespan=lifespan_setup,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],  # Allow only this origin
        allow_credentials=True,
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers
    )

    # Main router for the API.
    app.include_router(router=api_router, prefix="/api")

    return app
