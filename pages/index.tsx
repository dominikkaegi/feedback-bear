import { CallToAction } from "../components/landing/CallToAction"
import { Navigation } from "../components/landing/Navigation"
import { signIn, signOut, useSession } from "next-auth/client";
import { Button } from "@chakra-ui/button";


const LandingPage: React.FC = () => {
    const [session, loading] = useSession();

    if (loading) {
        return <h1>Loading....</h1>;
    }

    if(!session) {
        return (
            <>
                <Navigation />
                <CallToAction />
            </>
        )
    } else {
        return (
            <>
                <h1>Congrats you are signed in 😉</h1>
                <Button onClick={() => signOut()}>Sign Out</Button>
            </>
        )
    }
}

export default LandingPage