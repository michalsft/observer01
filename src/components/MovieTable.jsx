import React from 'react'
//import 'bootstrap' from 'react-bootstrap'
import { Glyphicon, Form, FormGroup, Checkbox, Label } from 'react-bootstrap'
import MicroEvent from './../microevent'

class MovieType extends React.Component {
    render() {
        const type_resolve = {
            'movie': 'film',
            'tvSeries': 'retweet',
            'tvShort': 'eye-close',
            'short': 'eye-close',
            'tvEpisode': 'check',
            'video': 'facetime-video',
        }
        let icon = (type_resolve[this.props.titleType]) ? type_resolve[this.props.titleType] : 'arrow-down'
        return <Glyphicon glyph={icon} />
    }
}

var Ticker = function(){
    var self = this;
    setInterval(function(){
        self.trigger('tick', new Date());
    }, 1000);
};

export class MovieTableControll extends React.Component {
    constructor(props) {
        super(props)
        console.log('Constructor od MTC', this.props.tableControlPublish)
    }

    componentDidMount() {
        MicroEvent.mixin(Ticker)
        this.ticker = new Ticker()
        this.ticker.bind('tick', date => {
            console.log('notified date', date)
        })
    }

    handleChange = (e) => {
        console.log('Changed')
        this.props.tableControlPublish('table_description_changed', 1)
    }

    render() {
        return <form action="none">
                <FormGroup>
                    <Checkbox onChange={this.handleChange}>Show descriptions</Checkbox>
                </FormGroup>
            </form>
    }
}

class MovieTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            descriptions: false,
        }
    }

    componentDidMount() {
        this.listener = this.props.tableControlSubscribe('table_description_changed', data => {
            this.toggle_descriptions(this.state)
            console.log('Listener WORKS!')
        })
    }
    
      
    toggle_descriptions(prevState) {
        this.setState({
            descriptions: !prevState.descriptions,
        })
    }

    render() {
        const data_file = require('./../movies.json')
        const headers = [
            "titleType",
            "primaryTitle",
            "originalTitle",
            "isAdult",
            "startYear",
            "endYear",
            "runtimeMinutes",
            "genres",
        ].map(h => <th key={h}>{h}</th>)


        return (
            <div className="table-responsive">
                <table className="table table-small-font table-bordered table-striped">
                    <thead>
                        <tr>
                           {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {data_file.map(movie => (
                            <tr key={movie.tconst}>
                                <td><MovieType titleType={movie.titleType} />{this.state.descriptions && movie.titleType}</td>
                                <td>{movie.primaryTitle}</td>
                                <td>{movie.originalTitle}</td>
                                <td>{movie.isAdult}</td>
                                <td>{movie.startYear}</td>
                                <td>{movie.endYear}</td>
                                <td>{movie.runtimeMinutes}</td>
                                <td>{movie.genres}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MovieTable