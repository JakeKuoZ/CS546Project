const mongoCollections = require("./config/mongoCollections");
const service = mongoCollections.services;
const reviews = mongoCollections.reviews;
const user = mongoCollections.users;


async function main(){
    const serviceCollection = await service();
  const userServices = await serviceCollection.find({userId: "638cbbaa8c0999a627a77009"}).toArray();
  console.log(userServices);
}


main();

