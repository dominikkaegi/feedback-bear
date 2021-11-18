import { Artist } from ".prisma/client"
import { useState } from "react"
import prisma from "../prisma/client"

export const getServerSideProps = async () => {
    const artists = await prisma.artist.findMany()

    return {
        props: {
            artists
        }
    }
}

interface IProps {
    artists: Artist[]
}

const JeanPage: React.FC<IProps> = ({ artists }) => {
    const [count, setCount] = useState(0)

    console.log(artists)
    return (
        <div>
            <h2>Jean Simon</h2>
            {
                artists.map(artist => <li>{artist.name}</li>)
            }
            <h2>{count}</h2>
            <button onClick={() => setCount(count + 1)}>increase</button>
        </div>
    )
}

export default JeanPage
