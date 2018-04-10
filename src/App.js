import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MovieTable, { MovieTableControll, MovieTableManager } from "./components/MovieTable";
import ReactObserver from 'react-event-observer';

class App extends Component {
    constructor(props) {
        super(props);
        this.observer = ReactObserver()
    }
    
    componentDidMount() {
        this.tableControl = ReactObserver()
        this.listener = this.observer.subscribe('table_description_changed', data => {
            console.log('table_description_changed', data)
        })
        console.log('Listener subscribed.')
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to
                    reload.
                </p>
                <div>
                    <MovieTableControll tableControlPublish={this.observer.publish}/>
                    <div className="container">
                        <MovieTable tableControlSubscribe={this.observer.subscribe}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
