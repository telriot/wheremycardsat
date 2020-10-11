import {Request, Response,NextFunction }from "express"

export const  getIndex= async (req:Request, res:Response, next:NextFunction) => {
    res.status(200).send("index");
  }

