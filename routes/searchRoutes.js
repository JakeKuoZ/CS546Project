const express = require("express");
const router = express.Router();
const querystring = require('querystring');
const {
  services,
  reviews
} = require("../config/mongoCollections");

const interestsCfg = [{
    value: "Hvac",
  },
  {
    value: "Heating/cooling",
  },
  {
    value: "Landscaping",
  },
  {
    value: "Gutters",
  },
  {
    value: "Snow",
  },
  {
    value: "Inside Cleaning",
  },
  {
    value: "Roofing",
  },
  {
    value: "Furniture Assembly",
  },
  {
    value: "Interior Paint and Stain",
  },
  {
    value: "Drywall Maintenance and Repairs",
  },
  {
    value: "Plumbing",
  },
  {
    value: "Electrical",
  },
  {
    value: "Carpentry",
  },
  {
    value: "Window Coverings",
  },
  {
    value: "Interior Winterization",
  },
  {
    value: "Babyproofing",
  },
  {
    value: "Door Hardware Installation",
  },
  {
    value: "Tiling",
  },
  {
    value: "Senior Home Upgrades",
  },
  {
    value: "Pressure Washing",
  },
  {
    value: "Screen Installation and Repairs",
  },
  {
    value: "Exterior Paint and Stain",
  },
  {
    value: "General Yard Maintenance",
  },
  {
    value: "Fence and Gate Repairs",
  },
  {
    value: "Other...",
  },
];
router.route("/").get(async (req, res) => {
  let {
    searchInput,
    price,
    rating,
    Category,
    page
  } = req.query;
  const limit = 10;
  // console.log("page = ", page)
  if (!page) {
    page = 1;
  } else {
    page = Number(page);
  }
  let filter = [];
  let sortArr = [];
  const services_model = await services();

  if (searchInput) {
    filter.push({
      serviceName: {
        $regex: new RegExp(searchInput, "i"),
      }
    });
    filter.push({
      description: {
        $regex: new RegExp(searchInput, "i"),
      }
    });
    filter.push({
      keywords: {
        $regex: new RegExp(searchInput, "i"),
      }
    });
  }
  if (Category) {
    let categoryArr = [];
    if (typeof Category == "object") {
      categoryArr = Category;
    } else {
      categoryArr = [Category];
    }
    filter.push({
      category: {
        $in: categoryArr,
      }
    });
  }
  // db.articles.aggregate([{
  //     $match: {
  //       $or: [{
  //         score: {
  //           $gt: 70,
  //           $lt: 90
  //         }
  //       }, {
  //         views: {
  //           $gte: 1000
  //         }
  //       }]
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       count: {
  //         $sum: 1
  //       }
  //     }
  //   }
  // ]);
  // let handler = await services_model.find(filter);
  if (price) {
    sortArr.push({
      $sort: {
        typicalCharge: Number(price),
      },
    });
  }
  let obj = {};
  if (filter.length) {
    obj['$or'] = filter;
  }
  console.log("obj = ", obj)
  let total = await services_model
    .aggregate([
      ...sortArr,
      {
        $match: {
          ...obj,
        },
      },
    ])
    .toArray();
  let serviceResult = await services_model
    .aggregate([
      ...sortArr,
      {
        $match: {
          ...obj,
        },
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $lookup: {
          from: "Reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewsArr",
        },
      },
      {
        $limit: limit
      },
    ])
    .toArray();
  console.log("serviceResult = ", serviceResult);

  serviceResult.forEach((v) => {
    v.avgRating = v.reviewsArr.length ?
      (
        v.reviewsArr.reduce((pre, item) => {
          return item.rating + pre;
        }, 0) / v.reviewsArr.length
      ).toFixed(2) :
      "No reviews";
  });
  // console.log("serviceResult2 = ", serviceResult)
  if (rating) {
    // console.log("rating = ", rating);
    serviceResult = serviceResult.sort((a, b) => {
      return rating == 1 ?
        a.avgRating - b.avgRating :
        b.avgRating - a.avgRating;
    });
  }
  // 
  const deepQuery = {
    ...req.query
  };
  if (deepQuery.page) {
    delete deepQuery.page;
  }
  const pageArr = [];
  for (let i = 0; i < total.length; i++) {
    pageArr.push({
      query: `${querystring.stringify(deepQuery)}`,
      index: i + 1
    })
  }
  // console.log("pageArr = ", pageArr)
  res.status(200).render("searchService", {
    title: "Search your Services",
    service: serviceResult,
    noData: !!!serviceResult.length,
    interests: interestsCfg,
    originalUrl: querystring.stringify(deepQuery),
    total: total.length,
    pageArr,
    page
  });
});

// router.route("/searchresults").post(async (req, res) => {
//   var input = req.body;
//   var searchInput = input.searchInput;
//   console.log("body = ", input);
//   var category = input.Category;
//   try {
//     if (input.searchInput === undefined && input.Category === undefined) {
//       throw "Empty search input";
//     }
//   } catch (e) {
//     res.status(200).render("searchService", {
//       error: e
//     })
//   }
//   if (searchInput.length !== 0 && category === undefined) {
//     try {
//       const serviceResult = await searchData.findService(input.searchInput);

//       console.log(serviceResult);

//       if (serviceResult.length === 0) {
//         throw "There are no match service, please try other words";
//       }

//       res
//         .status(200)
//         .render("searchResult", {
//           service: serviceResult,
//           searchName: searchInput,
//           title: "Search Results",
//         });
//     } catch (e) {
//       res.status(200).render("searchService", {
//         error: e
//       })
//     }
//   } else if (searchInput.length === 0 && category !== undefined) {
//     try {
//       const serviceResult = await searchData.findServiceByCate(category);

//       console.log(serviceResult);

//       if (serviceResult.length === 0) {
//         throw "There are no match service, please try other words";
//       }

//       res
//         .status(200)
//         .render("searchResult", {
//           service: serviceResult,
//           searchName: searchInput,
//           title: "Search Results",
//         });
//     } catch (e) {
//       res.status(200).render("searchService", {
//         error: e
//       })
//     }
//   }
// });

// router.route("/search/:id").post(async (req, res) => {
//   //code here for POST
// });

module.exports = router;