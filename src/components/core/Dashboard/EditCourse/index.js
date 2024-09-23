import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import RenderSteps from "../AddCourse/RenderSteps";

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course, editCourse } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFullDetailsOfCourse(courseId, token);
  
        if (result?.courseDetails) {
          dispatch(setEditCourse(true));
          dispatch(setCourse(result.courseDetails));
        } else {
          console.log("Course details not found or invalid response");
        }
      } catch (error) {
        // Log detailed error information
        console.error("Error fetching course details:", error?.response?.data || error.message || error);
  
        // Display a user-friendly message in the UI
        alert("There was an issue retrieving the course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [courseId, token, dispatch]);
  

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {editCourse && course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
}
