import admin from "./admin"
import { cd } from "./cd"
import { dir } from "./dir"
import ping from "./ping"
import save from "./save"
import { send } from "./send"
import user from "./user"

type Command = {
    [key: string]: any
} 

const commands: Command = {
    ping,
    user,
    admin,
    save,
    dir,
    cd,
    send
}

export default commands