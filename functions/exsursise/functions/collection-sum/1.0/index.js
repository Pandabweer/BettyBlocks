const collectionSum = async ({
  collection: { data: collection },
  property: [{ kind: propertyKind, name: propertyName }],
}) => {
  return {
    out: collection.reduce(
      (accumulator, record) => accumulator + parseFloat(record[propertyName]),
      0,
    ),
  };
};

export default collectionSum;
