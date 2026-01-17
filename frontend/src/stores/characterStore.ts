import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type ClassLevel = {
  id: string;
  level: number;
};

type ClassData = {
  id: string;
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
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 0
      }
    }
  }
};

type CharacterState = {
  abilities: Record<AbilityKey, number>;
  classes: ClassLevel[];
  feats: string[];
  skillRanks: Record<string, number>;
  getAbilityModifier: (ability: AbilityKey) => number;
  getTotalBAB: () => number;
  getSave: (type: "fortitude" | "reflex" | "will") => number;
  setAbility: (ability: AbilityKey, value: number) => void;
  addClass: (classId: string, level: number) => void;
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
    classes: [{ id: "wizard", level: 1 }],
    feats: [],
    skillRanks: {},
    getAbilityModifier: (ability) => {
      const score = get().abilities[ability];
      return Math.floor((score - 10) / 2);
    },
    getTotalBAB: () => {
      const classes = get().classes;
      return classes.reduce((acc, cls) => {
        const definition = classDefinitions[cls.id];
        if (!definition) return acc;
        return acc + calculateBAB(definition.progression, cls.level);
      }, 0);
    },
    getSave: (type) => {
      const classes = get().classes;
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
    addClass: (classId, level) =>
      set((draft) => {
        draft.classes.push({ id: classId, level });
      })
  }))
);
