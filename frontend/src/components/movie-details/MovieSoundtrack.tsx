import * as React from 'react';
import SongDetails  from 'src/components/movie-details/SongDetails';

interface IProps {
    soundtracks: any[];
    artists: any[];
    soundtrackTitle: string;
}
export default class MovieSoundtrack extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <div>
                    <b>Soundtrack title:&nbsp;</b>
                    {
                        this.props.soundtrackTitle !== ""
                        ? this.props.soundtrackTitle
                        : "No information"
                    }   
                </div>
                
                <div>
                    <br/>
                    <b>Artists: &nbsp;</b>
                    {
                        this.props.artists.length !== 0
                        ? this.props.artists.map((artist: any) => (
                            artist
                        ))
                        : "No information"
                    }
                </div>
                <div>
                    <br/>
                    <b>Songs:&nbsp;</b>
                    {
                        this.props.soundtracks.length !== 0
                        ? this.props.soundtracks.map((soundtrack: any) => (
                            <SongDetails soundtrackTitle = {soundtrack.title} duration = {soundtrack.duration}/>
                        ))
                        : "No information"
                    }
                </div>
            </div>
        );
    }
}