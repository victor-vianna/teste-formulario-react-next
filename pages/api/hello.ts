// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "@/lib/services/mongodb/connection";
import { apiHandler } from "@/utils/api";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};



const handleGetHelloRoute: NextApiHandler<any> = async (req,res) => {

  const query = req.query
  const id = query.id

  const db = await connectToDatabase()
  const usersCollection = db.collection('users')

  if(id) {
    if(typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.")
    
    const user = await usersCollection.findOne({_id: new ObjectId(id)})
    if(!user) throw new  createHttpError.NotFound("Usuário não encontrado.")

    return res.status(200).json({data: user})
  }

  const users = await usersCollection.find({}).toArray()
  return res.status(200).json({data: users})
}

const createUserRoute: NextApiHandler<{message:string, insertedId:string}> = async (req,res) => {


  const user = req.body
  const db = await connectToDatabase()
  const usersCollection = db.collection('users')

  const insertResponse = await usersCollection.insertOne({...user})
  if(!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao criar usuário.")

   return res.status(200).json({message: "Usuário criado com sucesso !", insertedId: insertResponse.insertedId.toString()}) 
}

export default apiHandler({GET: handleGetHelloRoute, POST: createUserRoute})

