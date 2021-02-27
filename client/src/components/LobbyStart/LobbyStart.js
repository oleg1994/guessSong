import React from 'react'
import { socket } from '../../Utilities/socket'

function LobbyStart({listUrl,playlistInput,leader}) {

    const start = () => {
        socket.emit('requestStart', (error) => {
        })
    }



    return (
        <div>
            { leader &&
                <div>
                    <label htmlFor="room">playlist url</label>
                    <input type="text" name="playlist" placeholder='playlist' onChange={(e) => playlistInput(e.target.value)} />
                    <button onClick={e => (listUrl ) ? start() : null}>start the game</button>
                </div>
            }
        </div>
    )
}

export default LobbyStart
