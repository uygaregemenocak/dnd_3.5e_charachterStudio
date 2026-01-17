from __future__ import annotations

from typing import Any, Dict

from pydantic import BaseModel, Field


class CharacterBase(BaseModel):
    name: str = Field(..., min_length=1)
    data: Dict[str, Any]


class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(BaseModel):
    name: str | None
    data: Dict[str, Any] | None


class CharacterRead(CharacterBase):
    id: str
    user_id: str

    class Config:
        orm_mode = True
