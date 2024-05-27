import { MongoClient, ObjectId } from "mongodb";
/**
 * Class representing a MongoDB database connection and interactions
 */
class MongoDB {
    /**
     * constructor
     * @param {string} db_user - user name for mongo
     * @param {string} db_pass - password for mongo
     * @param {string} db_host - host for mongo
     * @param {string} db_name - name of mongo db
     * and sets up properties for the MongoDB client and database
     */
    constructor(db_user, db_pass, db_host, db_name){
        this.mongoURL = `mongodb+srv://${db_user}:${db_pass}@${db_host}/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;
        this.client = new MongoClient(this.mongoURL);
        this.db = this.client.db();
    }
    async close(){
        try{
            await this.client.close();
            console.log('Closed connection with MongoDB');
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * Creates a new document in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {Object} data - the data to be inserted into the collection
     * @returns {Promise<Object>} - a Promise that resolves with the acknoledgement document
     */
    async create(collectionName, data) {
        const collection = this.db.collection(collectionName);
        const res = await collection.insertOne(data);
        return res;
    }
    
    /**
     * Finds documents by their _id in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {string} _id - the _id of the document to find
     * @returns {Promise<cursor>} - a Promise that resolves with the cursor
     */
    async find(collectionName, _id) {
        const collection = this.db.collection(collectionName);
        const oID = new ObjectId(_id);
        const cursor = collection.find({
            _id:oID
        });
        return cursor;
    }
}
export { MongoDB };
