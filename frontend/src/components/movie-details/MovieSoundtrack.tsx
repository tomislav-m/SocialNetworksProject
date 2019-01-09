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
                        : "no information"
                    }   
                </div>
                
                <div>
                    <b>Artists: &nbsp;</b>
                    {
                        this.props.artists.length !== 0
                        ? this.props.artists.map((artist: any) => (
                            artist
                        ))
                        : "no information"
                    }
                </div>
                <div>
                    <b>Songs:&nbsp;</b>
                    {
                        this.props.soundtracks.length !== 0
                        ? this.props.soundtracks.map((soundtrack: any) => (
                            <SongDetails soundtrackTitle = {soundtrack.title} duration = {soundtrack.duration}/>
                        ))
                        : "no information"
                    }
                </div>
            </div>
        );
    }
}