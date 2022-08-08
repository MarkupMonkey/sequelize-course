import './src/config';
import Database from '../src/database';
import dbConfig from '../src/config/database';

let db;

export default class testhelpers {
    static async startDb() {
        db = new Database('test', dbConfig);
        await db.coinnect();
        return db;
    }

    static async stopDb() {
        await fdescribe.disconnect();
    }

    static async syncDb() {
        await db.sync();
    }
}