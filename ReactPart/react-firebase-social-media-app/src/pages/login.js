import React, { Component } from 'react'

import PropTypes from 'prop-types';
import AppIcon from "../images/tic.png"


//React Library
import axios from "axios";
import { Link } from 'react-router-dom'

//MateriralUI
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button"
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    form:{
        textAlign:'center'
    },
    LoginAndImage:{
        margin:"1rem"
    },
    pageTitle:{
        display:"inline",
        margin:"1rem"
    },
    AppIconCss:{
        margin:"auto"
    },
    textField:{

    },
    button:{
        margin:"1rem auto",
        position:"relative"
    },
    errorMessage:{
        color:"red"
    },
    signUpLink:{
        display:"block",
        margin:"1rem"
    },
    progress:{
        position:"absolute",
        color:"green",
        size:30

    }
}



class Login extends Component {

    constructor(){
        super();
        this.state = {
            email:"",
            password:"",
            loading: false,
            errors:{}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    handleSubmit = event =>{
        console.log(event.target);
        event.preventDefault();
        this.setState({
            loading:true
        });
        const userData = {
            email:this.state.email,
            password:this.state.password
        }
        axios.post('/login',userData)
            .then(res =>{
                // console.log("res.data : " , res.data)
                localStorage.setItem('FBIdToken',`Bearer ${res.data}`)
                this.setState({
                    laoding:false
                })
                this.props.history.push('/');
            })
            .catch(err=>{
                console.log(err.code);
                this.setState({
                    errors: err.response.data,
                    loading:false
                })
            })
    }
    
    handleChange = event=>{
        this.setState({
            [event.target.name]: event.target.value,
            errors: {
                error:""
            }
        })
    }



    render() {
        console.log(this.states)
        const { classes } = this.props;
        const {errors,loading} = this.state
        console.log("errors",errors)
        return (
            <Grid container className={classes.form}>
                <Grid item sm={12} xs={12}/>
                <Grid item sm={12} xs={12} >
                        <div className={classes.LoginAndImage}>
                            <Typography variant="h3" className={classes.pageTitle}>
                                Login
                            </Typography>
                            <img className={classes.AppIconCss} width="50" src={AppIcon} alt="App Icon" />
                        </div>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        className={classes.textField}
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        value={this.state.email}
                        onChange={this.handleChange} fullWidth />
                        <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        helperText={errors.password}
                        error={errors.password ? true : false}
                        value={this.state.password}
                        onChange={this.handleChange} fullWidth />
                        <small className = {classes.signUpLink}>Don't have an account ? <Link to="/signup">Sign Up</Link></small>
                        <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={loading}
                        >
                            Login
                            {loading && <CircularProgress className={classes.progress}/>}
                        </Button>
                    
                    </form>
                    <h4 style = {classes.errorMessage} style = {{display: !errors.error && "none"}}>Email or Password is wrong</h4>

                </Grid>
                <Grid item sm />
            </Grid>
        )
    }
}

 {/* Login.PropTypes = {
     classes: PropTypes.object.isRequired
 } */}

export default withStyles(styles)(Login)
