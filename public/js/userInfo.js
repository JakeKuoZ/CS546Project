function showUserInfo(data) {
    
    let pFacebook = document.getElementById("facebook")
    let pInstagram = document.getElementById("instagram")
    let pWebsite = document.getElementById("website")
    let pNoSocialMedia = document.getElementById("noSocialMedia")

    if(data.socialMedias.facebook) {
        pFacebook.classList.remove("d-none")
    } else {
        pFacebook.classList.add("d-none")
    }

    if(data.socialMedias.instagram) {
        pInstagram.classList.remove("d-none")
    } else {
        pInstagram.classList.add("d-none")
    }

    if(data.socialMedias.website) {
        pWebsite.classList.remove("d-none")
    } else {
        pWebsite.classList.add("d-none")
    }
    if(Object.keys(data.socialMedias).length === 0) {
        pNoSocialMedia.innerText = "This user has not posted any social media."
    } else {
        pNoSocialMedia.innerText = ""
    }
}
