import React from 'react'

function PlayerList({players}) {
    return (
        <div>
            <h2>Players :{players.length}</h2>
            <h3>waiting for players</h3>
            <ol>
                {players && players.map((player, index) => {
                    return (
                        <li key={index}>{player.name} - {player.points}</li>
                    )
                })}
            </ol>
        </div>
    )
}

export default PlayerList
