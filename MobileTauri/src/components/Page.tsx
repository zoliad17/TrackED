import { useState } from "react"
import { Link } from "react-router-dom"

const Page = () => {
	const [selectedSubject, setSelectedSubject] = useState<any>(null)

	// Sample student data
	const studentSubjects = [
		{
			name: "Technopreneurship",
			code: "TechnoPre",
			schedule: "MWF 9:00-10:30 AM",
			instructor: "Ms. Lopez",
			attendance: {
				present: 24,
				late: 3,
				absent: 1,
				total: 28,
			},
			grades: {
				midterm: null,
				finals: null,
			},
		},
		{
			name: "Ethics",
			code: "GE108",
			schedule: "TTH 1:00-2:30 PM",
			instructor: "Dr. Ople",
			attendance: {
				present: 26,
				late: 2,
				absent: 0,
				total: 28,
			},
			grades: {
				midterm: null,
				finals: null,
			},
		},
		{
			name: "Project Management",
			code: "ITElectv3",
			schedule: "MWF 2:00-3:30 PM",
			instructor: "Ms. Libunao",
			attendance: {
				present: 25,
				late: 2,
				absent: 1,
				total: 28,
			},
			grades: {
				midterm: null,
				finals: null,
			},
		},
	]

	const SubjectCard = ({ subject }: any) => (
		<div
			className="p-4 rounded-lg mb-4 bg-white shadow cursor-pointer"
			onClick={() => setSelectedSubject(subject)}
		>
			<h2 className="text-lg font-bold text-black">{subject.name}</h2>
			<p className="text-sm mt-2 text-gray-600">
				Instructor: {subject.instructor}
			</p>
			<p className="text-sm text-gray-600">Schedule: {subject.schedule}</p>
			<div className="flex justify-between items-center mt-2">
				<p className="text-sm text-gray-600">Attendance:</p>
				<p className="font-bold text-black">
					{(
						(subject.attendance.present / subject.attendance.total) *
						100
					).toFixed(1)}
					%
				</p>
			</div>
		</div>
	)

	const renderSubjectDetails = () => {
		if (!selectedSubject) return null

		const attendancePercentage =
			(selectedSubject.attendance.present / selectedSubject.attendance.total) *
			100

		return (
			<div className="p-4">
				<div className="mb-4 flex justify-between items-center">
					<h2 className="text-xl font-bold text-white">
						{selectedSubject.name}
					</h2>
					<button
						className="p-3 rounded-lg bg-red-800 text-white shadow"
						onClick={() => setSelectedSubject(null)}
					>
						Back
					</button>
				</div>

				{/* Attendance Card */}
				<div className="mt-4 p-4 rounded-lg bg-gray-100">
					<h3 className="text-lg font-bold mb-4 text-black">
						Attendance Summary
					</h3>
					<div className="flex justify-between mb-4">
						<p className="text-black">Attendance Rate:</p>
						<p className="font-bold text-black">
							{attendancePercentage.toFixed(1)}%
						</p>
					</div>
					<div className="flex justify-between">
						<div className="p-2 rounded-lg bg-green-200 flex-1 mr-2 text-center">
							<p className="font-bold">{selectedSubject.attendance.present}</p>
							<p className="text-sm">Present</p>
						</div>
						<div className="p-2 rounded-lg bg-yellow-200 flex-1 mr-2 text-center">
							<p className="font-bold">{selectedSubject.attendance.late}</p>
							<p className="text-sm">Late</p>
						</div>
						<div className="p-2 rounded-lg bg-red-200 flex-1 text-center">
							<p className="font-bold">{selectedSubject.attendance.absent}</p>
							<p className="text-sm">Absent</p>
						</div>
					</div>
				</div>

				{/* Grades Card */}
				<div className="mt-4 p-4 rounded-lg bg-gray-100">
					<h3 className="text-lg font-bold mb-4 text-black">Grade Summary</h3>
					<div className="space-y-2">
						<div className="flex justify-between">
							<p className="text-black">Midterm:</p>
							<p className="text-black">
								{selectedSubject.grades.midterm || "N/A"}
							</p>
						</div>
						<div className="flex justify-between">
							<p className="text-black">Finals:</p>
							<p className="text-black">
								{selectedSubject.grades.finals || "N/A"}
							</p>
						</div>
					</div>
				</div>

				<div className="p-4 mt-4">
					<Link
						className="p-4 rounded-lg w-full bg-red-800 text-white font-bold shadow"
						to="/scanner"
					>
						Scan QR
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div
			className="flex flex-col h-screen"
			style={{
				background: "linear-gradient(45deg, #800000, #A52A2A, #D2691E)",
			}}
		>
			<div className="flex-1 p-4 overflow-y-auto">
				{selectedSubject
					? renderSubjectDetails()
					: studentSubjects.map((subject) => (
							<SubjectCard key={subject.code} subject={subject} />
					  ))}
			</div>
		</div>
	)
}

export default Page
