import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
	const [studentEmail, setStudentEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const navigate = useNavigate()

	const baseURL = "https://cb784zfr-8000.asse.devtunnels.ms"

	useEffect(() => {
		const authenticated = localStorage.getItem("isAuthenticated");
		if (authenticated && !sessionStorage.getItem("hasNavigated")) {
			sessionStorage.setItem("hasNavigated", "true");
			navigate("/classes");
		}
	}, [navigate]);
	

	const handleLogin = async () => {
		try {
			await fetch(`${baseURL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: studentEmail,
					password: password,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.access_token) {
						localStorage.setItem("isAuthenticated", "true")
						localStorage.setItem("token", '')
						const tokenPayload = JSON.parse(
							atob(data.access_token.split(".")[1])
						)

						localStorage.setItem("userRole", tokenPayload.roleType)
						localStorage.setItem("userId", tokenPayload.id)

						if (tokenPayload.roleType == "student") {
							navigate("/classes")
						}
					}
				})
				.catch((err) => console.log(err))
		} catch (error) {
			console.error("Login error:", error)
			alert("Failed to login. Please try again.")
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-[#800000] via-[#A52A2A] to-[#D2691E]">
			{/* Logo/Header Section */}
			<div className="text-center mb-8">
				<div className="mx-auto w-40 h-40 mb-4">
					<img
						src="../assets/icon-mobile.png"
						alt="TrackEd Logo"
						className="w-full h-full"
					/>
				</div>
				<h1 className="text-3xl font-bold text-white mb-2 font-['Space_Mono']">
					TrackEd
				</h1>
				<p className="text-white opacity-80">Tracking Education Seamlessly</p>
			</div>

			{/* Login Form */}
			<div className="bg-white bg-opacity-95 rounded-lg p-8 shadow-lg max-w-md mx-auto w-full">
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 block">
							Student Email
						</label>
						<input
							className="w-full p-4 rounded-lg border border-[#800000] bg-white bg-opacity-90"
							type="email"
							placeholder="Enter your Student Email"
							value={studentEmail}
							onChange={(e) => setStudentEmail(e.target.value)}
							autoCapitalize="none"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 block">
							Password
						</label>
						<div className="relative">
							<input
								className="w-full p-4 rounded-lg border border-[#800000] bg-white bg-opacity-90"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								className="absolute right-0 top-0 p-4 text-gray-600"
								onClick={() => setShowPassword(!showPassword)}
								type="button"
							>
								{showPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div className="text-right">
						<button className="text-sm text-[#800000]">Forgot password?</button>
					</div>

					<button
						className="w-full p-4 rounded-lg bg-[#800000] text-white font-bold shadow-md"
						onClick={handleLogin}
					>
						Sign In
					</button>
				</div>
			</div>

			{/* Footer */}
			<div className="mt-8 text-center">
				<p className="text-sm text-white opacity-80">
					Having trouble signing in?
				</p>
				<button className="mt-2 text-sm font-medium text-white">
					Contact Support
				</button>
			</div>
		</div>
	)
}

export default LoginPage
