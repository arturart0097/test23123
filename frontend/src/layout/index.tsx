import { Outlet } from "react-router"
import { Header } from "../components/Header"

export const Layout = () => {
    return (
        <div className="px-24! pb-5!">
            <Header />
            <div className="mt-8!">
                <Outlet />
            </div>
        </div>
    )
} 