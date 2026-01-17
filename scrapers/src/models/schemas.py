from __future__ import annotations

from enum import Enum
from pathlib import Path
from typing import Dict, List, Literal, Optional, Sequence, Union

from pydantic import BaseModel, Field, root_validator, validator


class SaveProgression(str, Enum):
    poor = "poor"
    good = "good"


class SpellcastingType(str, Enum):
    prepared = "prepared"
    spontaneous = "spontaneous"
    none = "none"


class ClassLevel(BaseModel):
    level: int = Field(..., ge=1, le=20)
    bab: Union[int, float]
    fort: int
    ref: int
    will: int
    spells_per_day: Optional[List[int]] = None
    features: List[str] = Field(default_factory=list)

    @validator("spells_per_day")
    def validate_spells_per_day(cls, value: Optional[List[int]]) -> Optional[List[int]]:
        if value is None:
            return value
        if len(value) != 10:
            raise ValueError("spells_per_day must have 10 entries (levels 0-9)")
        return value


class ClassProgression(BaseModel):
    bab: SaveProgression
    saves: Dict[Literal["fortitude", "reflex", "will"], SaveProgression]
    levels: Sequence[ClassLevel]
    spellcasting_progression: Optional[Literal["major", "minor", "none"]] = None


class SpellcastingInfo(BaseModel):
    type: SpellcastingType
    ability: Optional[Literal["str", "dex", "con", "int", "wis", "cha"]] = None
    spell_list: Optional[str] = None
    spellbook_required: bool = False
    cantrips_known: Union[str, int, None] = None
    extra_prepared: Optional[str] = None

    @root_validator
    def require_ability_for_spellcasters(cls, values: Dict[str, Optional[object]]) -> Dict[str, Optional[object]]:
        if values.get("type") != SpellcastingType.none and not values.get("ability"):
            raise ValueError("Spellcasting classes must provide an ability score to use")
        return values


class ClassSchema(BaseModel):
    id: str
    name: str
    type: Literal["base", "prestige", "monster"] = "base"
    source: str
    hit_die: Literal[4, 6, 8, 10, 12]
    skill_points_per_level: int
    class_skills: List[str]
    progression: ClassProgression
    spellcasting: Optional[SpellcastingInfo]
    prerequisites: Dict[str, Union[int, str, List[str], None]] = Field(default_factory=dict)

    @validator("class_skills", each_item=True)
    def class_skill_must_be_lowercase(cls, v: str) -> str:
        if " " in v:
            raise ValueError("Class skill keys must be snake_case identifiers")
        return v


class FeatSkillPrerequisite(BaseModel):
    skill: str
    ranks: int


class FeatPrerequisites(BaseModel):
    abilities: Dict[Literal["str", "dex", "con", "int", "wis", "cha"], int] = Field(default_factory=dict)
    skills: List[FeatSkillPrerequisite] = Field(default_factory=list)
    feats: List[str] = Field(default_factory=list)
    spellcasting: Optional[Dict[str, Union[int, str]]] = None
    other: List[str] = Field(default_factory=list)


class FeatSchema(BaseModel):
    id: str
    name: str
    source: str
    description: str
    type: Literal["general", "combat", "metamagic", "epic", "team"] = "general"
    prerequisites: FeatPrerequisites = Field(default_factory=FeatPrerequisites)
    benefit: str
    special: Optional[str]
    tags: List[str] = Field(default_factory=list)


class SpellLevelInfo(BaseModel):
    level: int = Field(..., ge=0, le=9)
    classes: List[str] = Field(default_factory=list)


class SpellSchool(str, Enum):
    abjuration = "abjuration"
    conjuration = "conjuration"
    divination = "divination"
    enchantment = "enchantment"
    evocation = "evocation"
    illusion = "illusion"
    necromancy = "necromancy"
    transmutation = "transmutation"


class SpellSavingThrow(BaseModel):
    type: Literal["fortitude", "reflex", "will", "none"]
    result: Literal["none", "partial", "half", "negates"] = "none"


class SpellSchema(BaseModel):
    id: str
    name: str
    school: SpellSchool
    descriptor: List[str] = Field(default_factory=list)
    levels: List[SpellLevelInfo]
    components: List[Literal["V", "S", "M", "F", "DF"]]
    casting_time: str
    range: str
    area: Optional[str]
    duration: str
    saving_throw: Optional[SpellSavingThrow]
    spell_resistance: bool = False
    description: str
    material_component: Optional[str]
    source: str

    @validator("levels")
    def require_at_least_one_class(cls, value: List[SpellLevelInfo]) -> List[SpellLevelInfo]:
        if not value:
            raise ValueError("Spell must be associated with at least one class level")
        return value
