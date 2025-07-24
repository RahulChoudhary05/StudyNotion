"use client"

import { useState } from "react"

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    const baseColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF"]
    for (let i = 0; i < numColors; i++) {
      colors.push(baseColors[i % baseColors.length])
    }
    return colors
  }

  // Calculate total values
  const totalStudents = courses.reduce((sum, course) => sum + (course.totalStudentsEnrolled || 0), 0)
  const totalIncome = courses.reduce((sum, course) => sum + (course.totalAmountGenerated || 0), 0)

  // Create SVG Pie Chart Component
  const PieChart = ({ data, colors }) => {
    let cumulativePercentage = 0
    const radius = 80
    const centerX = 100
    const centerY = 100

    return (
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          {data.map((value, index) => {
            const percentage = (value / data.reduce((a, b) => a + b, 0)) * 100
            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360

            const startAngleRad = (startAngle - 90) * (Math.PI / 180)
            const endAngleRad = (endAngle - 90) * (Math.PI / 180)

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)

            const largeArcFlag = percentage > 50 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            cumulativePercentage += percentage

            return <path key={index} d={pathData} fill={colors[index]} stroke="#fff" strokeWidth="2" />
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {courses.map((course, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[index] }}></div>
              <span className="text-richblack-5 truncate">{course.courseName}</span>
              <span className="text-richblack-300 ml-auto">
                {currChart === "students" ? course.totalStudentsEnrolled || 0 : `₹${course.totalAmountGenerated || 0}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const colors = generateRandomColors(courses.length)
  const studentData = courses.map((course) => course.totalStudentsEnrolled || 0)
  const incomeData = courses.map((course) => course.totalAmountGenerated || 0)

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-richblack-700 p-3 rounded">
          <p className="text-richblack-300 text-sm">Total Students</p>
          <p className="text-yellow-50 text-xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-richblack-700 p-3 rounded">
          <p className="text-richblack-300 text-sm">Total Income</p>
          <p className="text-yellow-50 text-xl font-bold">₹{totalIncome}</p>
        </div>
      </div>

      <div className="flex-1">
        {courses.length > 0 ? (
          <PieChart data={currChart === "students" ? studentData : incomeData} colors={colors} />
        ) : (
          <div className="flex items-center justify-center h-64 text-richblack-300">No course data available</div>
        )}
      </div>
    </div>
  )
}
