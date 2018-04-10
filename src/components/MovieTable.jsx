import React from "react";
import PropTypes from "prop-types";
//import 'bootstrap' from 'react-bootstrap'
import { Glyphicon, Form, FormGroup, Checkbox } from "react-bootstrap";
import MicroEvent from "./../microevent";

/*

This solutions allows have many controls of the exact one table, but requires to manually
manage proper name propagation.
Also it requires to parent component to provide observer methods to nested components.
Hence, the state of the control is not synchronized between them and can cause strange results.

@todo pobawić się stanami (Redux)
@todo wprowadzić podwójnych obserwatorów, jeden na stan tablicy, drugi na stan kontrolki
    ewentualnie zmienić przekazywanie funkcji na przekazywanie observera.

    A może w obóle zrobić przekazywanie 'stanu' w obiekcie "data" eventu observera

*/

class MovieType extends React.Component {
    render() {
        const type_resolve = {
            movie: "film",
            tvSeries: "retweet",
            tvShort: "eye-close",
            short: "eye-close",
            tvEpisode: "check",
            video: "facetime-video"
        };
        let icon = type_resolve[this.props.titleType]
            ? type_resolve[this.props.titleType]
            : "arrow-down";
        return <Glyphicon glyph={icon} />;
    }
}

MovieType.propTypes = {
    titleType: PropTypes.string
};

var Ticker = function() {
    var self = this;
    setInterval(function() {
        self.trigger("tick", new Date());
    }, 5000);
};

export class MovieTableControll extends React.Component {
    constructor(props) {
        super(props);
        console.log("Constructor od MTC", this.props.tableControlPublish);
    }

    componentDidMount() {
        MicroEvent.mixin(Ticker);
        this.ticker = new Ticker();
        this.ticker.bind("tick", date => {
            console.log("notified date", date);
        });
    }

    handleChange = () => {
        console.log("Changed");
        this.props.tableControlPublish(
            `${this.props.tableControlName}table_description_changed`,
            1
        );
    };

    render() {
        return (
            <Form>
                <FormGroup>
                    <Checkbox onChange={this.handleChange}>
                        Show descriptions
                    </Checkbox>
                </FormGroup>
            </Form>
        );
    }
}

MovieTableControll.propTypes = {
    tableControlName: PropTypes.string.isRequired,
    tableControlPublish: PropTypes.func
};

class MovieTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptions: false
        };
    }

    componentDidMount() {
        this.listener = this.props.tableControlSubscribe(
            `${this.props.tableControlName}table_description_changed`,
            data => {
                this.toggle_descriptions(this.state);
                console.log("Listener WORKS!", data);
            }
        );
    }

    toggle_descriptions() {
        this.setState(prevState => ({
            descriptions: !prevState.descriptions
        }));
    }

    render() {
        const data_file = require("./../movies.json");
        const headers = [
            "titleType",
            "primaryTitle",
            "originalTitle",
            "isAdult",
            "startYear",
            "endYear",
            "runtimeMinutes",
            "genres"
        ].map(h => <th key={h}>{h}</th>);

        return (
            <div className="table-responsive">
                <table className="table table-small-font table-bordered table-striped">
                    <thead>
                        <tr>{headers}</tr>
                    </thead>
                    <tbody>
                        {data_file.map(movie => (
                            <tr key={movie.tconst}>
                                <td>
                                    <MovieType titleType={movie.titleType} />
                                    {this.state.descriptions && movie.titleType}
                                </td>
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

MovieTable.propTypes = {
    tableControlName: PropTypes.string.isRequired,
    tableControlSubscribe: PropTypes.func
};

export default MovieTable;
