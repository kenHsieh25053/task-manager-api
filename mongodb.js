// crud

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true
  },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to db");
    }

    const db = client.db(databaseName);

    db.collection("users")
      .updateOne(
        {
          _id: new ObjectID("5c9a3a068837200a07dd6cd7")
        },
        {
          $inc: {
            age: 1
          }
        }
      )
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }
);
