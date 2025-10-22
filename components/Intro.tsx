import Image from 'next/image'
import Link from 'next/link'
import AnimTitle from './AnimTitle'

const Intro = () => {

    return (
        <div className="w-full flex flex-col items-center h-full ">

            <div className="mt-10 text-7xl font-bold">
                <AnimTitle text='שטותניק' />
            </div>
            <Link href={'/https://www.linkedin.com/in/arik-alexandrov/'}>
                <p className="hover:underline mt-[-15px] mb-18">by arikxl</p>
            </Link>

            <Image src='/logo.png' alt='Arik Alexandrov'
                width={300} height={200}
                className=""
            />
            <p className="mt-[-90] mb-24">
                מחווה לחרטטוני של&nbsp;
                <Link className=' font-bold' target='_blank'
                    href={'https://www.youtube.com/playlist?list=PLEuMzKiu1RQAYhLIDg6uh6j2eomOFABGJ'}>דונקי</Link>
                .
            </p>

            <Link href={'/names'} className="mb-6 bg-white text-xl py-2 w-7/10 text-center rounded-lg cursor-pointer ">
                משחק חדש
            </Link>

            <Link href={'/instructions'} className="bg-white text-xl py-2 w-7/10 text-center rounded-lg cursor-pointer ">
                להוראות המשחק
            </Link>

        </div>



    )
}

export default Intro