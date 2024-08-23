import { TFormulary } from '@/schemas/formulary';
import { getErrorMessage } from '@/utils/errors';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Inter } from 'next/font/google';
import React from 'react'
import toast from 'react-hot-toast';
const inter = Inter({ subsets: ["latin"] });
function FormularyAnswers() {



  async function getForms() {
    try {
      const resp = await axios.get('/api/form')
      const data = resp.data.data as (TFormulary & {_id:string})[]
      return data
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.error(msg)
      throw error
    }
  }
  const {data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['forms'],
    queryFn: getForms
  })
  return (
    <main
      className={`flex flex-col grow bg-[#15599a] items-center justify-center ${inter.className}`}
    >
      <div className="w-[90%] lg:w-[60%] h-fit flex flex-col gap-2 p-3 rounded shadow-sm bg-[#fff] py-6">
        {isLoading ? <p className='text-gray-500 animate-pulse'>Carregando formulários...</p> : null}    
        {isError ? <p className='text-red-500'>{getErrorMessage(error)}</p> : null}
        {isSuccess ? data.map(form => <div key={form._id} className='w-full'>{form.nome}</div>) : null}
      </div>
    </main>
  )
}

export default FormularyAnswers