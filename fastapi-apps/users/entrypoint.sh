#!/bin/sh

alembic revision --autogenerate -m "create tables"

alembic upgrade head

exec "$@"