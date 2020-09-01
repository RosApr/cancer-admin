export const initTableFilterConfig = (config = []) => {
  return [...config].map(({ list, placeholder, ...rest }) => {
    return rest;
  });
};

export const makeTableFilterParams = (configArray = []) => {
  return configArray.length === 0
    ? {}
    : configArray.reduce((result, { key, value }) => {
        result[key] = value;
        return result;
      }, {});
};
