const { MongoClient, ObjectId } = require('mongodb');

const { mongoUri, mongoDatabaseName } = require('./env');

let databasePromise = null;
let mongoClient = null;

const isValidObjectId = (value) => typeof value === 'string' && ObjectId.isValid(value);

const getRecordObjectId = (value) => (isValidObjectId(value) ? new ObjectId(value) : null);

const getDatabase = async () => {
  if (!mongoUri) {
    return null;
  }

  if (!databasePromise) {
    mongoClient = new MongoClient(mongoUri);
    databasePromise = mongoClient
      .connect()
      .then((client) => {
        console.log(`MongoDB connected for Expult Global (${mongoDatabaseName}).`);
        return client.db(mongoDatabaseName);
      })
      .catch((error) => {
        console.error('MongoDB connection failed. Falling back to in-memory storage.', error);
        databasePromise = null;
        mongoClient = null;
        return null;
      });
  }

  return databasePromise;
};

const saveRecord = async (collectionName, record, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const result = await database.collection(collectionName).insertOne(record);

    return {
      storage: 'mongodb',
      id: result.insertedId.toString()
    };
  }

  fallbackArray.push({
    ...record,
    id: fallbackArray.length + 1
  });

  return {
    storage: 'memory',
    id: String(fallbackArray.length)
  };
};

const getRecordById = async (collectionName, recordId, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const objectId = getRecordObjectId(recordId);

    if (!objectId) {
      return null;
    }

    return database.collection(collectionName).findOne({ _id: objectId });
  }

  return fallbackArray.find((record) => String(record.id) === String(recordId)) || null;
};

const updateRecordById = async (collectionName, recordId, updates, fallbackArray) => {
  const database = await getDatabase();

  if (database) {
    const objectId = getRecordObjectId(recordId);

    if (!objectId) {
      return null;
    }

    const collection = database.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  const recordIndex = fallbackArray.findIndex((record) => String(record.id) === String(recordId));

  if (recordIndex === -1) {
    return null;
  }

  fallbackArray[recordIndex] = {
    ...fallbackArray[recordIndex],
    ...updates
  };

  return fallbackArray[recordIndex];
};

const closeResources = async () => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    databasePromise = null;
  }
};

module.exports = {
  getDatabase,
  saveRecord,
  getRecordById,
  updateRecordById,
  closeResources
};