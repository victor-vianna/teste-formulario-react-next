import connectToDatabase from "@/lib/services/mongodb/connection";
import { GeneralFormularySchema, TFormulary } from "@/schemas/formulary";
import { apiHandler } from "@/utils/api";
import createHttpError from "http-errors";
import { Collection, ObjectId } from "mongodb";
import { NextApiHandler } from "next";




type PostResponse = {
    data: {
        insertedId:string
    }
    message: string
}
const createFormRoute: NextApiHandler<PostResponse> = async (req,res) => {
    const form = GeneralFormularySchema.parse(req.body)
    
    const db = await connectToDatabase()
    const formsCOllection: Collection<TFormulary> = db.collection('forms')

    const insertResponse = await formsCOllection.insertOne(form)
    if(!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, um erro ocorreu ao criar formulário.")
    
    const insertedId = insertResponse.insertedId.toString()

    return res.status(201).json({data: {insertedId: insertedId}, message:"Formulário criado com sucesso !"})
}

type GetResponse = {
    data: TFormulary | TFormulary[]
}
const getFormsRoute: NextApiHandler<GetResponse> = async (req,res) => {

    const {id} = req.query
    const db = await connectToDatabase()
    const formsCOllection: Collection<TFormulary> = db.collection('forms')

    if(id) {
        if(typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.")
        
        const form = await formsCOllection.findOne({_id: new ObjectId(id)})
        if(!form) throw new createHttpError.NotFound("Formulário não encontrado.")

        return res.status(200).json({data: form})
    }

    const forms = await formsCOllection.find({}).toArray()

    return res.status(200).json({data: forms})
}
export default apiHandler({POST: createFormRoute, GET: getFormsRoute})