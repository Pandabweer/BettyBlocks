import templayed from "./templayed";

async function queryRecords(
  modelName,
  filter,
  filterVars,
  take,
  count = false,
) {
  const varMap = filterVars.reduce((previousValue, currentValue) => {
    previousValue[currentValue.key] = currentValue.value;
    return previousValue;
  }, {});

  const where = filter ? `where: { ${templayed(filter || "")(varMap)} }, ` : "";
  const getCountQuery = `
    query {
      all${modelName} (${where}take: ${take}) {
        ${count ? "totalCount" : "results { id }"}
      }
    }
  `;

  const { data, errors } = await gql(getCountQuery);

  if (errors) {
    throw errors;
  }

  return data[`all${modelName}`][count ? "totalCount" : "results"];
}

export default queryRecords;