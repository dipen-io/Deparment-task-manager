import { router } from "./routes"
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast"

function App() {

    return(
        <>
        <Toaster position="top-center"/>
            <RouterProvider router={router}  /> 
        </>
    )
}

export default App
