const element = document.getElementById("login")
const url =
    "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=m2svdyi6a64r0b20cbmhte48x2pn6a&redirect_uri=https://tomfoolery.herokuapp.com/users/login&scope="

element.addEventListener("click", () => {
    element.target = "_blank"
    element.href = url
    window.setTimeout(() => {
        window.close()
    }, 2000)
})
