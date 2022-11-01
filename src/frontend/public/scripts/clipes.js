const next = document.getElementById("next")
const select_clipe = document.getElementById("select-clip")
const back = document.getElementById("back")
const value = document.getElementById("clipes")
const twitch_clips = document.getElementById("twitch-clips")
let i = 0

select_clipe.addEventListener("click", () => {
    if (select_clipe.innerHTML === "Selecionar clip") {
        select_clipe.style.backgroundColor = "#ffffff"
        select_clipe.style.color = "#000000"
        select_clipe.style.width = "12rem"
        select_clipe.textContent = "Selecionado!"
    } else {
        select_clipe.textContent = "Selecionar clip"
        select_clipe.style.width = "15.8%"
        select_clipe.style.backgroundColor = "#101116"
        select_clipe.style.color = "#ffffff"
    }
})

twitch_clips.setAttribute(
    "src",
    `https://clips.twitch.tv/embed?clip=${clipes[0]}&parent=tomfoolery.herokuapp.com`
)

twitch_clips.setAttribute("value", `${clipes[0]}`)
value.setAttribute("value", clipes[0])


back.addEventListener("click", () => {
    if (i <= 0) {
        i = clipes.length
    }
    i--
    return setClipes(i)
})
next.addEventListener("click", () => {
    if (i >= clipes.length - 1) {
        i = -1
    }
    i++
    return setClipes(i)
})

function setClipes(id) {
    const urlClip = `https://clips.twitch.tv/embed?clip=${clipes[id]}&parent=tomfoolery.herokuapp.com`

    return (
        twitch_clips.setAttribute("src", urlClip),
        twitch_clips.setAttribute("value", clipes[id]),
        value.setAttribute("value", clipes[id])
    )
}
