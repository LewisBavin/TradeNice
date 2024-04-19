export const passID = (event, func=undefined) => {
    console.log(event.target.id)
  return !func ? event.target.id : func(event.target.id)
};

