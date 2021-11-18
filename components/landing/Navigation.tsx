import { NavigationPublic } from "../../components/landing/NavigationPublic"
import { NavigationPrivate } from "../../components/landing/NavigationPrivate"
import {useSession} from "next-auth/client";

/**
 * Sets up the navigation bar according to the logging of the user.
 * @constructor
 */
export function Navigation() {
    const [session, loading] = useSession();

    if(session) {
        return (
            <>
                <NavigationPrivate />
            </>
        )
    }else{
        return (
            <>
                <NavigationPublic />
            </>
        )
    }
}
