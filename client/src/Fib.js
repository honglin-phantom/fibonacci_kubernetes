import React, { Component } from 'react'; 
import axios from 'axios'; 

class Fib extends Component {
    // initialize state 
    state = {
        seenIndexes: [], 
        values: {}, 
        index: ''
    };

    // life cycle method for data fetching
    componentDidMount() {
        // async keyword guarantees api calls not sequentially 
        this.fetchIndexes(); 
        this.fetchValues(); 
    }

    async fetchValues() {
        // key-value pairs that caches the Fibonacci number with the index 
        const values = await axios.get('/api/values/current'); 
        // update state 
        this.setState({ 
            values: values.data 
        }); 
    }

    async fetchIndexes() {
        const indexes = await axios.get('/api/values/all'); 
        this.setState({ 
            seenIndexes: indexes.data 
        }); 
    }

    // bounded function to an event 
    handleSubmit = async (event) => {
        // prevent form submits itself
        event.preventDefault(); 

        // api call with request body attached 
        await axios.post('/api/values', {
            index: this.state.index
        }); 

        // form clean up 
        this.setState({index: ''}); 
    }; 

    renderSeenIndexes() {
        // iterate over a list of objects' number property via object destructuring in seenIndexes and pull out number only 
        return this.state.seenIndexes.map(({ number }) => number).join(', '); 
    }

    renderValues() {
        const entries = []; 

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]};
                </div>
            ); 
        }

        return entries; 
    }

    // render logic to UI 
    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <label>Enter your index: </label>
                    <input 
                        value={ this.state.index }
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen:</h3>
                {/* helper method to render seen indexes so far */}
                {this.renderSeenIndexes()}

                <h3>Calculated values: </h3>
                {this.renderValues()}
            </div>
        ); 
    }
}

export default Fib; 