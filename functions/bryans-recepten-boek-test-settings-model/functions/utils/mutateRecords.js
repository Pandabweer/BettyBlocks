async function deleteManyQuery(modelName, ids) {
  const { errors } = await gql(
    `mutation($input: ${modelName}Input) {
      deleteMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: { ids } },
  );
  if (errors) {
    throw errors;
  }
}

export default deleteManyQuery;
