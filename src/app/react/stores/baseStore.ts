import { atom, AtomEffect, DefaultValue, selector } from 'recoil';
import { localStorage } from '../lib/storage';

interface NameAndCounter {
    name: string;
    counter: number;
}

const localStorageEffect = (key: string): AtomEffect<NameAndCounter> => ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key) || { name: 'init', counter: 0 };

    setSelf(savedValue);
  
    onSet(newValue => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      }
  
      localStorage.setItem(key, newValue);
    });
};

const nameAndCounter = atom<NameAndCounter | null>({
    key: 'nameAndCounter',
    default: null,
    effects_UNSTABLE: [localStorageEffect('baseStore')],
});
  

export const baseStore = {
    nameAndCounter,
}
