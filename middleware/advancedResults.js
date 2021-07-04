const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // make copy of req.query
  reqQuery = { ...req.query };

  // fields to exclude from req.query
  const removeFields = ["select", "sort", "limit", "page"];

  removeFields.forEach((param) => delete reqQuery[param]);

  // get query params in JSON and convert to string
  let queryStr = JSON.stringify(reqQuery);

  // add $ before gt,gte,lt,lte,in for mongo db comparison operators
  // replace() takes regex as first param
  // second param is match which is the expression matched
  // g (global) matches all the params and not only the first
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // search model using query
  query = model.find(JSON.parse(queryStr));

  // select specific attributes only
  if (req.query.select) {
    // mongoose.select() requires space separated values
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort the results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // default sorting by createdAt in reverse order
    query = query.sort("-createdAt");
  }

  if (populate) {
    query = query.populate(populate);
  }

  // determine limit and page number
  const resultsPerPage = parseInt(req.query.limit, 10) || 1;
  const pageNumber = parseInt(req.query.page, 10) || 1;

  // determine start and end for pagination
  const startIndex = (pageNumber - 1) * resultsPerPage;
  const endIndex = pageNumber * resultsPerPage;

  // count all the documents
  const totalDocuments = await model.countDocuments({});
  const totalPages = Math.ceil(totalDocuments / resultsPerPage);

  // pagination
  query.skip(startIndex).limit(resultsPerPage);

  // pagination result for the response
  pagination = { pages: totalPages };

  // show prev page
  if (startIndex > 0) {
    pagination.prev = {
      page: pageNumber - 1,
      resultsPerPage,
    };
  }

  // show next page
  if (endIndex < totalDocuments) {
    pagination.next = {
      page: pageNumber + 1,
      resultsPerPage,
    };
  }

  // get results of the advanced query
  const results = await query;

  // send results
  res.advancedResults = {
    success: true,
    count: totalDocuments,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
