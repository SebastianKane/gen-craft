import { MongoClient, ObjectId, Db } from "mongodb";
import type { RecordType } from "../../gen-craft/Game/types";
/**
 * Class representing a MongoDB database connection and interactions
 */
class MongoDB {
    mongoURL: string;
    client: MongoClient;
    db: Db;
    /**
     * constructor
     * @param db_user - user name for mongo
     * @param db_pass - password for mongo
     * @param db_host - host for mongo
     * @param db_name - name of mongo db
     * and sets up properties for the MongoDB client and database
     */
    constructor(db_user : string, db_pass : string, db_host : string, db_name : string){
        this.mongoURL = `mongodb+srv://${db_user}:${db_pass}@${db_host}/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;
        this.client = new MongoClient(this.mongoURL);
        this.db = this.client.db();
        console.log('Created connection with MongoDB');
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
     * @param collectionName - the name of the collection
     * @param  data - the data to be inserted into the collection
     * @returns - a Promise that resolves with the acknoledgement document
     */
    async create(collectionName : string, data : RecordType) {
        try {
            console.log(collectionName, data)
            const collection = this.db.collection(collectionName);
            const res = await collection.insertOne(data);
            return res;
        } catch (error) {
            console.log(error);
        }

    }
    
    /**
     * Finds documents by their _id in the specified collection
     * @param collectionName - the name of the collection
     * @param _id - the _id of the document to find
     * @returns - a Promise that resolves with the cursor
     */
    async findbyID(collectionName : string, _id : string) {
        const collection = this.db.collection(collectionName);
        const oID = new ObjectId(_id);
        const cursor = collection.find({
            _id:oID
        });
        return cursor;
    }
    /**
     * Finds documents by their _id in the specified collection
     * @param collectionName - the name of the collection
     * @param constructionID -  identify a concept or method by its construction
     * @returns - a Promise that resolves with the cursor
     */
    async findByConstructionID( constructionID : string, collectionName? : string,) {
        //TODO ts forced this into being an ugly monstrosity. Make this pretty one day
        if (!collectionName){
            console.log('Work it!')
            this.db
        } else {
            const collection = this.db.collection(collectionName);
            const cursor = collection.findOne({
                constructionID:constructionID
            });
            const output = await cursor;
            return output;
        }
    }
    
}
export { MongoDB };
