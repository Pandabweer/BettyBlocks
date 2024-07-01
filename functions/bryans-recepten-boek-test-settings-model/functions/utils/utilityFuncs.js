import templayed from "./templayed";

function stringMap(text, map) {
  const mapVars = map.reduce((previousValue, currentValue) => {
    previousValue[currentValue.key] = currentValue.value;
    return previousValue;
  }, {});

  return templayed(text || "")(mapVars);
}

export default stringMap;
