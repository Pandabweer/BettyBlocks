function collectionSum(collection, propertyName) {
  return collection.reduce(
    (accumulator, record) => accumulator + parseFloat(record[propertyName]),
    0,
  );
}

const collectionFunctions = async ({
  collection: { data: collection },
  property: [{ kind: propertyKind, name: propertyName }],
  func,
}) => {
  switch (func) {
    case "Sum":
      if (
        ["BOOLEAN", "DECIMAL", "INTEGER", "PRICE", "SERIAL"].includes(
          propertyKind,
        )
      ) {
        return { out: collectionSum(collection, propertyName) };
      } else {
        throw Error(`${propertyKind} not summable`);
      }
    case "Count":
      return { out: collection.length };
    case "Average":
      return {
        out: collectionSum(collection, propertyName) / collection.length,
      };
    default:
      throw Error("No function passed");
  }
};

export default collectionFunctions;
