import axios from 'axios';
import { socket } from './socket'


//Fetch arguments
let fullList = []
let usedSongs = []
const apiKey = 'AIzaSyAyoLOQoPbUI0kEysyrW2lFq6c4xlz2P_k'
const apiKeyIp = 'b9cd71ee6404c32dc98baf1624fc5ee2f906d1c6d5ba05a58e523574'
const baseUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50`

const fetchList = async (nextpage, playlist) => {
    //with or without next page token
    const pageToken = nextpage ? `&pageToken=${nextpage}` : ''
    const playListid = `PL6Lt9p1lIRZ311J9ZHuzkR5A3xesae2pk`
    return await axios.get(`${baseUrl}${pageToken}&playlistId=${playListid}&key=${apiKey}`)
        .then(function (res) {
            // console.log(`${baseUrl}${pageToken}&playlistId=${playListid}&key=${apiKey}`)

            // handle success
            res.data.items.forEach(element => {
                if (element.snippet.title !== 'Private video') {
                    fullList.push(element)
                }

            });
            if (res.data.nextPageToken) {
                //fetch more with pagetoken
                return fetchList(res.data.nextPageToken)
            } else {
                //shuffle video list
                return generatePlaylist()
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

//find solution for the whole video blocked in your country thing
const getLocation = (videoID) => {
    fetch(`http://gd.geobytes.com/GetCityDetails`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data)
    });
}
const checkVideo = (videoID) => {
    axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoID}&key=${apiKey}`)
        .then(function (res) {
            // console.log(res.data.items[0].contentDetails.regionRestriction)
            getLocation()
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
            // checkVideo(video.snippet.resourceId.videoId)
            active.push(video)
            //pool of songs that used in the game
            usedSongs.push(video)
            shuffled.splice(index, 1);
        }
    });
    socket.emit('activeSongs', { active: active, answers: answerRandomizer }, (error) => {
        if (error) { console.log(error) }
    })
}



export {
    fetchList, generatePlaylist, fullList

}