import queryRecords from "../../utils/queryRecords";

const modelRecordCount = async ({
  model: { name: modelName },
  filter,
  filterVars,
}) => {
  modelCount = await queryRecords(modelName, filter, filterVars, 1, true);

  return {
    result: modelCount,
  };
};

export default modelRecordCount;
