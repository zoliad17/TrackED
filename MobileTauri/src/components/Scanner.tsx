import {
	Format,
	requestPermissions,
	scan,
	cancel,
} from "@tauri-apps/plugin-barcode-scanner"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const ScannerPage = () => {
	const [val, setVal] = useState<string>("")
	const [screen, setScreen] = useState<string>("none")

	const openScanner = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setVal("")
		try {
			setScreen("scanning")
			let scanned = await scan({
				windowed: true,
				formats: [Format.QRCode],
				cameraDirection: "back",
			})
			setVal(scanned.content)
		} catch (error) {
			console.error("Error scanning: ", error)
		}
		setScreen("none")
	}

	const initCamera = async () => {
		await requestPermissions()
	}

	useEffect(() => {
		initCamera()
	}, [])
	return (
		<div>
			<div
				style={
					screen === "scanning"
						? {
								backgroundColor: "rgba(255, 255, 255, 0.8)",
						  }
						: {
								backgroundColor: "white",
						  }
				}
			></div>
			<button onClick={openScanner}>Scan</button>
			<Link className="" to="/classes" onClick={cancel}>
				Cancel
			</Link>
			<p>{val}</p>
		</div>
	)
}

export default ScannerPage
