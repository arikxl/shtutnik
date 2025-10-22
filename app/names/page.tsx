import AnimTitle from '@/components/AnimTitle';
import NamesForm from '@/components/NamesForm';


const PlayersNames = () => {

    return (
        <>
            <div className="mt-10 text-5xl font-bold text-center">
                <AnimTitle text='מי משחק?' />
            </div>

            <NamesForm />
        </>
    )
}

export default PlayersNames