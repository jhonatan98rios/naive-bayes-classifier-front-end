import { useEffect, useState } from "react"

enum STATUS {
  NOFILE = 0,
  LOADING = 1,
  DONE = 2,
  ERROR = 3
}

interface IProgressBar {
  handleComplete: () => any
  status: STATUS
}

export const ProgressBar = ({ handleComplete, status }: IProgressBar) => {

  const [ progress, setProgress ] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {

      setProgress(progress => {
        if (progress < 100 ) return progress + 1

        clearInterval(interval)
        return progress        
      })
    }, 50)
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (progress >= 100) {
      handleComplete()
    }
  }, [progress])

  return (
    <div>
      <p className="mb-2 font-semibold text-gray-500"> Upload em andamento: { progress }%</p>
      <div className="bg-gray-200 w-full h-4 flex rounded-md">
        <div 
          className="h-full bg-purple-500 transition-all rounded-md" 
          style={{ 
            width: `${progress}%`, 
            background: status == STATUS.LOADING 
              ? 'linear-gradient(92deg, #5D95E6 0%, #935AFF 100%)' 
              : '#58BCA4'
          }} 
        />
      </div> 

      
    </div>
  )
}