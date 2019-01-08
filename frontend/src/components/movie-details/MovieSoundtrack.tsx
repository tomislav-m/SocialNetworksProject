import * as React from 'react';

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
                        ? <h5>{this.props.soundtrackTitle}</h5>
                        : "no information"
                    }   
                </div>
                
                <div>
                    <b>Artists: &nbsp;</b>
                    {
                        this.props.artists.length !== 0
                        ? this.props.artists.map((artist: any) => (
                            <h5>
                                {artist}
                            </h5>
                        ))
                        : "no information"
                    }
                </div>
                <div>
                    <b>Songs:&nbsp;</b>
                    {
                        this.props.soundtracks.length !== 0
                        ? this.props.soundtracks.map((soundtrack: any) => (
                            <h5>
                                {
                                    soundtrack.title 
                                }&nbsp;
                                ({
                                    soundtrack.duration !== null
                                    ? soundtrack.duration
                                    : "no information"
                                })
                                
                                {
                                 /*   (soundtrack.artistsList !== null)
                                    ? soundtrack.artistsList.map((artist: any) => (
                                        artist
                                    ))
                                    : "no infomation"*/
                                }
                                
                            </h5>
                        ))
                        : "no information"
                    }
                </div>
            </div>
        );
    }
}