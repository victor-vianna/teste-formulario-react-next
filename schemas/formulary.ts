import { z } from "zod";

export const GeneralFormularySchema = z.object({
    nome: z.string({required_error:"Nome não informado.", invalid_type_error:"Tipo não válido para nome."}).min(2, {message:"Preencha um nome de ao menos 2 caracteres."}),
    telefone: z.string({required_error:"Telefone não informado.", invalid_type_error:"Tipo não válido para telefone."}),
    ferramentasAtuais: z.array(z.string({required_error:"Nome da ferramenta não informado.", invalid_type_error:"Tipo não váldo para o nome da ferramenta."}), {required_error:"Lista de ferramentas não informada.", invalid_type_error:"Tipo não válido para a lista de ferramentas."}).min(1, {message:"Defina ao menos 1 ferramenta."}),
    dor: z.string({required_error:"Informações sobre a dor do cliente não informadas.", invalid_type_error:"Tipo não válido para as informações sobre a dor do cliente."}),
    descricaoPlataformaIdeal: z.string({required_error:"Descrição sobre a plataforma ideal não informada.", invalid_type_error:"Tipo não válido para a descrição sobre a plataforma ideal."}),
    demandaCentralizacao: z.boolean({required_error:"Necessidade de centralizar funcionalidades não informada.", invalid_type_error:"Tipo não válido para a necessidade de centralizar funcionalidades."}),
    dataInsercao: z.string({required_error:"Data de coleta não informada.", invalid_type_error:"Tipo não válido para data de coleta."}),
    autor: z.object({
        id: z.string({required_error:"ID do autor não informado.", invalid_type_error:"Tipo não válido para o ID do autor."}),
        nome: z.string({required_error:"Nome do autor não informado.", invalid_type_error:"Tipo não válido para o nome do autor."}),
        avatar_url: z.string({required_error:"URL do avatar do autor não informado.", invalid_type_error:"Tipo não válido para o URL do avatar do autor."}).optional().nullable(),
    })
})

export type TFormulary = z.infer<typeof GeneralFormularySchema>
