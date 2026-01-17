import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type ClassEntry = {
  id: string;
  level: number;
};

type EquipmentEntry = {
  id: string;
  notes?: string;
};

type ClassData = {
  id: string;
  name: string;
  progression: {
    bab: number;
    saves: {
      fortitude: number;
      reflex: number;
      will: number;
    };
  };
};

const classDefinitions: Record<string, ClassData> = {
  wizard: {
    id: "wizard",
    name: "Wizard",
    progression: {
      bab: 0.5,
      saves: {
        fortitude: 0,
        reflex: 0,
        will: 2
      }
    }
  },
  fighter: {
    id: "fighter",
    name: "Fighter",
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 0
      }
    }
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 0
      }
    }
  },
  abjurant_champion: {
    id: "abjurant_champion",
    name: "Abjurant Champion",
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 1
      }
    }
  }
};

export const classCatalog = Object.values(classDefinitions);

type CharacterState = {
  abilities: Record<AbilityKey, number>;
  selectedClasses: ClassEntry[];
  selectedFeats: string[];
  equipment: EquipmentEntry[];
  skillRanks: Record<string, number>;
  getAbilityModifier: (ability: AbilityKey) => number;
  getTotalBAB: () => number;
  getSave: (type: "fortitude" | "reflex" | "will") => number;
  setAbility: (ability: AbilityKey, value: number) => void;
  addClass: (classId: string) => void;
  removeClass: (classId: string) => void;
  setClassLevel: (classId: string, level: number) => void;
  addFeat: (featId: string) => void;
  removeFeat: (featId: string) => void;
  addEquipment: (name: string) => void;
  removeEquipment: (id: string) => void;
};

const calculateBAB = (progression: ClassData["progression"], levels: number) => {
  return Math.floor(progression.bab * levels);
};

export const useCharacterStore = create<CharacterState>()(
  immer((set, get) => ({
    abilities: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    },
    selectedClasses: [{ id: "wizard", level: 1 }],
    selectedFeats: [],
    equipment: [],
    skillRanks: {},
    getAbilityModifier: (ability) => {
      const score = get().abilities[ability];
      return Math.floor((score - 10) / 2);
    },
    getTotalBAB: () => {
      const classes = get().selectedClasses;
      return classes.reduce((acc, cls) => {
        const definition = classDefinitions[cls.id];
        if (!definition) return acc;
        return acc + calculateBAB(definition.progression, cls.level);
      }, 0);
    },
    getSave: (type) => {
      const classes = get().selectedClasses;
      return classes.reduce((acc, cls) => {
        const definition = classDefinitions[cls.id];
        if (!definition) return acc;
        return acc + definition.progression.saves[type] * cls.level;
      }, 0);
    },
    setAbility: (ability, value) =>
      set((draft) => {
        draft.abilities[ability] = value;
      }),
    addClass: (classId) =>
      set((draft) => {
        const existing = draft.selectedClasses.find((entry) => entry.id === classId);
        if (existing) {
          existing.level = Math.min(existing.level + 1, 20);
        } else {
          draft.selectedClasses.push({ id: classId, level: 1 });
        }
      }),
    removeClass: (classId) =>
      set((draft) => {
        draft.selectedClasses = draft.selectedClasses.filter((entry) => entry.id !== classId);
      }),
    setClassLevel: (classId, level) =>
      set((draft) => {
        const existing = draft.selectedClasses.find((entry) => entry.id === classId);
        if (existing) {
          existing.level = Math.max(1, Math.min(level, 20));
        }
      }),
    addFeat: (featId) =>
      set((draft) => {
        if (!draft.selectedFeats.includes(featId)) {
          draft.selectedFeats.push(featId);
        }
      }),
    removeFeat: (featId) =>
      set((draft) => {
        draft.selectedFeats = draft.selectedFeats.filter((id) => id !== featId);
      }),
    addEquipment: (name) =>
      set((draft) => {
        draft.equipment.push({ id: `${name}-${Date.now()}`, notes: "" });
      }),
    removeEquipment: (id) =>
      set((draft) => {
        draft.equipment = draft.equipment.filter((entry) => entry.id !== id);
      })
  }))
);
