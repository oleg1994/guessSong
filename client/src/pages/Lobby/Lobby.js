import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import { socket } from '../../Utilities/socket'
import { useLocation } from "react-router-dom";
import { fetchList } from '../../Utilities/Fetch';
import Game from '../Game/Game';
import LobbyStart from '../../components/LobbyStart/LobbyStart';
import PlayerList from '../../components/PlayerList/PlayerList';

function Lobby() {
    let location = useLocation();
    const [players, setPlayers] = useState([])
    const [quaryUrl, setquaryUrl] = useState(queryString.parse(location.search))
    const [leader, setLeader] = useState(false)
    const [playlist, setPlaylist] = useState(null)
    const [gamePlaying, setgamePlaying] = useState(false)
    const [listUrl, setlistUrl] = useState('')
    const [safetoStart, setsafetoStart] = useState(false)
    const [loading, setloading] = useState(false)



    useEffect(() => {
        socket.emit('join', quaryUrl, (error) => {
            if (error) {
                alert(error)
            }
        })
        socket.on("roomData", ({ users }) => {
            setPlayers(users);
        });
        socket.on("private", (role) => {
            setLeader(role.leader)
        });

        return () => {
            // socket.emit('disconnect')
            socket.off()
        }
    }, [quaryUrl])

    useEffect(() => {
        socket.on("startGame", ({ start }) => {
            setgamePlaying(start)
            // fetchList(listUrl)
            console.log(fetchList(listUrl))

        });
    }, [listUrl])



    const playlistInput = (url) => {
        setlistUrl(url)
    }


    return (
        <div>
            {gamePlaying ?
                <Game players={players} playlist={playlist} leader={leader} loading={loading} />
                :
                <>
                    <PlayerList players={players} />
                    <LobbyStart leader={leader} playlistInput={playlistInput} listUrl={listUrl} safetoStart={safetoStart} />
                </>
            }
        </div>
    );
}
export default Lobby
