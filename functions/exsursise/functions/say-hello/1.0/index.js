const collectionFunction = async ({
  collection: { data: collection },
  property: [{ kind: propertyKind, name: propertyName }]
}) => {
  console.log(func)
  return {
    out: collection.reduce(
      (accumulator, record) => accumulator + parseFloat(record[propertyName]),
      0,
    ),
  };
};

export default collectionFunction;
