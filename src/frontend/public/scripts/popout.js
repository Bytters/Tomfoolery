const poput = document.getElementById("poput")
const cancel = document.getElementById("cancel")
const emForms = document.querySelectorAll(".emotes-form label")

emForms.forEach((click) => {
    click.addEventListener("click", () => {
        poput.style.display = "block"
    })
})

cancel.addEventListener("click", () => {
    poput.style.display = "none"
})
