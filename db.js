
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://nishantraghuvanshi501:uPN4dsDItFcQmIo4@cluster0.dswci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your connection string
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('your_database_name'); // Replace with your database name
}

export { connectToDatabase };
