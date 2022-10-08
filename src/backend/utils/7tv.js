const EventSource = require("eventsource")
const db = require("../database/database")
module.exports = async function sevenTV() {
    const source = new EventSource(
        "https://events.7tv.app/v1/channel-emotes?channel=ghiletofar"
    )
    source.addEventListener(
        "update",
        async (e) => {
            const data = JSON.parse(e.data)
            switch (data.action) {
                case "ADD":
                    const addEmote = `INSERT INTO public.emotes(name, link, count) VALUES('${data.name}', 'https://cdn.7tv.app/emote/${data.emote_id}/4x.webp', 0)`
                    await db.query(addEmote)
                    break
                case "UPDATE":
                    const updateEmote = `UPDATE public.emotes SET name = '${data.name}' WHERE name = '${data.emote.name}'`
                    await db.query(updateEmote)
                    break
                case "REMOVE":
                    const removeEmote = `DELETE FROM public.emotes WHERE name = '${data.name}'`
                    await db.query(removeEmote)
                    break
            }
        },
        false
    )
}
