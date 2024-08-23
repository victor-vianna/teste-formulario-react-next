import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { TFormulary } from "@/schemas/formulary";
import TextInput from "@/components/inputs/TextInput";
import { formatToPhone } from "@/utils/formatting";
import MultipleSelectInput from "@/components/inputs/MultipleSelectInput";
import TextareaInput from "@/components/inputs/TextareaInput";
import CheckboxInput from "@/components/inputs/CheckboxInput";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errors";

const inter = Inter({ subsets: ["latin"] });
const PossibleTools = ['EXCEL', "POWER BI", 'CLICK UP', 'PIPEFY', 'OUTRAS PLATAFORMAS', 'PLATAFORMA PRÓPRIA']

export default function Home() {
  const [infoHolder,setInfoHolder] = useState<TFormulary>({
    nome: "",
    telefone: "",
    ferramentasAtuais: [],
    dor:  "",
    descricaoPlataformaIdeal:  "",
    demandaCentralizacao:  false,
    dataInsercao: new Date().toISOString(),
    autor: {
      id: '',
      nome: ''
    }
  })
  async function createFormulary(data: TFormulary) {
    try {
      const resp = await axios.post('/api/form',data )
      const message = resp.data.message as string
      return toast.success(message)
    } catch (error) {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    }
  }
  const {mutate, isPending, isError, isSuccess, error} = useMutation({
    mutationKey:['create-form'],
    mutationFn: createFormulary
  })
  return (
    <main
      className={`flex flex-col grow bg-[#15599a] items-center justify-center ${inter.className}`}
    >
      <div className="w-[90%] lg:w-[60%] h-fit flex flex-col gap-2 p-3 rounded shadow-sm bg-[#fff] py-6">
        <h1 className="w-full text-center font-black text-[#15599a]">FORMULÁRIO INTERSOLAR - ERP</h1>
        <div className="w-full flex flex-col gap-2 py-2 grow">
          <div className="w-full flex items-center gap-2 flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
            <TextInput label="NOME DO CLIENTE" placeholder="Preencha aqui o nome do cliente..." value={infoHolder.nome} handleChange={(value) => setInfoHolder(prev=> ({...prev, nome: value}))}/>
            </div>
            <div className="w-full lg:w-1/2">
            <TextInput label="TELEFONE DO CLIENTE" placeholder="Preencha aqui o telefone do cliente..." value={infoHolder.telefone} handleChange={(value) => setInfoHolder(prev=> ({...prev, telefone: formatToPhone(value)}))}/>
            </div>
          </div>
          <MultipleSelectInput label="PLATAFORMA QUE USAM ATUALMENTE" selected={infoHolder.ferramentasAtuais} handleChange={(value) =>setInfoHolder(prev=> ({...prev, ferramentasAtuais: value as string[]}))} options={PossibleTools.map((tool, index) => ({id: index+1, value: tool, label: tool}))} onReset={() => setInfoHolder(prev=> ({...prev, ferramentasAtuais: []}))} selectedItemLabel="NÃO DEFINIDO"/>
          <TextareaInput label="QUAL A PRINCIPAL DOR DO CLIENTE ATUALMENTE ?" placeholder="Preencha aqui dificuldades que o cliente tem atualmente para gerir sua empresa..." value={infoHolder.dor} handleChange={(value)=> setInfoHolder(prev=> ({...prev, dor: value}))}/>
          <TextareaInput label="COMO SERIA A PLATAFORMA IDEAL PARA ESSE CLIENTE ?" placeholder="Preencha aqui caracteristicas, funcionalidades, facilidades que o cliente procura em uma plataforma ideal..." value={infoHolder.descricaoPlataformaIdeal} handleChange={(value)=> setInfoHolder(prev=> ({...prev, descricaoPlataformaIdeal: value}))}/>
          <div className="w-full flex items-center justify-center">
            <div className="w-fit">
              <CheckboxInput labelFalse="O CLIENTE GOSTARIA DE CENTRALIZAR TODAS AS INFORMAÇÕES NUM SÓ LUGAR ?" labelTrue="O CLIENTE GOSTARIA DE CENTRALIZAR TODAS AS INFORMAÇÕES NUM SÓ LUGAR ?" checked={infoHolder.demandaCentralizacao} handleChange={(value) => setInfoHolder(prev=> ({...prev, demandaCentralizacao: value}))}/>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button disabled={isPending} onClick={()=> mutate(infoHolder)} className="w-full bg-[#15599a] text-white font-bold px-2 py-2 rounded text-sm hover:bg-blue-600 duration-300 ease-in-out disabled:bg-gray-500">SALVAR</button>
        </div>
      </div>
    </main>
  );
}
