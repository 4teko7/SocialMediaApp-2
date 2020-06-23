import React, { Component } from 'react'

//React Library
import axios from "axios";

//MaterialUi
import Grid from '@material-ui/core/Grid'

//Components
import Scream from "../components/Scream"


class Home extends Component {
    
    constructor(){
        super();
        this.state = {
            screams: null
        }
    }

    componentDidMount(){
        axios.get("/screams")
            .then(res =>{
                console.log(res.data)
                this.setState({
                    screams: res.data
                })
            })
            .catch(err =>console.log(err));
    }



    render() {
        let recentScreamsMarkup = this.state.screams ? (
        this.state.screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
        ) : <p>Loading...</p>
        return (
            <Grid container spacing={10}>
                <Grid item  sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Content Right</p>
                </Grid>
            </Grid>
        )
    }
}

export default Home
