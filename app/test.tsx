/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function Home() {

  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();



  return (
    <div className="bg-amber-500 w-[400px] m-auto overflow-y-hidden h-[100vh]">

      <p>sdsdfsdf</p>

      <p>בדיקה איך זה עובד בעברית. ככה נראה משפט תקין.</p>
      <h1>{users.length} Users</h1>


      {
        users.map((user: any) => (
          <div key={user.id}>
            <Link href={`/game/${user.id}`}>
              {user.name}
            </Link>
          </div>
        ))
      }




      <Image src='/logo1.png' alt='Arik Alexandrov'
        width={100} height={100}
      />
    </div>
  );
}
