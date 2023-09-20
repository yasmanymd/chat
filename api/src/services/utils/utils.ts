export const generateId = () => {
  let result = Math.random().toString().slice(2,11);
  result = result.substring(0, 3) + '-' + result.substring(3, 6) + '-' + result.substring(6, 9);
  return result;
};