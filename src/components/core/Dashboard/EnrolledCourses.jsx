import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const EnrolledCourses = () => {
  const {token} = useSelector(state => state.auth);
  const {enrolledCourses, setenrolledCourses} = useState(null); // all enrolled courses data stored
  
  useEffect(()=>{
    // fetch all enrolled courses
    // setenrolledCourses(response.data.enrolledCourses)
  }, []);
  return (
    <div>EnrolledCourses</div>
  )
}

export default EnrolledCourses
