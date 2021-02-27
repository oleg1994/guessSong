import axios from 'axios';
import { socket } from './socket'


let fullList = []
let usedSongs = []
const apiKey = 'AIzaSyAyoLOQoPbUI0kEysyrW2lFq6c4xlz2P_k'
const baseUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50`

const fetchList = (playList, nextpage) => {
    //with or without next page token
    const pageToken = nextpage ? `&pageToken=${nextpage}` : ''
    if (playList) {
        let id = playList.slice(38)
        // console.log(`${baseUrl}${pageToken}&playlistId=${id}&key=${apiKey}`)
        axios.get(`${baseUrl}${pageToken}&playlistId=${id}&key=${apiKey}`)
            .then(function (res) {
                console.log(res, 'res')
                if (res.status === 200) {
                    // filter out private videos
                    let videos = res.data.items
                    videos.forEach(element => {
                        if (element.snippet.title !== 'Private video') {
                            fullList.push(element)
                        }
                    });
                    if (res.data.nextPageToken) {
                        //fetch more with pagetoken
                        return fetchList(playList, res.data.nextPageToken)
                    } else {
                        //shuffle video list
                        return generatePlaylist()
                    }
                }else{
                    return 'error'
                }

            }).catch(function (err) {
                return err
            })
    }
}

//find solution for the whole video blocked in your country thing

const checkVideo = (videoID) => {
    axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoID}&key=${apiKey}`)
        .then(function (res) {
            // console.log(res.data.items[0].contentDetails.regionRestriction)
            console.log(res)
        })
        .catch(function (error) {
            console.log(error);
        })
}

const generatePlaylist = (params) => {
    let shuffled = fullList.sort(() => 0.5 - Math.random())
    //select random video to play
    let answerRandomizer = [null, '?autoplay=1', null, null].sort(() => 0.5 - Math.random())
    let active = []
    shuffled.forEach((video, index) => {
        if (index < 4) {
            checkVideo(video.snippet.resourceId.videoId)
            active.push(video)
            //pool of songs that used in the game
            usedSongs.push(video)
            shuffled.splice(index, 1);
        }
    });
    socket.emit('activeSongs', { active: active, answers: answerRandomizer }, (error) => {
        if (error) { console.log(error) }
    })
    return 'clear'
}



export {
    fetchList, generatePlaylist, fullList

}