import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import VideoPage from "./VideoPage"
function VideoNavigate() {
  return (
    <div>
        <Router>
            <Routes>
                <Route
                    path = "/"
                    element = {
                        <div>
                            <Link to='/video'>
                                <button className="open-btn">Play demo tutorial</button>
                            </Link>
                        </div>
                    }
                />
                <Route
                    path = "/video"
                    element = {
                        <VideoPage/>
                    }
                />
            </Routes>
        </Router>
    </div>
  )
}

export default VideoNavigate