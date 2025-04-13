import { Link } from "react-router";
import { Button } from "@/components/ui/button"

const NotFoundPage = () =>{
    return(
        <div>
            <h1>Go Back</h1>
            <Link to={'/'}>
                <Button>Back</Button>
            </Link>
        </div>

    );
};

export default NotFoundPage;