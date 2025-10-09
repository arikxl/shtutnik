import React from 'react'

const QuestionLoader = () => {

    const styles = `
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin:15px auto;
  position: relative;
  color: #FFF;
  box-sizing: border-box;
  animation: animloader 1s linear infinite alternate;
}

@keyframes animloader {
  0% {
    box-shadow: -38px -12px ,  -14px 0,  14px 0, 38px 0;
  }
  33% {
    box-shadow: -38px 0px, -14px -12px,  14px 0, 38px 0;
  }
  66% {
    box-shadow: -38px 0px , -14px 0, 14px -12px, 38px 0;
  }
  100% {
    box-shadow: -38px 0 , -14px 0, 14px 0 , 38px -12px;
  }
}


    `

    return (
        //   <div className='w-full h-full flex justify-center items-center pr-14 pb-20'>
        //       <style>{styles}</style>
        //       <span className="loader"></span>

        //   </div>

        <div>
            <style>{styles}</style>
            <span className="loader"></span>
        </div>
    )
}

export default QuestionLoader