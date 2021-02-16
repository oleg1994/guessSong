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
//test
    useEffect(() => {
        socket.on("roundPool", (data) => {
            console.log(data)
            setactiveSongs(data.active)
            setstreamingStatus(data.answers)
        });
        socket.on("roomData", ({ users, name }) => {
            let test = 0
            console.log(test+1)
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

    useEffect(() => {
        fetchList()
    }, [])


    const play = () => {
        generatePlaylist()
        setanswerNotification(null)
        setroundOver(false)
        setroundCount(roundCount +1)

        // let videos = props.playlist
        // //shuffle video list
        // let shuffled = videos.sort(() => 0.5 - Math.random())
        // //select random video to play
        // let answerRandomizer = [null, '?autoplay=1', null, null].sort(() => 0.5 - Math.random())
        // let active = []
        // //songs shuffeled
        // shuffled.forEach((element, index) => {
        //     if (index < 4) {
        //         active.push(element)
        //         //pool of songs that used in the game
        //         songsPool.push(element)
        //         shuffled.splice(index, 1);
        //     }
        // });
        // //songs currently in the game
        // socket.emit('activeSongs', { active: active, answers: answerRandomizer }, (error) => {
        //     if (error) { console.log(error) }
        // })

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
            <p>{fullList.length}</p>
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
                            <iframe title={index} width="50" height="50" src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}${streamingStatus[index]}`}></iframe>
                        </div>
                    </div>
                )
            }) : <img src="https://i.imgur.com/A7gVDjw.gif" alt=""/> }
        </div>
    )
}

export default Game
