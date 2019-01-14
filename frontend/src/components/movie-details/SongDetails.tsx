import * as React from 'react';

interface IProps {
    soundtrackTitle: string;
    duration: string;
}
interface IState {
    changedTitle: string;
}
export default class SongDetails extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            changedTitle: "https://www.youtube.com/results?search_query=" + this.props.soundtrackTitle.replace(/ /g, "+")
        }
    }

    public render() {
        return (
            <div>
                <a href={this.state.changedTitle}>{this.props.soundtrackTitle}</a>
                &nbsp;
                ({
                    this.props.duration !== null && this.props.duration !== ""
                    ? this.props.duration
                    : "No information"
                })
            </div>
        );
    }
}