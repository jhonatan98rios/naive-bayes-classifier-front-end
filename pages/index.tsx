
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {

    if (document && document.querySelector('body')) {
      const body = document.querySelector('body')
      if (!body) return
      body.style.overflow = "hidden"
      body.style.height = window.innerHeight + "px"
      body.style.width = window.innerWidth + "px"
    }

  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center">

      <video autoPlay muted loop id="bg" className="fixed z-0 top-0 left-0 min-w-full min-h-full">
        <source src="./LPBG.mp4" type="video/mp4" />
      </video>

      <div className="flex flex-col justify-center items-center z-10 h-screen w-screen">

        <h1 className="text-6xl text-white font-bold justify-center items-center mb-12 text-center w-11/12 sm:w-9/12 block drop-shadow-lg ">
          The Most Flexible
          <span className=" text-[#009BB9]"> Text Classification </span> 
          <br /> Powered By AI
        </h1>

        <h2 className="text-4xl text-white font-bold flex justify-center items-center mb-12 text-center w-11/12 sm:w-9/12"> 
          Create fully customized machine learning models in minutes without programming and completely scalable!
        </h2>

        <button 
          onClick={() => signIn('google', { redirect: true, callbackUrl: '/classifiers' })} 
          className="flex justify-center items-center bg-teal-500 text-white py-4 px-16 text-xl font-bold rounded-md w-4/5  max-w-lg"
        >
          Lets begin!
        </button>

      </div>
    </div>
  )
}

Home.getLayout = function getLayout(page: any) {
  return (
    <>
      {page}
    </>
  )
}