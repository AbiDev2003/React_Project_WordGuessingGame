import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import video from './../assets/demo.mp4'

function VideoPage() {
    const videoRef = useRef(null)
    const navigate = useNavigate();
    useEffect(() => {
        // autoplay the video immediately when component renders
        if(videoRef.current){
            videoRef.current.play().catch(() => {}) //catch the error is autoplay is blocked
        }
    }, []); 
    return (
        <div 
           style={{
            display:"flex", 
            flexDirection:"column", 
            alignItems:"center", 
            justifyContent:"center"
        }}
        
        >
            <video 
                style={{ 
                    borderRadius:"0.5rem",
                    boxShadow:"2rem",
                    width:"22rem",
                    maxWidth:"100%"
                }}
                ref={videoRef}
                src={video} 
                alt = "Video demo"
            >
                Sorry for the inconvinience. Your browser don't support embedded videos
            </video>
            <button className='close-btn' 
                onClick={() => navigate('./../')}
            >
                Close Video X
            </button>
        </div>
    )
}

export default VideoPage