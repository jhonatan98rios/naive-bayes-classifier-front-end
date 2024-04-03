import Link from "next/link"
import { ClassifierDTO } from "@/domain/entities/Classifier"

interface ClassifierCardProps {
  classifier: ClassifierDTO
}

export function ClassifierCard({ classifier }: ClassifierCardProps) {
  return (
    <div className='p-5 my-4 bg-white rounded-2xl shadow-md w-[700px]'>
      <div className="flex justify-between">

        <div className="flex flex-col text-gray-500">
          <p className="text-sm font-bold mb-1"> Nome do modelo </p>
          <p className="text-xl mb-3"> {classifier.name} </p>
          
          <p className="text-sm font-bold mb-1"> Descrição </p>
          <p className="text-sm mb-3 max-w-[90%]"> 
            { classifier.description }
          </p>
        </div>
        
        {
          classifier.status == "ready" ? (
            <div className="flex flex-col items-end justify-between">
              <div className="flex flex-col justify-center items-center mb-6 text-gray-500">
                <p className="text-3xl font-bold"> {classifier.accuracy}% </p>
                <p className="text-base font-semibold"> Accuracy </p>
              </div>

              <Link
                href={`/classify/${classifier.id}`}
                className="flex font-semibold rounded-xl w-44 h-12 justify-center items-center p-4
                  bg-gradient-to-r from-[#5D95E6] to-[#935AFF] text-white"
              > Executar modelo </Link>
            </div>
          ) :
          (
            <div className="flex justify-end items-end">
              <p className="text-2xl font-bold text-gray-500 whitespace-nowrap"> In Progress </p>
            </div>
          )
        }
      </div>
    </div>
  )
}