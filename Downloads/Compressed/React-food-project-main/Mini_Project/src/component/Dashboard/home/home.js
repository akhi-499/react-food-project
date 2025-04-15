import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Imageslide from "./Imageslides";
import Header from "../header/header";
import '../header/header.css'
import Lunch from "./categories/Indianfood/Indianfood";
import Footer from "../footer/footer";
import Italianfood from "./categories/Italian food/Italianfood";
import { useSelector, useDispatch } from "react-redux";
import { getTotals } from "../cart/cartslice";
import { useEffect } from "react";
import Categories from "./categories/categories";
import Koreanfood from "./categories/korean food/Koreanfood";
function Home() {
    const cart = useSelector((state) => state.cart)
    let dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTotals())
    }, [cart, dispatch])
    const slides = [
        { url: require("../image/carousel.webp"), title: 'slide1' }

    ]
    return (
        <div className="home">
            <Header />
            <div className="bg">
                
                <div className="main-slice">
                    <Imageslide slides={slides} />
                </div>
            </div>
            {/* <Categories /> */}
            <div className="categories">
                <Lunch />
                <Italianfood />
            </div>


            <Footer />
        </div>

    )
}

export default Home