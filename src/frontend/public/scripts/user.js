const user = document.getElementById("user")
const usercard = document.getElementById("usercard")
const myModal = document.getElementById("myModal")

user.addEventListener("click", (e) => {
    usercard.style.opacity = 1
    usercard.style.visibility = "visible"
})


document.body.addEventListener("mouseup", (e) => {
    if (e.target !== myModal) {
        usercard.style.opacity = 0
        usercard.style.visibility = "hidden"
    }
})
