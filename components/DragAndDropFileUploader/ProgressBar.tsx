import { FILE_STATUS } from "@/domain/entities/FileStatus";
import { useEffect, useState } from "react"


interface IProgressBar {
  status: FILE_STATUS
}

export const ProgressBar = ({ status }: IProgressBar) => {

  const [ progress, setProgress ] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {

      setProgress(progress => {
        if (progress < 90 ) return progress + 1

        clearInterval(interval)
        return progress        
      })
    }, 20)
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (status === FILE_STATUS.DONE) {
      setProgress(100)
    }
  }, [status])


  return (
    <div>
      <p className="mb-2 font-semibold text-gray-500"> Upload em andamento: { progress }%</p>
      <div className="bg-gray-200 w-full h-4 flex rounded-md">
        <div 
          className="h-full bg-purple-500 transition-all rounded-md" 
          style={{ 
            width: `${progress}%`, 
            background: status == FILE_STATUS.LOADING 
              ? 'linear-gradient(92deg, #5D95E6 0%, #935AFF 100%)' 
              : '#58BCA4'
          }} 
        />
      </div> 

      
    </div>
  )
}