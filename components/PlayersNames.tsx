'use client'


import { checkAuthConnection, generateRandomSlug } from '../utils/utils'
import { supabase } from '@/supabase-client';


const createGame = async (gameSlug) => {


    // const filePath = `${File.name}-${Date.now()}-${post.title}`;
    const { error: uploadError } = await supabase.storage.from('post-images').upload(filePath, imgFile)

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(filePath);

    // const { data, error } = await supabase.from('posts').insert({ ...post, img_url: publicUrlData.publicUrl });


    // if (error) throw new Error(error.message)

    return data
}

const PlayersNames = () => {


    const gameSlug = generateRandomSlug();
    console.log(gameSlug)


    // checkAuthConnection()


    return (
      




      <div className="w-full flex flex-col items-center h-full ">


          <h1 className="mt-10 text-5xl font-bold">
              {Math.random() > 0.5 ? 'מי משחקים? ' : 'מי משחקות?'}
              
          </h1>
        

          <div className='my-10 w-full flex items-center justify-center'>
              <input type='text'
                  placeholder={Math.random() > 0.5 ? 'שם שחקן 1' : 'שם שחקנית 1'}

              className='bg-white w-7/10 text-center p-4'
              
              />
          </div>
          <div className='mt-2 mb-20 w-full flex items-center justify-center'>
              <input type='text'
                  placeholder={Math.random() > 0.5 ? 'שם שחקן 2': 'שם שחקנית 2'}
              className='bg-white w-7/10 text-center p-4'
              
              />
          </div>
       


          <button
              className="mb-6 bg-white text-xl py-2 w-1/2 rounded-lg  cursor-pointer "
          >
              בואו נתחיל!
          </button>


      </div>
  )
}

export default PlayersNames