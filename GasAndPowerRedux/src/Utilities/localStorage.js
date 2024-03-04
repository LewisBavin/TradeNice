export const setStore = (key, state) => {
    localStorage.setItem(key, JSON.stringify(state));
  };
  
  export const getStore = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };