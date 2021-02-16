import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import { socket } from '../../Utilities/socket'
import { useLocation } from "react-router-dom";
import { fetchList } from '../../Utilities/Fetch';
import Game from '../Game/Game';

function Lobby() {
    let location = useLocation();
    const [players, setPlayers] = useState([])
    const [quaryUrl, setquaryUrl] = useState(queryString.parse(location.search))
    const [leader, setLeader] = useState(false)
    const [playlist, setPlaylist] = useState(null)
    const [gamePlaying, setgamePlaying] = useState(false)

    useEffect(() => {
        socket.emit('join', quaryUrl, (error) => {
            if (error) {
                alert(error)
            }
        })
        socket.on("roomData", ({ users }) => {
            console.log(users)
            setPlayers(users);
        });
        socket.on("startGame", ({ start }) => {
            fetchList().then((data) => {
                console.log(data)
                setPlaylist(data)
            })
            setgamePlaying(start)

        });
        socket.on("private", (role) => {
            console.log(role)
            setLeader(role.leader)
        });

        return () => {
            // socket.emit('disconnect')
            socket.off()
        }
    }, [quaryUrl])

    const start = () => {
        socket.emit('requestStart', (error) => {
        })
    }

    return (
        <div>
            {gamePlaying ?
                <Game players={players} playlist={playlist} leader={leader} />
                :
                <div>
                    <h2>Players :{players.length}</h2>
                    <h3>waiting for players</h3>
                    <ol>
                        {players && players.map((player, index) => {
                            return (
                                <li key={index}>{player.name} - {player.points}</li>
                            )
                        })}
                        {leader && <button type="submit" onClick={(e) => { start() }}>start the game</button>}
                    </ol>
                </div>
            }
        </div>
    );
}
export default Lobby
