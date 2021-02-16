import React, { useState } from 'react'

import {
    Link
} from "react-router-dom";

function Connect() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div>
            <label htmlFor="nick">Name</label>
            <input type="text" name="Name" id="" placeholder='name'  onChange={(event) => setName(event.target.value)} />
            <label htmlFor="room">Room</label>
            <input type="text" name="room" id="" placeholder='room'  onChange={(event) => setRoom(event.target.value)} />
            <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/play?name=${name}&room=${room}`}>
                <button  type="submit">enter</button>
            </Link>
        </div>
    )
}

export default Connect
