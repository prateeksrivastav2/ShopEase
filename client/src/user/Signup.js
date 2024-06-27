import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Copyright from '../core/Copyright';

import Layout from '../core/Layout';
import { signup } from '../auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    transition: 'box-shadow 0.3s ease-in-out', // Add transition for smooth effect
    '&:hover': {
      boxShadow: '0px 4px 20px rgba(0, 0.3, 0.3, 0.3)', // Add shadow on hover
    },
  },
  textField: {
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      boxShadow: '0px 4px 20px rgba(0, 0.3, 0.3, 0.3)', // Add shadow on hover
    },
  },
}));

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
    role: ''
  });

  const { name, email, password, success, error, role } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault(); // so that browser does not reload
    console.log(role);
    setValues({ ...values, error: false });
    signup({ name, email, password, role }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
        });
      }
    }); // sending js object
  };

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className='alert alert-info'
      style={{ display: success ? '' : 'none' }}
    >
      New account is created. Please <Link to='/signin'>Signin</Link>.
    </div>
  );

  const classes = useStyles();

  const signUpForm = () => (
    <Container component='main' maxWidth='xs'>
      {showSuccess()}
      {showError()}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                onChange={handleChange('name')}
                type='text'
                name='name'
                value={name}
                variant='outlined'
                required
                fullWidth
                id='name'
                label='Full Name'
                autoFocus
                classes={{ root: classes.textField }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                onChange={handleChange('email')}
                type='email'
                value={email}
                autoComplete='off'
                classes={{ root: classes.textField }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                onChange={handleChange('password')}
                value={password}
                autoComplete='current-password'
                classes={{ root: classes.textField }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='role'
                label='Seller or Buyer'
                type='text'
                id='role'
                onChange={handleChange('role')}
                value={role}
                autoComplete='current-password'
                classes={{ root: classes.textField }}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={clickSubmit}
          >
            Sign Up
          </Button>
          <div style={{display:'flex',justifyContent:'center'}}>
            <Grid item>
              <Link to='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </div>
        </form>
      </div>
    </Container>
  );

  return (
    <Layout
      title='Welcome To ShopEase'
      description='Create Your Account'
      className='container col-md-8 offset-md-2'
    >
      {signUpForm()}
      <Copyright />
    </Layout>
  );
}
