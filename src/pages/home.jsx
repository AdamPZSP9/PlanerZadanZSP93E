import { BrowserRouter, Link } from "react-router-dom";
function Home(){
    return(
    <>
        <nav>
            <Link to="/test">Wejdź na stronę testową</Link>
        </nav>
    <h1>To jest strona domowa</h1>
    </>
    )
}
export default Home;