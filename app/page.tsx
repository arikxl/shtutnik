// 'use client'

import Intro from "@/components/Intro";
import Image from "next/image";
import Link from "next/link";
// import {  useState } from "react";

export default  function Home() {

  // const response = await fetch('https://jsonplaceholder.typicode.com/users');
  // const users = await response.json();


  // const [gameStatus, setGameStatus] = useState(1)


  return (
    <div className="flex items-center h-full">

      <Intro />



    </div>
  );
}
