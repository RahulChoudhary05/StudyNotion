import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavBarLinks} from "../../data/navbar-links";
import { useLocation } from 'react-router-dom';

export const NavBar = () => {
    const location = useLocation;
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
      }
  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

        {/* Logo */}
        <Link to="/">
        <img src={logo} alt="Logo" width={160} height={32} loading="lazy"/>
        </Link>

        {/* NavBar Link's */}
        <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
                {
                    NavBarLinks.map((link,index)=>(
                        <li key={index}>
                            {
                                link.title === "Catalog" ? (<div></div>) : (
                                    <Link to={link?.path}>
                                        <p className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}>{Link.title}</p>
                                    </Link>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </nav>
        </div>
    </div>
  )
}
