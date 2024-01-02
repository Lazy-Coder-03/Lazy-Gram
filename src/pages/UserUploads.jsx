// import React from 'react'
// import PropTypes from 'prop-types'
import Navbar from '../components/Navbar'
import ImageGallery from '../components/ImageGallery'

function UserUploads() {
    return (
        <div className = "max-w-4xl mx-auto">
            <Navbar />
            <ImageGallery page="user" />
        </div>
    )
}

// UserUploads.propTypes = {

// }

export default UserUploads

