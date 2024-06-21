import queryRecords from "../../utils/queryRecords";

const deleteAllWithLimit = async ({ model: { name: modelName }, amountToDelete, batchSize, filter, filterVars }) => {
  if (amountToDelete <= 0 && amountToDelete != null) {
    throw new Error("Delete amount cannot be lower than or equal to 0");
  }
  if (batchSize <= 0) {
    throw new Error("Batch size cannot be lower than or equal to 0");
  }

  const recCount = await queryRecords(modelName, filter, filterVars, 1, 0, true);
  const realAmtToDelete = amountToDelete ? (amountToDelete > recCount ? recCount : amountToDelete) : recCount;
  const batchesCount = Math.ceil(realAmtToDelete / batchSize);

  for (let batchIndex = 1; batchIndex - 1 < batchesCount; batchIndex += 1) {
    const collectionAmtToDelete = batchIndex * batchSize > realAmtToDelete ? realAmtToDelete % batchSize : batchSize;
    const collectionBatchCount = Math.ceil(collectionAmtToDelete / 200);

    let ids = [];
    for (let index = 1; index - 1 < collectionBatchCount; index += 1) {
      const take = index * 200 > collectionAmtToDelete ? collectionAmtToDelete % 200 : 200;
      const skip = (index - 1) * 200;
      const queryResult = await queryRecords(modelName, filter, filterVars, take, skip);

      ids.push(...queryResult.map((item) => item.id));
    }

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
