import React from 'react'
import { CiShoppingTag } from "react-icons/ci";

export default function ChipInput() {
  return (
    <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5 flex" htmlFor="courseTags">
        Tags <sup className="text-pink-200">*</sup>
        </label>
    </div>
  ) 
}
