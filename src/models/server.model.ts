import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from 'dns'

import userRoutes from '../routes/user.routes'
import mongoose from "mongoose";

dotenv.config();

class Server {

  private app: express.Application;
  private port: string | number;
  private apiPaths = {
    users: '/api/users'
  }


  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    //middleware
    this.middleware();

    //routes
    this.routes();

  }

  //connection DB
  connectionDB() {
    try {
      dns.setServers(['1.1.1.1', '8.8.8.8'])
      mongoose.connect( process.env.MONGO_URI || '')
      console.log('✅ - Database connected to MongoDB');
    } catch (error) {
      console.log(error);
    }
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static('public'))
  }


  routes(){
    this.app.use( this.apiPaths.users, userRoutes )
  }

  getApp() {
    return this.app;
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('🚀 - Server running on port', this.port);
    })
  }

}


export default Server;