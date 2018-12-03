import * as React from 'react';

export default class TopWatched extends React.Component {

    public getTopWatched(){
        fetch('https://example.com/posts')
        .then(response => response.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
    }

    public render() {
        return (
            <div>
                TopWatched
            </div>
        );
    }
}