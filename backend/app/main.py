from __future__ import annotations

import json
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.db.session import get_db
from backend.app.models.character import Character as CharacterModel
from backend.app.schemas.character import CharacterCreate, CharacterRead, CharacterUpdate

settings = get_settings()
app = FastAPI(title=settings.app_name)


@app.get("/api/data/classes")
def read_classes():
    data_dir = Path(__file__).resolve().parents[2] / "scrapers" / "output" / "data" / "classes"
    return _load_data_dir(data_dir)


@app.get("/api/data/feats")
def read_feats():
    data_dir = Path(__file__).resolve().parents[2] / "scrapers" / "output" / "data" / "feats"
    return _load_data_dir(data_dir)


def _load_data_dir(path: Path):
    if not path.exists():
        return []
    payload = []
    for entry in sorted(path.glob("*.json")):
        payload.append(json.loads(entry.read_text()))
    return payload


async def _get_current_user_id() -> str:
    return "00000000-0000-0000-0000-000000000001"


@app.post("/api/characters", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
async def create_character(character_in: CharacterCreate, db: AsyncSession = Depends(get_db), user_id: str = Depends(_get_current_user_id)):
    stmt = CharacterModel(
        user_id=user_id,
        name=character_in.name,
        data=character_in.data,
    )
    db.add(stmt)
    await db.commit()
    await db.refresh(stmt)
    return stmt


@app.get("/api/characters/{character_id}", response_model=CharacterRead)
async def get_character(character_id: str, db: AsyncSession = Depends(get_db), user_id: str = Depends(_get_current_user_id)):
    result = await db.get(CharacterModel, character_id)
    if result is None or result.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return result


@app.put("/api/characters/{character_id}", response_model=CharacterRead)
async def update_character(character_id: str, payload: CharacterUpdate, db: AsyncSession = Depends(get_db), user_id: str = Depends(_get_current_user_id)):
    instance = await db.get(CharacterModel, character_id)
    if instance is None or instance.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    if payload.name:
        instance.name = payload.name
    if payload.data:
        instance.data = payload.data
    await db.commit()
    await db.refresh(instance)
    return instance
