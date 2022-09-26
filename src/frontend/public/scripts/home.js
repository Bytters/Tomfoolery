const changeText = document.getElementById("changeText")
const date = new Date()
const getHours = date.getHours()
console.log(getHours)
switch (true) {
    case getHours >= 13 && getHours <= 18:
        changeText.innerHTML = "Boa tarde"
        break
    case getHours >= 19 && getHours <= 23:
        changeText.innerHTML = "Boa noite"
        break
    case getHours >= 00 && getHours <= 05:
        changeText.innerHTML = "Vai dormir!!!!!!"
        break
    default:
        changeText.innerHTML = "Bom dia"
        break
}
