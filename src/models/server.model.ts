import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

class Server {

  private app: express.Application;
  private port: string | number;


  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;



    //middleware

    //routes

  }
  //connection DB

  middleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static('public'))
  }


  listen() {
    this.app.listen(this.port, () => {
      console.log('🚀- Server running on port', this.port);
    })
  }

}


export default Server;