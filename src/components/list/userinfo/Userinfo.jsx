import "./userinfo.css";
import { useUserStore } from "../../../lib/userStore.js";

const Userinfo = () => {
    
    const { currentUser } = useUserStore();

    return (
        <div className='userinfo'>
            <div className="user">
                <img src="./avatar.png" alt="Avatar"/>
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="More"/>
                <img src="./video.png" alt="Video"/>
                <img src="./edit.png" alt="Edit"/>
            </div>
        </div>
    );
}

export default Userinfo;
