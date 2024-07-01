import stringMap from "./utilityFuncs";

async function queryRecords(modelName, filter, filterVars, take, skip, bodyQuery, count = false) {
  const where = filter ? `where: { ${stringMap(filter, filterVars)} }, ` : "";
  const skip_fmt = count ? "" : `, skip: ${skip}`;
  const getQuery = `
    query {
      all${modelName} (${where}take: ${take}${skip_fmt}) {
        ${count ? "totalCount" : `results { ${bodyQuery} }`}
      }
    }
  `;

  const { data, errors } = await gql(getQuery);

  if (errors) {
    throw errors;
  }

  return data[`all${modelName}`][count ? "totalCount" : "results"];
}

export default queryRecords;
