import { fetchList,generatePlaylist, fullList } from '../../Utilities/Fetch';
import React, { useState, useEffect } from 'react'
import { socket } from '../../Utilities/socket'
import "./Game.css";

function Game(props) {
    // const [videos, setvideosList] = useState([])
    const [songsPool, setsongsPool] = useState([])
    const [activeSongs, setactiveSongs] = useState(null)
    const [streamingStatus, setstreamingStatus] = useState('')
    const [userInteraction, setuserInteraction] = useState('auto')
    const [answerNotification, setanswerNotification] = useState(null)
    const [players, setplayers] = useState(props.players)
    const [roundCount, setroundCount] = useState(1)
    const [roundOver, setroundOver] = useState(false)
    
    useEffect(() => {
        socket.on("roundPool", (data) => {
            console.log(data)
            setactiveSongs(data.active)
            setstreamingStatus(data.answers)
        });
        socket.on("roomData", ({ users, name }) => {
            setanswerNotification(`${name} answered right!`)
            setuserInteraction('none')
            setroundOver(true)
            setplayers(users)
        });
        // socket.on("announceWinner", ({ users }) => {
        //     setplayers(users)
        // });
        socket.on("answers", (data) => {
            console.log(data)
        });
    }, [])

    const play = () => {
        generatePlaylist()
        setanswerNotification(null)
        setroundOver(false)
        setroundCount(roundCount +1)
    }



    const userGuessed = (e, title, videoID) => {
        let selectedAnswer = e.target.childNodes[1].src.slice(41)
        if (selectedAnswer === '?autoplay=1') {
            console.log('right answer')
            socket.emit('rightAnswer', 'test', (error) => {
                if (error) { console.log(error) }
            })
            setuserInteraction('none')
            // setanswerStatus(`You answered right :) ! it is ${title}`)
        } else {
            //implement the right answer song title here
            setanswerNotification(`You answered wrong :(`)
            setuserInteraction('none')
        }
    }

    return (
        <div>
            {(activeSongs && props.leader) && <button onClick={play}>{activeSongs.length ? 'NEXT' : 'PLAY'}</button>}
            <p>amount of songs left {fullList.length}</p>
            <p>name - score</p>
            {players.map((player, index) => {
                return (
                    <div key={index} id={index}>
                        <p>{player.name} - {player.points}</p>
                    </div>
                )
            })}
            <h3>Round {roundCount}</h3>
            {answerNotification}
            {activeSongs ? activeSongs.map((video, index) => {
                return (
                    <div key={index} id={index} style={{ 'pointerEvents': `${userInteraction}` }}>
                        <div onClick={(e) => { userGuessed(e, video.snippet.title, video.snippet.resourceId.videoId) }} style={{ 'cursor': 'pointer' }}>{video.snippet.title}
                            <iframe title={index} width="50" height="50" src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}${streamingStatus[index]}&start=25&end=55&disablekb=1`}></iframe>
                        </div>
                    </div>
                )
            }) : <img src="https://i.imgur.com/A7gVDjw.gif" alt=""/> }
        </div>
    )
}

export default Game
