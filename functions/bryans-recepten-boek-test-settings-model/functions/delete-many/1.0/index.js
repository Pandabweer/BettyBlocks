import queryRecords from "../../utils/queryRecords";

const deleteAllWithLimit = async ({
  model: { name: modelName },
  numberOfRecordsToDelete,
  filter,
  filterVars,
}) => {
  if (numberOfRecordsToDelete <= 0 && numberOfRecordsToDelete != null) {
    throw new Error("Amount of records cannot be lower than or equal to 0");
  }

  const totalCount = await queryRecords(modelName, filter, filterVars, 1, true);
  const realAmtToDelete = numberOfRecordsToDelete
    ? numberOfRecordsToDelete > totalCount
      ? totalCount
      : numberOfRecordsToDelete
    : totalCount;
  const batchesCount = Math.ceil(realAmtToDelete / 200);

  for (let index = 1; index - 1 < batchesCount; index += 1) {
    const take = index * 200 > realAmtToDelete ? realAmtToDelete % 200 : 200;
    const queryResult = await queryRecords(modelName, filter, filterVars, take);
    const ids = queryResult.map((item) => item.id);
    const deleteMutation = `
      mutation($input: ${modelName}Input) {
        deleteMany${modelName}(input: $input) {
          id
        }
      }
    `;

    const { errors } = await gql(deleteMutation, { input: { ids } });
    if (errors) {
      throw errors;
    }
  }
  return {
    result: `${realAmtToDelete} records from ${modelName} have been deleted`,
  };
};

export default deleteAllWithLimit;
