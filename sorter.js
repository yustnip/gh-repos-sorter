const urlApi = require( 'url' )
const fs = require( 'fs' )
const fetch = require( 'node-fetch' )

const sourceArr = _getArr()
let lastIteration = false
let currentIndex = 0
let composedData = []

const clientId = process.argv[ 3 ]
const clientSecret = process.argv[ 4 ]

function _changeIndex() {
    const sourceArrLength = sourceArr.length
    if ( currentIndex === sourceArrLength - 1 ) {
        lastIteration = true
    } else {
        currentIndex += 1
    }
}

function _getPath( url ) {
    const parsedUrl = urlApi.parse( url )
    const path = parsedUrl.pathname
    return path
}

function _getSourceContent() {
    const directory = process.argv[ 2 ]
    const content = fs.readFileSync( directory, 'utf8' )
    return content
}

function _getArr() {
    const content = _getSourceContent()
    const pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    const arr = content.match( pattern )
    return arr
}

function _composeGhUrl( path ) {
    if ( clientId && clientSecret ) {
        const authData = '?client_id=' + clientId + '&client_secret=' + clientSecret
        let ghUrl = 'https://api.github.com/repos' + path + authData
        return ghUrl
    } else {
        let ghUrl = 'https://api.github.com/repos' + path
        return ghUrl
    }
}

function _createFile() {
    function compare( a, b ) {
        if ( a.stargazers_count < b.stargazers_count )
            return -1
        if ( a.stargazers_count > b.stargazers_count )
            return 1
        return 0
    }
    
    const sortedArr = composedData.sort( compare )
    const reversedArr = sortedArr.reverse()
    let content = ''
    
    sortedArr.forEach( ( item ) => {
        let line = item.html_url + ' (' + item.stargazers_count + ')\n'
        content += line
    } )
    
    fs.writeFile( 'repos.txt', content, function( err ) {
        if ( err ) {
            return console.log( err )
        } else {
            console.log( 'The file has been composed!' )
        }
    } )
}

function _composeData( ghUrl ) {
    fetch( ghUrl )
        .then( ( response ) => {
            return response.text()
        } )
        .then( ( data ) => {
            const obj = JSON.parse( data )
            let item = {
                html_url: obj[ 'html_url' ],
                stargazers_count: obj[ 'stargazers_count' ]
            }
            
            if ( lastIteration ) {
                _createFile()
            } else {
                composedData.push( item )
                _changeIndex()
                _makeRequest()
            }
        } )
}

function _makeRequest() {
    const currentUrl = sourceArr[ currentIndex ]
    const path = _getPath( currentUrl )
    const ghUrl = _composeGhUrl( path )
    _composeData( ghUrl )
}

function startComposeFile() {
    _makeRequest()
}

startComposeFile()
