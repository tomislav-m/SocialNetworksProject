import * as React from 'react';
import YouTube from 'react-youtube';

interface IProps {
    trailerID: string
}


export default class MovieTrailer extends React.Component<IProps> {

    public onReady(event: any) {
        event.target.pauseVideo();
    }

    public render() {
        
        return (
            <div>
                <br/>
                <b>Trailer:</b>
                <br/>
                <br/>
                <YouTube videoId={this.props.trailerID} onReady={this.onReady}/>
            </div>
        );
    }
}