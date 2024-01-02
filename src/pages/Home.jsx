// import Uploadform from "../components/Uploadform"
import NavBar from "../components/Navbar"
// import Header from "../components/Header"
import ImageGallery from "../components/ImageGallery"
//import { useAuth } from "../hooks/useAuth"


const Home = () => {
  // const { user }=useAuth();
  // console.log(user);
  return (
    <div className="max-w-4xl mx-auto">
      {/* <Header/> */}
      <NavBar/>
      <ImageGallery page="pub"/>
    </div>
  )
}

export default Home


