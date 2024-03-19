import templayed from "../../utils/templayed";

const collectionFunctions = async ({
  collection: {
    data: collection,
    model: { name: modelName },
  },
  property: [{ kind: propertyKind, name: propertyName }],
  upsert,
  expression,
  variables,
}) => {
  if (variables.map((vars) => vars["key"]).includes("property")) {
    throw Error("property is a reserved key name");
  }

  if (!collection || collection.length === 0) {
    return { as: [] };
  }

  const variableMap = variables.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.key]: currentValue.value,
    }),
    {},
  );

  const newCollection = collection.map((record) => {
    // Used variable inside text expression
    const property = record[propertyName];

    return {
      ...record,
      [propertyName]: eval(`${templayed(expression)(variableMap)}`),
    };
  });

  if (upsert) {
    console.log("Upserting collection..");
    const queryName = `upsertMany${modelName}`;

    const mutation = `
      mutation {
        ${queryName}(input: $input) {
          id
        }
      }
    `;

    const { errors } = await gql(mutation, {
      input: newCollection,
    });

    if (errors) {
      throw errors;
    }
  }

  return { out: newCollection };
};

export default collectionFunctions;
